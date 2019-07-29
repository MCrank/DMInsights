import React from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBBtn, MDBIcon } from 'mdbreact';
import { withAuth } from '@okta/okta-react';
import userRequests from '../../helpers/data/userRequests';
import nonPlayerCharacterRequests from '../../helpers/data/nonPlayerCharacterRequests';
import NpcCard from '../../Components/NpcCards/NpcCard';
import './NonPlayerCharacter.scss';

class NonPlayerCharacter extends React.Component {
  state = {
    npcs: [],
    isLoading: true,
  };

  getAccessToken = async () => {
    return await this.props.auth.getAccessToken();
  };

  getCurrentUser = async () => {
    const user = await this.props.auth.getUser();
    return user;
  };

  getDbUserRequestItems = async () => {
    const accessToken = await this.getAccessToken();
    const tokenId = await this.getCurrentUser();
    const dbUid = await userRequests.getUserByTokenId(accessToken, tokenId.user_id);
    let dbRequestObj = {
      accessToken: accessToken,
      tokenId: tokenId,
      dbUid: dbUid.id,
    };
    return dbRequestObj;
  };

  componentDidMount() {
    this.getNonPlayerCharacters().then(() => {
      this.setState({
        isLoading: false,
      });
    });
  }

  getNonPlayerCharacters = async () => {
    const dbRequest = await this.getDbUserRequestItems();
    nonPlayerCharacterRequests
      .getNonPlayerCharactersByUserId(dbRequest.accessToken, dbRequest.dbUid)
      .then((resp) => {
        this.setState({
          npcs: resp,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    const { npcs, isLoading } = this.state;

    const npcCards = (npcs) =>
      npcs.map((npc, index) => <NpcCard key={npc.id} npc={npc} getNonPlayerCharacters={this.getNonPlayerCharacters} />);

    return (
      <div className="NonPlayerCharacter">
        {isLoading ? (
          <MDBContainer className="d-flex justify-content-center pt-3">
            <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </MDBContainer>
        ) : (
          ''
        )}
        <Link to={{ pathname: '/npcform', state: { isEditing: false } }}>
          <MDBContainer className="d-flex justify-content-end">
            <MDBBtn className="npc-card-btn" outline color="info">
              New NPC <MDBIcon className="npc-card-btn-icon" icon="plus-circle" />
            </MDBBtn>
          </MDBContainer>
        </Link>
        <MDBContainer className="npc-cards-main-container">{npcCards(npcs)}*/}</MDBContainer>
      </div>
    );
  }
}

export default withAuth(NonPlayerCharacter);
