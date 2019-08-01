import React from 'react';
import { withAuth } from '@okta/okta-react';
import apiKeys from '../../helpers/apiKeys';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { MDBContainer, MDBCol, MDBRow } from 'mdbreact';
import userRequests from '../../helpers/data/userRequests';
import Clock from 'react-live-clock';
import { Widget, addResponseMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';
import './DMScreen.scss';

const dmiHubUrl = apiKeys.DMIInsigtsHub.url;

class DMScreen extends React.Component {
  state = {
    currentUser: {},
    date: new Date(),
    messageCount: 0,
  };

  signalRConnection = new HubConnectionBuilder().withUrl(dmiHubUrl).build();

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
    this.signalRConnection.on('ReceiveMessage', (message) => {
      this.receiveMessage(message);
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
    this.getDbUserRequestItems().then(() => {
      this.setupSignalR();
      setInterval(
        () =>
          this.setState({
            date: new Date(),
          }),
        1000
      );
    });
  }

  sendMessage = (newMessage) => {
    const { currentUser } = this.state;
    const message = `DM:  ${newMessage}`;
    this.signalRConnection.invoke('SendMessageToAll', newMessage);
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
    const { messageCount } = this.state;

    return (
      <div className="DMScreen">
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol>
              <MDBRow className="dmscreen-initiative-row">Inititaive</MDBRow>
              <MDBRow className="dmscreen-players-row">Players</MDBRow>
              <MDBRow className="dmscreen-npc-row">Monsters</MDBRow>
              <MDBRow className="dmscreen-notes-row">Notes?</MDBRow>
            </MDBCol>
            <MDBCol>
              <MDBRow className="dmscreen-clock-row">
                <Clock format={'LT'} ticking={true} style={{ fontSize: '4rem' }} />
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
