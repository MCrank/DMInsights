import React from 'react';
import { withAuth } from '@okta/okta-react';
import userRequests from '../../../helpers/data/userRequests';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInput } from 'mdbreact';
import './NonPlayerCharacterForm.scss';
import nonPlayerCharacterRequests from '../../../helpers/data/nonPlayerCharacterRequests';

const defaultNpc = {
  name: '',
  hitPoints: 0,
  armorClass: 0,
  description: '',
  imageUrl: 'https://pbs.twimg.com/media/CuL5z4JUMAEFS17.jpg',
  moveSpeed: 0,
  ownerId: 0,
  characterRace: '',
  characterType: '',
  passivePerception: 0,
  initiativeModifier: 0,
  spellSaveDC: 0,
  challengeRating: 0,
};

class NonPlayerCharacter extends React.Component {
  state = {
    npc: defaultNpc,
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
          npc: this.props.location.state.npc,
        });
      }
    }
  }

  formFieldStringState = (field, event) => {
    event.preventDefault();
    const tempNpc = { ...this.state.npc };
    tempNpc[field] = event.target.value;
    this.setState({
      npc: tempNpc,
    });
  };

  formFieldNumberState = (field, event) => {
    const tempNpc = { ...this.state.npc };
    tempNpc[field] = event.target.value * 1;
    this.setState({
      npc: tempNpc,
    });
  };

  npcNameChange = (event) => this.formFieldStringState('name', event);

  npcACChange = (event) => this.formFieldNumberState('armorClass', event);

  npcHPChange = (event) => this.formFieldNumberState('hitPoints', event);

  npcPerceptionChange = (event) => this.formFieldNumberState('passivePerception', event);

  npcSpellDCChange = (event) => this.formFieldNumberState('spellSaveDC', event);

  npcInitModChange = (event) => this.formFieldNumberState('initiativeModifier', event);

  npcMoveSpeedChange = (event) => this.formFieldNumberState('moveSpeed', event);

  npcCrChange = (event) => this.formFieldNumberState('challengeRating', event);

  npcImageChange = (event) => this.formFieldStringState('imageUrl', event);

  npcRaceChange = (event) => this.formFieldStringState('characterRace', event);

  npcTypeChange = (event) => this.formFieldStringState('characterType', event);

  npcDescChange = (event) => this.formFieldStringState('description', event);

  previousPage = () => {
    this.props.history.goBack();
  };

  npcFormSubmit = async () => {
    const { npc } = this.state;
    const dbRequest = await this.getDbUserRequestItems();
    npc.ownerId = dbRequest.dbUid;

    if (this.props.location.state.isEditing) {
      console.log('Edit Request Goes here');
      nonPlayerCharacterRequests.updateNonPlayerCharacter(dbRequest.accessToken, npc).then((resp) => {
        console.log(resp);
        this.props.history.push('/npcs');
      });
    } else {
      nonPlayerCharacterRequests.createNonPlayerCharacter(dbRequest.accessToken, npc).then((resp) => {
        this.props.history.push('/npcs');
      });
    }
  };

  render() {
    const { npc } = this.state;

    return (
      <div className="NonPlayerCharacterForm">
        <MDBContainer>
          <div className="white-text">
            <MDBRow>
              <MDBCol md="4">
                <MDBInput label="Name" icon="address-card" size="lg" value={npc.name} onChange={this.npcNameChange} />
              </MDBCol>
              <MDBCol md="3">
                {/* <MDBInput label="Class" icon="theater-masks" size="lg" value={npc.classes} onChange={this.characterClassChange} /> */}
                <MDBInput label="Race" icon="dna" size="lg" value={npc.characterRace} onChange={this.npcRaceChange} />
              </MDBCol>
              <MDBCol md="3">
                <MDBInput label="Type" icon="fingerprint" size="lg" value={npc.characterType} onChange={this.npcTypeChange} />
              </MDBCol>
              <MDBCol md="2">
                <MDBInput type="number" label="CR" icon="sort-amount-up" size="lg" step=".25" value={npc.challengeRating} onChange={this.npcCrChange} />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="3" className="d-flex justify-content-center img-parent">
                <img src={npc.imageUrl} className="img-thumbnail" alt="" />
              </MDBCol>
              <MDBCol md="9">
                {/* <MDBRow>
                  <MDBCol>
                    <MDBInput label="Race" icon="dna" size="lg" value={npc.characterRace} onChange={this.characterRaceChange} />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput label="Type" icon="fingerprint" size="lg" value={npc.characterType} onChange={this.characterTypeChange} />
                  </MDBCol>
                </MDBRow> */}
                <MDBRow>
                  <MDBCol>
                    <MDBInput type="number" label="Armor Class" icon="shield-alt" size="lg" value={npc.armorClass} onChange={this.npcACChange} />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput type="number" label="Spell Save DC" icon="magic" size="lg" value={npc.spellSaveDC} onChange={this.npcSpellDCChange} />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput type="number" label="Initiative Modifier" icon="hourglass-start" size="lg" value={npc.initiativeModifier} onChange={this.npcInitModChange} />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput type="number" label="Hit Points" icon="heart" size="lg" value={npc.hitPoints} onChange={this.npcHPChange} />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      type="number"
                      label="Passive Perception"
                      icon="assistive-listening-systems"
                      size="lg"
                      value={npc.passivePerception}
                      onChange={this.npcPerceptionChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput type="number" label="Movement Speed" icon="running" size="lg" value={npc.moveSpeed} onChange={this.npcMoveSpeedChange} />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput label="Description" icon="portrait" size="lg" type="textarea" value={npc.description} onChange={this.npcDescChange} />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput label="Image URL" icon="image" size="lg" value={npc.imageUrl} onChange={this.npcImageChange} />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
            <MDBCol>
              <MDBRow className="justify-content-around">
                <MDBBtn className="character-card-btn" outline color="info" onClick={this.previousPage}>
                  Go Back <MDBIcon className="character-card-btn-icon" fas="true" icon="arrow-circle-left" size="lg" />
                </MDBBtn>
                <MDBBtn className="character-card-btn" outline color="info" onClick={this.npcFormSubmit}>
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

export default withAuth(NonPlayerCharacter);
