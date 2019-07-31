import React from 'react';
import { withAuth } from '@okta/okta-react';
import apiKeys from '../../helpers/apiKeys';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { MDBContainer, MDBCol, MDBRow } from 'mdbreact';
import Clock from 'react-live-clock';
import { Widget, addResponseMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';
import './PCScreen.scss';

const dmiHubUrl = apiKeys.DMIInsigtsHub.url;

class PCScreen extends React.Component {
  state = {
    date: new Date(),
    messageCount: 0,
  };

  signalRConnection = new HubConnectionBuilder().withUrl(dmiHubUrl).build();

  componentDidMount() {
    this.signalRConnection
      .start({ withCredential: false })
      .then(() => {
        const groupName = this.props.location.state.connectionId;
        this.signalRConnection.invoke('AddToGroup', groupName).then(() => {});
      })
      .catch((error) => console.error('Error connecting to SignalR', error));
    this.signalRConnection.on('RecieveMessage', (message) => {
      this.receiveMessage(message);
    });
    // Updates the clock
    setInterval(() => {
      this.setState({
        date: new Date(),
      });
    }, 1000);
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
      <div className="PCScreen">
        <Clock format={'LT'} ticking={true} style={{ fontSize: '4rem' }} />
      </div>
    );
  }
}

export default withAuth(PCScreen);
