import React from 'react';
import { withAuth } from '@okta/okta-react';
import { HubConnectionBuilder } from '@aspnet/signalr';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBInput,
} from 'mdbreact';
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
    currentInitiative: '',
    characterSelectIsValid: false,
    showCharacterStats: false,
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
    const { signalRGroup, selectedCharacter } = this.state;
    this.signalRConnection.invoke('CharacterLeaveParty', signalRGroup, selectedCharacter);
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
      showCharacterStats: true,
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
      showCharacterStats,
    } = this.state;
    return (
      <div className="PCScreen">
        <MDBContainer fluid>
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
        {showCharacterStats ? (
          <MDBContainer>
            <MDBRow>
              <MDBCol md="4">
                <MDBInput
                  className="pcscreen-character-text"
                  label="Name"
                  icon="address-card"
                  size="lg"
                  value={selectedCharacter.name}
                  disabled
                />
              </MDBCol>
              <MDBCol md="3">
                <MDBInput
                  className="pcscreen-character-text"
                  label="Race"
                  icon="dna"
                  size="lg"
                  value={selectedCharacter.characterRace}
                  disabled
                />
              </MDBCol>
              <MDBCol md="3">
                <MDBInput
                  className="pcscreen-character-text"
                  label="Class"
                  icon="theater-masks"
                  size="lg"
                  value={selectedCharacter.classes}
                  disabled
                />
              </MDBCol>
              <MDBCol md="2">
                <MDBInput
                  className="pcscreen-character-text"
                  type="number"
                  label="Level"
                  icon="sort-amount-up"
                  size="lg"
                  value={selectedCharacter.level}
                  disabled
                />
              </MDBCol>
            </MDBRow>
            <MDBRow className="pcscreen-main-char-row">
              <MDBCol sm="12" md="4" className="pcscreen-img-col">
                <img className="pcscreen-char-img" src={selectedCharacter.imageUrl} alt="" />
              </MDBCol>
              <MDBCol sm="12" md="6" className="pcscreen-stats-col">
                <div className="pcscreen-stats-div">
                  <p className="pcscreen-stats-armorclass">{selectedCharacter.armorClass}</p>
                  <Icon
                    className="pcscreen-svg pcscreen-svg-armor"
                    title="Armor Class"
                    path={mdiShieldOutline}
                    size={4.5}
                    color="#d9b310"
                  />
                  <p className="pcclass-stats-text ac-text">Armor Class</p>
                </div>
                <div>
                  <p className="pcscreen-stats-hitpoints">{selectedCharacter.hitPoints}</p>
                  <Icon className="pcscreen-svg" title="Hit Point" path={mdiHeartOutline} size={5} color="#d9b310" />
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
                  <Icon className="pcscreen-svg" title="Initiative" path={mdiHexagonOutline} size={5} color="#d9b310" />
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
              <MDBCol className="d-none d-md-block">
                <MDBRow className="pcscreen-clock-row">
                  <Clock format={'LT'} ticking={true} style={{ fontSize: '3rem' }} />
                </MDBRow>
              </MDBCol>
            </MDBRow>
            <MDBContainer>
              <MDBRow>
                <MDBCol>
                  <MDBRow center>
                    <MDBCol md="4" sm="12">
                      <MDBInput
                        label="Type"
                        icon="fingerprint"
                        size="lg"
                        value={selectedCharacter.characterType}
                        disabled
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow center>
                    <MDBCol md="4" sm="12">
                      <MDBInput
                        type="number"
                        label="Spell Save DC"
                        icon="magic"
                        size="lg"
                        value={selectedCharacter.spellSaveDC}
                        disabled
                      />
                    </MDBCol>
                    <MDBCol md="4" sm="12">
                      <MDBInput
                        type="number"
                        label="Initiative Modifier"
                        icon="hourglass-start"
                        size="lg"
                        value={selectedCharacter.initiativeModifier}
                        disabled
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow center>
                    <MDBCol md="4" sm="12">
                      <MDBInput
                        type="number"
                        label="Passive Perception"
                        icon="assistive-listening-systems"
                        size="lg"
                        value={selectedCharacter.passivePerception}
                        disabled
                      />
                    </MDBCol>
                    <MDBCol md="4" sm="12">
                      <MDBInput
                        type="number"
                        label="Movement Speed"
                        icon="running"
                        size="lg"
                        value={selectedCharacter.moveSpeed}
                        disabled
                      />
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
            <Widget
              handleNewUserMessage={this.sendMessage}
              title="DM Insights Chat"
              subtitle=""
              autoficus="true"
              fullscreenMode="false"
              badge={messageCount}
            />
          </MDBContainer>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default withAuth(PCScreen);
