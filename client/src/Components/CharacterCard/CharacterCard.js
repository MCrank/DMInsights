import React from 'react';
import { MDBCol, MDBRow, MDBCard, MDBCardImage, MDBCardBody, MDBCardText, MDBCardTitle, MDBCardFooter } from 'mdbreact';
import './CharacterCard.scss';

class CharacterCard extends React.Component {
  render() {
    const { character } = this.props;
    return (
      // <div className="CharacterCard">
      // <MDBRow>
      <MDBCol>
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
                    <MDBCardText className="character-card-stats h4-responsive">Hit Points: {character.hitPoints}</MDBCardText>
                    <MDBCardText className="character-card-stats h4-responsive">Armor Class: {character.armorClass}</MDBCardText>
                    <MDBCardText className="character-card-stats h4-responsive">Move Speed: {character.moveSpeed}</MDBCardText>
                    <MDBCardText className="character-card-stats h4-responsive">Passive Perception: {character.passivePerception}</MDBCardText>
                  </MDBCol>
                  <MDBCol className="col-md-6">
                    <MDBCardText className="character-card-stats h4-responsive">Initiative Modifier: {character.initiativeModifier}</MDBCardText>
                    <MDBCardText className="character-card-stats h4-responsive">Spell Save DC: {character.spellSaveDC}</MDBCardText>
                    <MDBCardText className="character-card-stats h4-responsive">Hit Points: {character.hitPoints}</MDBCardText>
                    <MDBCardText className="character-card-stats h4-responsive">Hit Points: {character.hitPoints}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <MDBCardFooter className="character-card-footer">
                  <MDBCardText className="character-card-footer-text">{character.description}</MDBCardText>
                </MDBCardFooter>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBCol>
      // </MDBRow>
      // </div>
    );
  }
}

export default CharacterCard;