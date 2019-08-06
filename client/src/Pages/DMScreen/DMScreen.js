import React from 'react';
import { withAuth } from '@okta/okta-react';
import apiKeys from '../../helpers/apiKeys';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { MDBContainer, MDBCol, MDBRow, MDBBtn } from 'mdbreact';
import userRequests from '../../helpers/data/userRequests';
import Clock from 'react-live-clock';
import DMScreenPlayerCard from '../../Components/DMScreenPlayerCards/DMScreenPlayerCard';
import DMScreenInitToken from '../../Components/DMScreenInitTokens/DMScreenInitTokens';
import { Widget, addResponseMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';
import './DMScreen.scss';

const dmiHubUrl = apiKeys.DMIInsigtsHub.url;

class DMScreen extends React.Component {
  state = {
    currentUser: {},
    date: new Date(),
    messageCount: 0,
    campaignPlayers: [],
    initTrackerTokens: [],
  };

  signalRConnection = new HubConnectionBuilder()
    .withUrl(dmiHubUrl)
    .withAutomaticReconnect([0, 1000, 5000, 10000, null])
    .configureLogging('information')
    .build();

  setupSignalR = async () => {
    const { currentUser } = this.state;
    this.signalRConnection
      .start({ withCredential: false })
      .then(() => {
        const groupName = this.props.location.state.campaign.connectionId;
        this.signalRConnection.invoke('AddToGroup', groupName, currentUser.name).then(() => {
          console.log('Joining SignalR Group: ', groupName);
        });
      })
      .catch((error) => console.error('Error connecting to SignalR', error));
    // Chat and Notifications to chat ilstener
    this.signalRConnection.on('ReceiveMessage', (message) => {
      this.receiveMessage(message);
    });
    // Get a character that just joined and add to State Listener
    this.signalRConnection.on('NewPlayerToAdd', (newPlayer) => {
      this.setState((prevState) => ({
        campaignPlayers: [...prevState.campaignPlayers, newPlayer],
      }));
    });
    // Player Initiative
    this.signalRConnection.on('PlayerInitiative', (newInitRoll) => {
      if (this.state.initTrackerTokens.length < 1) {
        this.setState((prevInitState) => ({
          initTrackerTokens: [...prevInitState.initTrackerTokens, newInitRoll],
        }));
      } else {
        this.updateInitTokens(newInitRoll).then(() => {
          this.manageInitTokensOrder(newInitRoll);
        });
      }
    });
    // Remove PLayer
    this.signalRConnection.on('RemovePlayerParty', (playerCharacter) => {
      this.removeCampaignPlayer(playerCharacter);
    });
  };

  updateInitTokens = async (newInitRoll) => {
    const tempTokens = [...this.state.initTrackerTokens];
    const tokenIndex = tempTokens.findIndex((token) => token.characterName === newInitRoll.characterName);
    if (tokenIndex > -1) {
      tempTokens[tokenIndex] = newInitRoll;
    } else {
      tempTokens.push(newInitRoll);
    }
    this.setState({
      initTrackerTokens: tempTokens,
    });
  };

  manageInitTokensOrder = (newInitRoll) => {
    const tempTokens = [...this.state.initTrackerTokens];
    if (tempTokens.length > 1) {
      tempTokens.sort((a, b) => a.initiativeRoll - b.initiativeRoll);
      this.setState({
        initTrackerTokens: tempTokens,
      });
    }
  };

  removeCampaignPlayer = (playerCharacter) => {
    let { campaignPlayers } = this.state;
    let characterIndex = campaignPlayers.findIndex((character) => character.name === playerCharacter.name);
    if (characterIndex > -1) {
      campaignPlayers.splice(characterIndex, 1);
      this.setState({
        campaignPlayers: campaignPlayers,
      });
    }
  };

  getAccessToken = async () => {
    return await this.props.auth.getAccessToken();
  };

  getCurrentUser = async () => {
    const user = await this.props.auth.getUser();
    return user;
  };

  getDbUserRequestItems = async () => {
    const accessToken = await this.getAccessToken();
    const tokenId = await this.getCurrentUser();
    const dbUid = await userRequests.getUserByTokenId(accessToken, tokenId.user_id);
    let dbRequestObj = {
      accessToken: accessToken,
      tokenId: tokenId,
      dbUid: dbUid.id,
    };
    this.setState({
      currentUser: tokenId,
    });
    return dbRequestObj;
  };

  componentDidMount() {
    this.getDbUserRequestItems().then(() => {
      this.setupSignalR().then(() => {
        setInterval(
          () =>
            this.setState({
              date: new Date(),
            }),
          1000
        );
      });
    });
  }

  sendMessage = (newMessage) => {
    const message = `DM:  ${newMessage}`;
    this.signalRConnection.invoke('SendMessageToAll', message);
    this.setState({
      messageCount: 0,
    });
  };

  receiveMessage = (message) => {
    addResponseMessage(message);
    this.setState({
      messageCount: this.state.messageCount + 1,
    });
  };

  resetPlayerInitiative = () => {
    const groupName = this.props.location.state.campaign.connectionId;
    this.signalRConnection.invoke('ResetPlayerInit', groupName).then(() => {
      this.setState({
        initTrackerTokens: [],
      });
    });
  };

  render() {
    const { messageCount, campaignPlayers, initTrackerTokens } = this.state;

    const dmPlayerCards = (campaignPlayers) =>
      campaignPlayers.map((character) => <DMScreenPlayerCard key={character.id} character={character} />);

    const initTrackers = (initTrackerTokens) =>
      initTrackerTokens.map((initTracker, index) => <DMScreenInitToken key={index} initTracker={initTracker} />);

    return (
      <div className="DMScreen">
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol size="md-9">
              <h2 className="dmscreen-titles"> Initiative Tracker</h2>
              <MDBRow className="dmscreen-initiative-row">{initTrackers(initTrackerTokens)}</MDBRow>
              <MDBRow end>
                <MDBBtn className="init-reset" outline color="info" onClick={this.resetPlayerInitiative}>
                  Reset initiative
                </MDBBtn>
              </MDBRow>
              <h2 className="dmscreen-titles">Party Tents</h2>
              <MDBRow className="dmscreen-players-row">{dmPlayerCards(campaignPlayers)}</MDBRow>
              {/* <MDBRow className="dmscreen-npc-row">Monsters</MDBRow>
              <MDBRow className="dmscreen-notes-row">Notes?</MDBRow> */}
            </MDBCol>
            <MDBCol className="d-none d-md-block">
              <MDBRow className="dmscreen-clock-row">
                <Clock format={'LT'} ticking={true} style={{ fontSize: '3.5rem' }} />
              </MDBRow>
              <MDBRow>
                <Widget
                  handleNewUserMessage={this.sendMessage}
                  title="DM Insights Chat"
                  subtitle="Get Funky"
                  autoficus="true"
                  fullscreenMode="false"
                  badge={messageCount}
                />
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default withAuth(DMScreen);
