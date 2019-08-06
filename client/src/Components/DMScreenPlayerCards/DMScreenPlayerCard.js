import React from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBAnimation } from 'mdbreact';
import './DMScreenPlayerCard.scss';

class DMScreenPlayerCard extends React.Component {
  render() {
    const { character } = this.props;
    return (
      <div className="DMScreenPlayerCard">
        <MDBAnimation type="zoomIn" duration="2s">
          <MDBCard className="dmscreen-player-card">
            <img src={character.imageUrl} alt="charcter" className="dmscreen-player-card-image" />
            <div className="card-img-overlay">
              <MDBCardBody className="dmscreen-player-card-body">
                {/* <MDBCardImage className="img-fluid dmscreen-player-card-img" src={character.imageUrl} waves /> */}
                {/* background: linear-gradient(rgba(29, 39, 49, 0.7), rgba(29, 39, 49, 0.7)),
          url(https://gamepedia.cursecdn.com/witcher_gamepedia/c/c3/Tw3_cardart_northernrealms_keira.png); */}
                {/* <MDBCardBody
            styles={{
              background: 'linear-gradient(rgba(29, 39, 49, 0.7), rgba(29, 39, 49, 0.7)), url({character.imageUrl});',
            }}
          > */}
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
            </div>
          </MDBCard>
        </MDBAnimation>
      </div>
    );
  }
}

export default DMScreenPlayerCard;
