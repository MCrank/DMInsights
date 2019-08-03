import React from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol } from 'mdbreact';
import './DMScreenPlayerCard.scss';

class DMScreenPlayerCard extends React.Component {
  render() {
    const { character } = this.props;
    return (
      <div className="DMScreenPlayerCard">
        <MDBCard className="dmscreen-player-card">
          {/* <MDBCardImage className="img-fluid dmscreen-player-card-img" src={character.imageUrl} waves /> */}
          <MDBCardBody>
            <MDBCardTitle className="dmscreen-player-card-title">{character.name}</MDBCardTitle>
            <hr className="dmscreen-player-card-divider" />
            <MDBRow>
              <MDBCol>
                <MDBRow className="dmscreen-player-card-stat">
                  Armor Class: <div>{character.armorClass}</div>
                </MDBRow>
                <MDBRow className="dmscreen-player-card-stat">
                  SpellSave <div>{character.spellSaveDC}</div>
                </MDBRow>
              </MDBCol>
              <MDBCol>
                <MDBRow className="dmscreen-player-card-stat">
                  Perception <div>{character.passivePerception}</div>
                </MDBRow>
                <MDBRow className="dmscreen-player-card-stat">
                  Move Speed<div>{character.moveSpeed}</div>
                </MDBRow>
              </MDBCol>
            </MDBRow>
            <MDBCardText />
          </MDBCardBody>
        </MDBCard>
      </div>
    );
  }
}

export default DMScreenPlayerCard;
