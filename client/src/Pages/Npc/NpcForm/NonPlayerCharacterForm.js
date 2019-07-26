import React from 'react';
import { withAuth } from '@okta/okta-react';
import userRequests from '../../../helpers/data/userRequests';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInput } from 'mdbreact';
import './NonPlayerCharacterForm.scss';

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
    console.log(this.props);
    if (this.props.location.state !== undefined) {
      if (this.props.location.state.isEditing) {
        this.setState({
          npc: this.props.location.state.npc,
        });
      }
    }
  }

  previousPage = () => {
    this.props.history.goBack();
  };

  render() {
    const { npc } = this.state;

    return (
      <div className="NonPlayerCharacterForm">
        <MDBContainer>
          <div className="white-text">
            <MDBRow>
              <MDBCol md="5">
                <MDBInput label="Name" icon="address-card" size="lg" value={npc.name} onChange={this.characterNameChange} />
              </MDBCol>
              <MDBCol md="5">
                <MDBInput label="Class" icon="theater-masks" size="lg" value={npc.classes} onChange={this.characterClassChange} />
              </MDBCol>
              <MDBCol md="2">
                <MDBInput type="number" label="Level" icon="sort-amount-up" size="lg" value={npc.level} onChange={this.characterLevelChange} />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="3" className="d-flex justify-content-center img-parent">
                <img src={npc.imageUrl} className="img-thumbnail" alt="" />
              </MDBCol>
              <MDBCol md="9">
                <MDBRow>
                  <MDBCol>
                    <MDBInput label="Race" icon="dna" size="lg" value={npc.characterRace} onChange={this.characterRaceChange} />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput label="Type" icon="fingerprint" size="lg" value={npc.characterType} onChange={this.characterTypeChange} />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput type="number" label="Armor Class" icon="shield-alt" size="lg" value={npc.armorClass} onChange={this.characterACChange} />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput type="number" label="Spell Save DC" icon="magic" size="lg" value={npc.spellSaveDC} onChange={this.characterSpellDCChange} />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput type="number" label="Initiative Modifier" icon="hourglass-start" size="lg" value={npc.initiativeModifier} onChange={this.characterInitModChange} />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput type="number" label="Hit Points" icon="heart" size="lg" value={npc.hitPoints} onChange={this.characterHPChange} />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      type="number"
                      label="Passive Perception"
                      icon="assistive-listening-systems"
                      size="lg"
                      value={npc.passivePerception}
                      onChange={this.characterPerceptionChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput type="number" label="Movement Speed" icon="running" size="lg" value={npc.moveSpeed} onChange={this.characterMoveSpeedChange} />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput label="Description" icon="portrait" size="lg" type="textarea" value={npc.description} onChange={this.characterDescChange} />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput label="Image URL" icon="image" size="lg" value={npc.imageUrl} onChange={this.characterImageChange} />
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

export default withAuth(NonPlayerCharacter);
