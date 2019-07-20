import React from 'react';
import { withAuth } from '@okta/okta-react';
import './PlayerCharacter.scss';

class PlayerCharacter extends React.Component {
  render() {
    return (
      <div className="PlayerCharacter">
        <h1>Characters</h1>
      </div>
    );
  }
}

export default withAuth(PlayerCharacter);
