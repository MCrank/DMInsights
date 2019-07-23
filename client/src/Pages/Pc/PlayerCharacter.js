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
    isLoading: true,
  };

  getAccessToken = async () => {
    return await this.props.auth.getAccessToken();
  };

  getCurrentUser = async () => {
    const user = await this.props.auth.getUser();
    return user;
  };

  componentDidMount() {
    this.getPlayerCharacters().then(() => {
      this.setState({
        isLoading: false,
      });
    });
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
    const { playerCharacters, isLoading } = this.state;

    const characterCards = (playerCharacters) => playerCharacters.map((character, index) => <CharacterCard key={character.id} character={character} />);

    return (
      <div className="PlayerCharacter">
        {isLoading ? (
          <MDBContainer className="d-flex justify-content-center pt-3">
            <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </MDBContainer>
        ) : (
          ''
        )}
        <MDBContainer className="character-cards-main-container">{characterCards(playerCharacters)}</MDBContainer>
      </div>
    );
  }
}

export default withAuth(PlayerCharacter);
