import React from 'react';
import { withAuth } from '@okta/okta-react';
import './Campaign.scss';

class Campaign extends React.Component {
  render() {
    return (
      <div className="Campaign">
        <h1>Campaigns Are Cool AF</h1>
      </div>
    );
  }
}

export default withAuth(Campaign);
