import React from 'react';
import { withAuth } from '@okta/okta-react';
import apiKeys from '../../helpers/apiKeys';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { MDBContainer, MDBCol, MDBRow } from 'mdbreact';
import Clock from 'react-clock';
import { MessageBox, MessageList } from 'react-chat-elements';
import './DMScreen.scss';

const dmiHubUrl = apiKeys.DMIInsigtsHub.url;

class DMScreen extends React.Component {
  state = {
    date: new Date(),
  };

  signalRConnection = new HubConnectionBuilder().withUrl(dmiHubUrl).build();

  componentDidMount() {
    this.signalRConnection
      .start({ withCRedentials: false })
      .then(() => {
        const groupName = this.props.location.state.campaign.connectionId;
        this.signalRConnection.invoke('AddToGroup', groupName).then((resp) => {
          console.log(resp);
        });
      })
      .catch((error) => console.error('Error connecting to SIgnalR', error));
    setInterval(
      () =>
        this.setState({
          date: new Date(),
        }),
      1000
    );
  }

  render() {
    return (
      <div className="DMScreen">
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol>
              <MDBRow>Inititaive</MDBRow>
              <MDBRow>Players</MDBRow>
              <MDBRow>Monsters</MDBRow>
              <MDBRow>Notes?</MDBRow>
            </MDBCol>
            <MDBCol>
              <MDBRow>
                <Clock value={this.state.date} />
              </MDBRow>
              <MDBRow>Chat</MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default withAuth(DMScreen);
