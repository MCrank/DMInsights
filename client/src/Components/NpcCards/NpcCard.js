import React from 'react';
import { withAuth } from '@okta/okta-react';
import nonPlayerCharacterRequests from '../../helpers/data/nonPlayerCharacterRequests';
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
} from 'mdbreact';

import './NpcCard.scss';

class NpcCard extends React.Component {
  state = {
    deleteModal: false,
  };

  modalToggle = () => {
    this.setState({
      deleteModal: !this.state.deleteModal,
    });
  };

  getAccessToken = async () => {
    return await this.props.auth.getAccessToken();
  };

  deleteNonPlayerCharacter = async () => {
    const accessToken = await this.getAccessToken();
    const npcId = this.props.npc.id;
    const { getNonPlayerCharacters } = this.props;
    await nonPlayerCharacterRequests.deleteNonPlayerCharacter(accessToken, npcId).then((resp) => {
      if (resp.status === 204) {
        this.modalToggle();
        getNonPlayerCharacters();
      } else {
        console.error('There was an error deleting the character, please try again later');
      }
    });
  };

  render() {
    const { npc } = this.props;
    return (
      <React.Fragment>
        <MDBContainer>
          <MDBModal isOpen={this.state.deleteModal} toggle={this.modalToggle} centered backdrop={false} dark>
            <MDBModalHeader toggle={this.modalToggle}>Delete {npc.name} ?</MDBModalHeader>
            <MDBModalBody>Are you sure you want to delete this NPC?</MDBModalBody>
            <MDBModalFooter>
              <MDBBtn outline color="success" onClick={this.modalToggle} size="sm">
                Cancel
              </MDBBtn>
              <MDBBtn outline color="danger" onClick={this.deleteNonPlayerCharacter} size="sm">
                Delete
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
        <MDBCol className="character-card-main-col">
          <MDBCard className="character-card z-depth-2">
            <MDBRow className="no-gutters">
              <MDBCol className="col-md-4">
                <MDBCardImage className="img-fluid character-img" src={npc.imageUrl} waves />
              </MDBCol>
              <MDBCol className="col-md-8">
                <MDBCardBody>
                  <MDBRow className="card-title-row">
                    <MDBCol className="col-md-4">
                      <MDBCardTitle className="character-card-name h3-responsive">{npc.name}</MDBCardTitle>
                    </MDBCol>
                    <MDBCol className="col-md-4">
                      <MDBCardTitle className="character-card-class h3-responsive">CR: {npc.challengeRating}</MDBCardTitle>
                    </MDBCol>
                    <MDBCol className="col-md-4">
                      <MDBCardTitle className="npc-card-type h3-responsive">Type: {npc.characterType}</MDBCardTitle>
                    </MDBCol>
                  </MDBRow>
                  <hr className="character-card-separator" />
                  <MDBRow start>
                    <MDBCol className="col-md-6">
                      <MDBCardText className="character-card-stats h4-responsive">Hit Points: {npc.hitPoints}</MDBCardText>
                      <MDBCardText className="character-card-stats h4-responsive">Armor Class: {npc.armorClass}</MDBCardText>
                      <MDBCardText className="character-card-stats h4-responsive">Move Speed: {npc.moveSpeed}</MDBCardText>
                      <MDBCardText className="character-card-stats h4-responsive">Passive Perception: {npc.passivePerception}</MDBCardText>
                    </MDBCol>
                    <MDBCol className="col-md-6">
                      <MDBCardText className="character-card-stats h4-responsive">Initiative Modifier: {npc.initiativeModifier}</MDBCardText>
                      <MDBCardText className="character-card-stats h4-responsive">Spell Save DC: {npc.spellSaveDC}</MDBCardText>
                      <MDBCardText className="character-card-stats h4-responsive">Hit Points: {npc.hitPoints}</MDBCardText>
                      <MDBCardText className="character-card-stats h4-responsive">Hit Points: {npc.hitPoints}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
                <MDBCardFooter className="character-card-footer">
                  <MDBCardText className="character-card-footer-text">{npc.description}</MDBCardText>
                </MDBCardFooter>
                <MDBCardFooter>
                  <MDBRow className="character-card-btn-row">
                    <Link to={{ pathname: '/npcform', state: { npc, isEditing: true } }}>
                      <MDBBtn className="character-card-btn" outline color="warning" size="sm" onClick={this.editPc}>
                        Edit <MDBIcon className="character-card-btn-icon" icon="edit" />
                      </MDBBtn>
                    </Link>
                    <MDBBtn className="character-card-btn" outline color="danger" size="sm" onClick={this.modalToggle}>
                      Delete <MDBIcon className="character-card-btn-icon" icon="user-times" />
                    </MDBBtn>
                  </MDBRow>
                </MDBCardFooter>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </React.Fragment>
    );
  }
}

export default withAuth(NpcCard);
