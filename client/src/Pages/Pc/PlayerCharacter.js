import React from 'react';
import { MDBContainer } from 'mdbreact';
import { withAuth } from '@okta/okta-react';
import playerCharacters from '../../helpers/data/playerCharacterRequests';
import userRequests from '../../helpers/data/userRequests';
import CharacterCard from '../../Components/CharacterCard/CharacterCard';
import './PlayerCharacter.scss';

class PlayerCharacter extends React.Component {
  state = {
    playerCharacters: [],
  };

  getAccessToken = async () => {
    return await this.props.auth.getAccessToken();
  };

  getCurrentUser = async () => {
    const user = await this.props.auth.getUser();
    return user;
  };

  componentDidMount() {
    this.getPlayerCharacters();
  }

  getPlayerCharacters = async () => {
    const accessToken = await this.getAccessToken();
    const tokenId = await this.getCurrentUser();
    const dbUid = await userRequests.getUserByTokenId(accessToken, tokenId.user_id);
    playerCharacters
      .getplayerCharactersByUserId(dbUid.id, accessToken)
      .then((resp) => {
        this.setState({
          playerCharacters: resp,
        });
      })
      .catch((error) => console.error(error));
  };

  render() {
    const { playerCharacters } = this.state;

    const characterCards = (playerCharacters) => playerCharacters.map((character, index) => <CharacterCard key={character.id} character={character} />);

    return (
      <div className="PlayerCharacter">
        <MDBContainer className="character-cards-main-container">{characterCards(playerCharacters)}</MDBContainer>
      </div>
    );
  }
}

export default withAuth(PlayerCharacter);
