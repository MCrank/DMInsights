import React from 'react';
import { withAuth } from '@okta/okta-react';
import playerCharacterRequests from '../../../helpers/data/playerCharacterRequests';
import userRequests from '../../../helpers/data/userRequests';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInput } from 'mdbreact';
import './PlayerCharacterForm.scss';

const defaultCharacter = {
  name: '',
  hitPoints: 0,
  armorClass: 0,
  description: '',
  imageUrl: 'http://images.uncyclomedia.co/uncyclopedia/en/8/83/Alfred2.jpg',
  moveSpeed: 0,
  ownerId: 0,
  characterRace: '',
  characterType: '',
  passivePerception: 0,
  initiativeModifier: 0,
  spellSaveDC: 0,
  classes: '',
  level: 0,
  campaignId: null,
};

class PlayerCharacterForm extends React.Component {
  state = {
    character: defaultCharacter,
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
    return dbRequestObj;
  };

  componentDidMount() {
    if (this.props.location.state !== undefined) {
      if (this.props.location.state.isEditing) {
        this.setState({
          character: this.props.location.state.character,
        });
      }
    }
  }

  formFieldStringState = (field, event) => {
    event.preventDefault();
    const tempChar = { ...this.state.character };
    tempChar[field] = event.target.value;
    this.setState({
      character: tempChar,
    });
  };

  formFieldNumberState = (field, event) => {
    const tempChar = { ...this.state.character };
    tempChar[field] = event.target.value * 1;
    this.setState({
      character: tempChar,
    });
  };

  characterNameChange = (event) => this.formFieldStringState('name', event);

  characterACChange = (event) => this.formFieldNumberState('armorClass', event);

  characterHPChange = (event) => this.formFieldNumberState('hitPoints', event);

  characterPerceptionChange = (event) => this.formFieldNumberState('passivePerception', event);

  characterSpellDCChange = (event) => this.formFieldNumberState('spellSaveDC', event);

  characterInitModChange = (event) => this.formFieldNumberState('initiativeModifier', event);

  characterMoveSpeedChange = (event) => this.formFieldNumberState('moveSpeed', event);

  characterLevelChange = (event) => this.formFieldNumberState('level', event);

  characterImageChange = (event) => this.formFieldStringState('imageUrl', event);

  characterClassChange = (event) => this.formFieldStringState('classes', event);

  characterRaceChange = (event) => this.formFieldStringState('characterRace', event);

  characterTypeChange = (event) => this.formFieldStringState('characterType', event);

  characterDescChange = (event) => this.formFieldStringState('description', event);

  previousPage = () => {
    this.props.history.goBack();
  };

  characterFormSubmit = async () => {
    const { character } = this.state;
    const dbRequest = await this.getDbUserRequestItems();
    character.ownerId = dbRequest.dbUid;

    if (this.props.location.state.isEditing) {
      playerCharacterRequests.updatePlayerCharacter(dbRequest.accessToken, character).then((resp) => {
        console.log(resp);
        this.props.history.push('/characters');
      });
    } else {
      playerCharacterRequests.createPlayerCharacter(dbRequest.accessToken, character).then((resp) => {
        this.props.history.push('/characters');
      });
    }
  };

  render() {
    const { character } = this.state;

    return (
      <div className="PlayerCharacterForm">
        <MDBContainer>
          <div className="white-text">
            <MDBRow>
              <MDBCol md="5">
                <MDBInput label="Name" icon="address-card" size="lg" value={character.name} onChange={this.characterNameChange} />
              </MDBCol>
              <MDBCol md="5">
                <MDBInput label="Class" icon="theater-masks" size="lg" value={character.classes} onChange={this.characterClassChange} />
              </MDBCol>
              <MDBCol md="2">
                <MDBInput type="number" label="Level" icon="sort-amount-up" size="lg" value={character.level} onChange={this.characterLevelChange} />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="3" className="d-flex justify-content-center">
                <img src={character.imageUrl} className="img-thumbnail" alt="" />
              </MDBCol>
              <MDBCol md="9">
                <MDBRow>
                  <MDBCol>
                    <MDBInput label="Race" icon="dna" size="lg" value={character.characterRace} onChange={this.characterRaceChange} />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput label="Type" icon="fingerprint" size="lg" value={character.characterType} onChange={this.characterTypeChange} />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput type="number" label="Armor Class" icon="shield-alt" size="lg" value={character.armorClass} onChange={this.characterACChange} />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput type="number" label="Spell Save DC" icon="magic" size="lg" value={character.spellSaveDC} onChange={this.characterSpellDCChange} />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      type="number"
                      label="Initiative Modifier"
                      icon="hourglass-start"
                      size="lg"
                      value={character.initiativeModifier}
                      onChange={this.characterInitModChange}
                    />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput type="number" label="Hit Points" icon="heart" size="lg" value={character.hitPoints} onChange={this.characterHPChange} />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      type="number"
                      label="Passive Perception"
                      icon="assistive-listening-systems"
                      size="lg"
                      value={character.passivePerception}
                      onChange={this.characterPerceptionChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput type="number" label="Movement Speed" icon="running" size="lg" value={character.moveSpeed} onChange={this.characterMoveSpeedChange} />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput label="Description" icon="portrait" size="lg" type="textarea" value={character.description} onChange={this.characterDescChange} />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput label="Image URL" icon="image" size="lg" value={character.imageUrl} onChange={this.characterImageChange} />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
            <MDBCol>
              <MDBRow className="justify-content-around">
                <MDBBtn className="character-card-btn" outline color="info" onClick={this.previousPage}>
                  Go Back <MDBIcon className="character-card-btn-icon" fas icon="arrow-circle-left" size="lg" />
                </MDBBtn>
                <MDBBtn className="character-card-btn" outline color="info" onClick={this.characterFormSubmit}>
                  Save <MDBIcon className="character-card-btn-icon" far icon="save" size="lg" />
                </MDBBtn>
              </MDBRow>
            </MDBCol>
          </div>
        </MDBContainer>
      </div>
    );
  }
}

export default withAuth(PlayerCharacterForm);
