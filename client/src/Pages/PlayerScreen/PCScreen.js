import React from 'react';
import { withAuth } from '@okta/okta-react';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { MDBContainer, MDBCol, MDBRow, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBBtn } from 'mdbreact';
import { Widget, addResponseMessage } from 'react-chat-widget';
import apiKeys from '../../helpers/apiKeys';
import Clock from 'react-live-clock';
import playerCharacterRequests from '../../helpers/data/playerCharacterRequests';
import userRequests from '../../helpers/data/userRequests';
import { Icon, Stack } from '@mdi/react';
import { mdiShieldOutline, mdiHeartOutline, mdiHexagonOutline, mdiBlockHelper } from '@mdi/js';

import 'react-chat-widget/lib/styles.css';
import './PCScreen.scss';

const dmiHubUrl = apiKeys.DMIInsigtsHub.url;

class PCScreen extends React.Component {
  state = {
    currentUser: {},
    pcSelectModal: false,
    signalRGroup: '',
    date: new Date(),
    messageCount: 0,
    campaignCharacters: [],
    inputSelectValue: '',
    selectedCharacter: {},
  };

  signalRConnection = new HubConnectionBuilder().withUrl(dmiHubUrl).build();

  setupSignalR = async () => {
    const { currentUser } = this.state;
    this.signalRConnection
      .start({ withCredential: false })
      .then(() => {
        const groupName = this.props.location.state.campaign.connectionId;
        this.signalRConnection.invoke('AddToGroup', groupName, currentUser.name).then(() => {
          this.setState({
            signalRGroup: groupName,
          });
          console.log('Joining SignalR Group: ', groupName);
        });
      })
      .catch((error) => console.error('Error connecting to SignalR', error));
    this.signalRConnection.on('ReceiveMessage', (message) => {
      this.receiveMessage(message);
    });
  };

  modalToggle = () => {
    this.setState({
      pcSelectModal: !this.state.pcSelectModal,
    });
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
    this.getMyCampaignCharacters().then(() => {
      // Updates the clock
      setInterval(() => {
        this.setState({
          date: new Date(),
        });
      }, 1000);
      this.setState({
        pcSelectModal: true,
      });
      this.setupSignalR();
    });
  }

  getMyCampaignCharacters = async () => {
    const { campaign } = this.props.location.state;
    const dbRequest = await this.getDbUserRequestItems();
    playerCharacterRequests
      .getplayerCharactersByUserIdCampaign(dbRequest.accessToken, dbRequest.dbUid, campaign.id)
      .then((resp) => {
        this.setState({
          campaignCharacters: resp,
        });
      });
  };

  selectCharacter = (event) => {
    this.setState({
      inputSelectValue: event.target.value,
    });
  };

  loadCharacter = () => {
    const { inputSelectValue, campaignCharacters, signalRGroup } = this.state;
    const chosenCharacter = campaignCharacters.find((char) => char.name === inputSelectValue);
    this.setState({
      selectedCharacter: chosenCharacter,
    });
    this.modalToggle();
    this.signalRConnection.invoke('CharacterJoinedParty', signalRGroup, inputSelectValue);
  };

  sendMessage = (newMessage) => {
    const { selectedCharacter } = this.state;
    const message = `${selectedCharacter.name}:  ${newMessage}`;
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

  render() {
    const { messageCount, campaignCharacters, selectedCharacter } = this.state;
    return (
      <div className="PCScreen">
        <MDBContainer>
          <MDBModal isOpen={this.state.pcSelectModal} toggle={this.modalToggle} centered backdrop={false} dark>
            <MDBModalHeader toggle={this.modalToggle}>Campaign Character Select?</MDBModalHeader>
            <MDBModalBody>Select your character to play.</MDBModalBody>
            <div className="pcscreen-select-div">
              <select className="browser-default custom-select pcscreen-char-select" onChange={this.selectCharacter}>
                <option className="pcscreen-char-option">Choose your option</option>
                {campaignCharacters.map((character, i) => (
                  <option className="pcscreen-char-select" key={i}>
                    {character.name}
                  </option>
                ))}
              </select>
            </div>
            <MDBModalFooter>
              <MDBBtn outline color="warning" onClick={this.modalToggle} size="sm">
                Cancel
              </MDBBtn>
              <MDBBtn outline color="success" onClick={this.loadCharacter} size="sm">
                Select
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol>
              <MDBRow>
                <MDBCol>
                  <img className="pcscreen-char-img img-fluid" src={selectedCharacter.imageUrl} alt="" />
                </MDBCol>
                <MDBCol className="pcscreen-stats-col">
                  {/* <Stack size={4.5}> */}
                  <div className="pcscreen-stats-div">
                    <p className="pcscreen-stats-armorclass">{selectedCharacter.armorClass}</p>
                    <Icon title="Armor Class" path={mdiShieldOutline} size={4.5} color="#d9b310" />
                    <p>Armor Class</p>
                  </div>
                  <div>
                    <p className="pcscreen-stats-hitpoints">{selectedCharacter.hitPoints}</p>
                    <Icon title="Hit Point" path={mdiHeartOutline} size={5} color="#d9b310" />
                  </div>
                  <div>
                    <p className="pcscreen-stats-initiative" />
                    <Icon title="Initiative" path={mdiHexagonOutline} size={5} color="#d9b310" />
                  </div>
                </MDBCol>
              </MDBRow>
              <MDBRow>Player Stats</MDBRow>
              <MDBRow>Notes?</MDBRow>
            </MDBCol>
            <MDBCol>
              <MDBRow className="pcscreen-clock-row">
                <Clock format={'LT'} ticking={true} style={{ fontSize: '4rem' }} />
              </MDBRow>
            </MDBCol>
          </MDBRow>
          <Widget
            handleNewUserMessage={this.sendMessage}
            title="DM Insights Chat"
            subtitle="Get Funky"
            autoficus="true"
            fullscreenMode="false"
            badge={messageCount}
          />
        </MDBContainer>
      </div>
    );
  }
}

export default withAuth(PCScreen);
