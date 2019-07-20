import React from 'react';
import { withAuth } from '@okta/okta-react';
import './NonPlayerCharacter.scss';

class NonPLayerCharacter extends React.Component {
  render() {
    return (
      <div className="NonPLayerCharacter">
        <h1>NPCs Go here yo!</h1>
      </div>
    );
  }
}

export default withAuth(NonPLayerCharacter);
