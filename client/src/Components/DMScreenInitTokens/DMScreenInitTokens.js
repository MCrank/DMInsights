import React from 'react';
import './DMScreenInitTokens.scss';

class DMScreenInitToken extends React.Component {
  render() {
    const { initTracker } = this.props;
    return (
      <div className="DMScreenInitToken">
        <div className="token">
          <h6>{initTracker.characterName}</h6>
          <p>{initTracker.initiativeRoll}</p>
        </div>
      </div>
    );
  }
}

export default DMScreenInitToken;
