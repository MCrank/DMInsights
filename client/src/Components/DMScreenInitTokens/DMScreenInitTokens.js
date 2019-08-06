import React from 'react';
import { MDBIcon, MDBAnimation } from 'mdbreact';
import './DMScreenInitTokens.scss';

class DMScreenInitToken extends React.Component {
  render() {
    const { initTracker } = this.props;
    return (
      <MDBAnimation type="rollIn" duration="1s">
        <div className="DMScreenInitToken">
          <div className="token">
            <h6>{initTracker.characterName}</h6>
            <MDBIcon icon="dice-d20" size="3x" />
            <p>{initTracker.initiativeRoll}</p>
          </div>
        </div>
      </MDBAnimation>
    );
  }
}

export default DMScreenInitToken;
