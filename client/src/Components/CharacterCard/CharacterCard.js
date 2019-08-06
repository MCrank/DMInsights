import React from 'react';
import { withAuth } from '@okta/okta-react';
import playerCharacterRequests from '../../helpers/data/playerCharacterRequests';
import campaignRequests from '../../helpers/data/campaignRequests';
import { Link } from 'react-router-dom';
import {
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
  MDBCardFooter,
  MDBBtn,
  MDBIcon,
  MDBContainer,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from 'mdbreact';
import './CharacterCard.scss';

class CharacterCard extends React.Component {
  state = {
    deleteModal: false,
    joinModal: false,
    removeModal: false,
    campaignCode: '',
  };

  modalToggle = (modalName) => () => {
    this.setState({
      [modalName]: !this.state[modalName],
    });
  };

  getAccessToken = async () => {
    return await this.props.auth.getAccessToken();
  };

  formFieldStringState = (field, event) => {
    event.preventDefault();
    const tempChar = { ...this.state.campaignCode };
    tempChar[field] = event.target.value;
    this.setState({
      campaignCode: tempChar,
    });
  };

  campaignCodeChange = (event) => this.formFieldStringState('campaignCode', event);

  deletePlayerCharacter = async () => {
    const accessToken = await this.getAccessToken();
    const characterId = this.props.character.id;
    const { getPlayerCharacters } = this.props;
    await playerCharacterRequests.deletePlayerCharacter(accessToken, characterId).then((resp) => {
      if (resp.status === 204) {
        this.modalToggle('deleteModal');
        getPlayerCharacters();
      } else {
        console.error('There was an error deleting the character, please try again later');
      }
    });
  };

  joinPCToCampaign = async () => {
    const accessToken = await this.getAccessToken();
    const { campaignCode } = this.state.campaignCode;
    const { character, getPlayerCharacters } = this.props;
    const selectedCampaign = await campaignRequests.getCampaignByConnectionId(accessToken, campaignCode);
    character.campaignId = selectedCampaign.id;
    await playerCharacterRequests
      .updatePlayerCharacter(accessToken, character)
      .then(() => {
        this.setState({
          joinModal: false,
        });
        getPlayerCharacters();
      })
      .catch((error) => {
        console.error('An error occured joining you to the campaign ', error);
      });
  };

  removeCampaign = async () => {
    const accessToken = await this.getAccessToken();
    const { character, getPlayerCharacters } = this.props;
    character.campaignId = null;
    await playerCharacterRequests
      .updatePlayerCharacter(accessToken, character)
      .then(() => {
        this.setState({
          removeModal: false,
        });
        getPlayerCharacters();
      })
      .catch((error) => {
        console.error('An error occured removing you from the campaign', error);
      });
  };

  render() {
    const { character } = this.props;
    return (
      <React.Fragment>
        <MDBContainer>
          <MDBModal
            isOpen={this.state.deleteModal}
            toggle={this.modalToggle('deleteModal')}
            centered
            backdrop={false}
            dark
          >
            <MDBModalHeader toggle={this.modalToggle('deleteModal')}>Delete {character.name} ?</MDBModalHeader>
            <MDBModalBody>Are you sure you want to delete this character?</MDBModalBody>
            <MDBModalFooter>
              <MDBBtn outline color="success" onClick={this.modalToggle('deleteModal')} size="sm">
                Cancel
              </MDBBtn>
              <MDBBtn outline color="danger" onClick={this.deletePlayerCharacter} size="sm">
                Delete
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
          <MDBModal isOpen={this.state.joinModal} toggle={this.modalToggle('joinModal')} centered backdrop={false} dark>
            <MDBModalHeader toggle={this.modalToggle('joinModal')}>Join this campaign?</MDBModalHeader>
            <MDBModalBody>
              <MDBInput type="text" label="Campaign Code" icon="user-secret" onChange={this.campaignCodeChange} />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn outline color="warning" onClick={this.modalToggle('joinModal')} size="sm">
                Cancel
              </MDBBtn>
              <MDBBtn outline color="success" onClick={this.joinPCToCampaign} size="sm">
                Join
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
          <MDBModal
            isOpen={this.state.removeModal}
            toggle={this.modalToggle('removeModal')}
            centered
            backdrop={false}
            dark
          >
            <MDBModalHeader toggle={this.modalToggle('removeModal')}>Leave Campaign?</MDBModalHeader>
            <MDBModalBody>Are you sure you want to leave this campaign?</MDBModalBody>
            <MDBModalFooter>
              <MDBBtn outline color="warning" onClick={this.modalToggle('removeModal')} size="sm">
                Cancel
              </MDBBtn>
              <MDBBtn outline color="success" onClick={this.removeCampaign} size="sm">
                Leave
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
        {/* <MDBCol className="character-card-main-col"> */}
        <MDBCard className="character-card z-depth-2">
          <MDBRow className="no-gutters">
            <MDBCol className="col-md-4">
              <MDBCardImage className="img-fluid character-img" src={character.imageUrl} waves />
            </MDBCol>
            <MDBCol className="col-md-8">
              <MDBCardBody>
                <MDBRow className="card-title-row">
                  <MDBCol className="col-md-4">
                    <MDBCardTitle className="character-card-name h3-responsive">{character.name}</MDBCardTitle>
                  </MDBCol>
                  <MDBCol className="col-md-8">
                    <MDBCardTitle className="character-card-class h3-responsive">
                      Level: {character.level} {character.characterRace}/{character.classes}
                    </MDBCardTitle>
                  </MDBCol>
                </MDBRow>
                <hr className="character-card-separator" />
                <MDBRow start>
                  <MDBCol className="col-md-6">
                    <MDBCardText className="character-card-stats h4-responsive">
                      Hit Points: {character.hitPoints}
                    </MDBCardText>
                    <MDBCardText className="character-card-stats h4-responsive">
                      Armor Class: {character.armorClass}
                    </MDBCardText>
                    <MDBCardText className="character-card-stats h4-responsive">
                      Move Speed: {character.moveSpeed}
                    </MDBCardText>
                    <MDBCardText className="character-card-stats h4-responsive">
                      Passive Perception: {character.passivePerception}
                    </MDBCardText>
                  </MDBCol>
                  <MDBCol className="col-md-6">
                    <MDBCardText className="character-card-stats h4-responsive">
                      Initiative Modifier: {character.initiativeModifier}
                    </MDBCardText>
                    <MDBCardText className="character-card-stats h4-responsive">
                      Spell Save DC: {character.spellSaveDC}
                    </MDBCardText>
                    <MDBCardText className="character-card-stats h4-responsive">
                      Hit Points: {character.hitPoints}
                    </MDBCardText>
                    <MDBCardText className="character-card-stats h4-responsive">
                      Hit Points: {character.hitPoints}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
              <MDBCardFooter className="character-card-footer">
                <MDBCardText className="character-card-footer-text">{character.description}</MDBCardText>
              </MDBCardFooter>
              <MDBCardFooter>
                <MDBRow className="character-card-btn-row">
                  {character.campaignId === null ? (
                    <MDBBtn
                      className="character-card-btn"
                      outline
                      color="info"
                      size="sm"
                      onClick={this.modalToggle('joinModal')}
                    >
                      Join Campaign <MDBIcon className="character-card-btn-icon" icon="dragon" />
                    </MDBBtn>
                  ) : (
                    <MDBBtn
                      className="character-card-btn"
                      outline
                      color="info"
                      size="sm"
                      onClick={this.modalToggle('removeModal')}
                    >
                      Remove Campaign <MDBIcon className="character-card-btn-icon" icon="dragon" />
                    </MDBBtn>
                  )}
                  <Link to={{ pathname: '/playercharacterform', state: { character, isEditing: true } }}>
                    <MDBBtn className="character-card-btn" outline color="warning" size="sm" onClick={this.editPc}>
                      Edit <MDBIcon className="character-card-btn-icon" icon="edit" />
                    </MDBBtn>
                  </Link>
                  <MDBBtn
                    className="character-card-btn"
                    outline
                    color="danger"
                    size="sm"
                    onClick={this.modalToggle('deleteModal')}
                  >
                    Delete <MDBIcon className="character-card-btn-icon" icon="user-times" />
                  </MDBBtn>
                </MDBRow>
              </MDBCardFooter>
            </MDBCol>
          </MDBRow>
        </MDBCard>
        {/* </MDBCol> */}
      </React.Fragment>
    );
  }
}

export default withAuth(CharacterCard);
