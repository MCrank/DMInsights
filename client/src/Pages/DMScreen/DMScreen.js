import React from 'react';
import { withAuth } from '@okta/okta-react';
import apiKeys from '../../helpers/apiKeys';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { MDBContainer, MDBCol, MDBRow } from 'mdbreact';
import Clock from 'react-live-clock';
import { Widget, addResponseMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';
import './DMScreen.scss';

const dmiHubUrl = apiKeys.DMIInsigtsHub.url;

class DMScreen extends React.Component {
  state = {
    date: new Date(),
    messageCount: 0,
  };

  signalRConnection = new HubConnectionBuilder().withUrl(dmiHubUrl).build();

  componentDidMount() {
    this.signalRConnection
      .start({ withCRedentials: false })
      .then(() => {
        const groupName = this.props.location.state.campaign.connectionId;
        this.signalRConnection.invoke('AddToGroup', groupName).then((resp) => {});
      })
      .catch((error) => console.error('Error connecting to SIgnalR', error));
    this.signalRConnection.on('ReceiveMessage', (message) => {
      this.ReceiveMessage(message);
    });
    setInterval(
      () =>
        this.setState({
          date: new Date(),
        }),
      1000
    );
  }

  sendMessage = (newMessage) => {
    this.signalRConnection.invoke('SendMessageToAll', newMessage);
    this.setState({
      messageCount: 0,
    });
  };

  ReceiveMessage = (message) => {
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
                <Clock format={'LTS'} ticking={true} timezone={'US/Central'} style={{ fontSize: '4rem' }} />
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
