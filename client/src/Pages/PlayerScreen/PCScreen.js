import React from 'react';
import { withAuth } from '@okta/okta-react';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { MDBContainer, MDBCol, MDBRow, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBBtn } from 'mdbreact';
import { Widget, addResponseMessage } from 'react-chat-widget';
import apiKeys from '../../helpers/apiKeys';
import Clock from 'react-live-clock';
import playerCharacterRequests from '../../helpers/data/playerCharacterRequests';
import userRequests from '../../helpers/data/userRequests';
import { Icon } from '@mdi/react';
import { mdiShieldOutline, mdiHeartOutline, mdiHexagonOutline } from '@mdi/js';

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
    currentInitiative: 0,
    characterSelectIsValid: false,
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
    this.signalRConnection.on('ResetInitiative', () => {
      this.setState({
        currentInitiative: 0,
      });
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

  componentWillUnmount() {
    this.signalRConnection.stop();
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
    const selectValue = event.target.value;
    this.setState({
      characterSelectIsValid: selectValue === 'Choose your option' ? false : true,
      inputSelectValue: selectValue,
    });
  };

  loadCharacter = () => {
    const { inputSelectValue, campaignCharacters, signalRGroup } = this.state;
    const chosenCharacter = campaignCharacters.find((char) => char.name === inputSelectValue);
    this.setState({
      selectedCharacter: chosenCharacter,
      currentInitiative: 0,
    });
    this.modalToggle();
    this.signalRConnection.invoke('CharacterJoinedParty', signalRGroup, inputSelectValue);
    this.signalRConnection.invoke('SendCharacterToDM', signalRGroup, chosenCharacter);
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

  sendInitiative = () => {
    const { selectedCharacter, currentInitiative } = this.state;
    const playerInitiative = {
      CharacterName: selectedCharacter.name,
      InitiativeRoll: currentInitiative,
    };
    const groupName = this.props.location.state.campaign.connectionId;
    this.signalRConnection.invoke('SendInitToDm', groupName, playerInitiative);
  };

  characterInitChange = (event) => {
    this.setState({
      currentInitiative: event.target.value * 1,
    });
  };

  render() {
    const {
      messageCount,
      campaignCharacters,
      selectedCharacter,
      currentInitiative,
      characterSelectIsValid,
    } = this.state;
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
              <MDBBtn outline color="success" disabled={!characterSelectIsValid} onClick={this.loadCharacter} size="sm">
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
                <MDBRow>
                  <MDBCol className="pcscreen-stats-col">
                    {/* <Stack size={4.5}> */}
                    <div className="pcscreen-stats-div">
                      <p className="pcscreen-stats-armorclass">{selectedCharacter.armorClass}</p>
                      <Icon
                        className="pcscreen-svg"
                        title="Armor Class"
                        path={mdiShieldOutline}
                        size={4.5}
                        color="#d9b310"
                      />
                      <p className="pcclass-stats-text">Armor Class</p>
                    </div>
                    <div>
                      <p className="pcscreen-stats-hitpoints">{selectedCharacter.hitPoints}</p>
                      <Icon
                        className="pcscreen-svg"
                        title="Hit Point"
                        path={mdiHeartOutline}
                        size={5}
                        color="#d9b310"
                      />
                      <p className="pcclass-stats-text">Hit Points</p>
                      <div className="def-number-input number-input">
                        <button onClick={this.decrease} className="minus" />
                        <input
                          className="hitpoints"
                          name="hitpoints"
                          value={this.state.value}
                          onChange={() => console.log('change')}
                          type="number"
                        />
                        <button onClick={this.increase} className="plus" />
                      </div>
                    </div>
                    <div>
                      <p className="pcscreen-stats-initiative">{currentInitiative === null ? '' : currentInitiative}</p>
                      <Icon
                        className="pcscreen-svg"
                        title="Initiative"
                        path={mdiHexagonOutline}
                        size={5}
                        color="#d9b310"
                      />
                      <p className="pcclass-stats-text">Initiative</p>
                      <div className="def-number-input number-input">
                        <input
                          className="initiative"
                          name="initiative"
                          value={this.state.currentInitiative}
                          onChange={this.characterInitChange}
                          type="number"
                          onBlur={this.sendInitiative}
                        />
                      </div>
                    </div>
                  </MDBCol>
                </MDBRow>
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
            subtitle=""
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
