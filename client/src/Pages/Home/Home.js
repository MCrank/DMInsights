import React from 'react';
import userRequests from '../../helpers/data/userRequests';
import { withAuth } from '@okta/okta-react';
import './Home.scss';

class Home extends React.Component {
  state = {
    isAuthed: false,
  };

  checkAuthentication = async () => {
    const isAuthed = await this.props.auth.isAuthenticated();
    if (isAuthed !== this.state.isAuthed) {
      this.setState({
        isAuthed,
      });
    }
  };

  getCurrentUser = async () => {
    const user = await this.props.auth.getUser();
    return user;
  };

  getIdToken = async () => {
    return await this.props.auth.getIdToken();
  };

  getAccessToken = async () => {
    return await this.props.auth.getAccessToken();
  };

  componentDidMount() {
    this.checkAuthentication()
      .then(() => {
        if (this.state.isAuthed) {
          const existingDBUser = sessionStorage.getItem('DMI_User');
          if (existingDBUser !== 'true') {
            this.isExistingUser().then((resp) => {
              if (!resp) {
                this.createNewUser();
              }
            });
          }
        }
      })
      .catch((error) => console.error(error));
  }

  // Checking if current logged in user exists in SQL DB
  isExistingUser = async () => {
    const token = await this.getAccessToken();
    const tokenId = await this.getCurrentUser();
    userRequests
      .getUserByTokenId(token, tokenId.user_id)
      .then(() => {
        sessionStorage.setItem('DMI_User', 'true');
        return true;
      })
      .catch((error) => {
        const responseCode = error.response;
        if (error.reponse !== undefined) {
          if (responseCode.status === 404) {
            return false;
          }
        } else {
          console.error(error);
        }
      });
  };

  createNewUser = async () => {
    const token = await this.getAccessToken();
    const userAttr = await this.getCurrentUser();
    const newUserObj = {};
    newUserObj.FirstName = userAttr.dmi_firstName;
    newUserObj.LastName = userAttr.dmi_lastName;
    newUserObj.idToken = userAttr.sub;
    userAttr.dmi_userName !== undefined
      ? (newUserObj.UserName = userAttr.dmi_userName)
      : (newUserObj.UserName = userAttr.preferred_username);

    userRequests
      .createNewUser(token, newUserObj)
      .then((res) => {
        sessionStorage.setItem('DMI_User', 'true');
      })
      .catch((error) => console.error('Error creating user account', error));
  };

  render() {
    return (
      <div className="Home">
        <h1>Home Page</h1>
      </div>
    );
  }
}

export default withAuth(Home);
