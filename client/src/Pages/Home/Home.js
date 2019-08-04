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

  logoutFunction = async () => {
    await this.props.auth.logout();
    sessionStorage.removeItem('DMI_User');
    this.setState({
      isAuthed: false,
    });
  };

  componentDidMount() {
    this.checkAuthentication()
      .then(() => {
        if (this.state.isAuthed) {
          const existingDBUser = sessionStorage.getItem('DMI_User');
          if (existingDBUser !== 'true') {
            this.isExistingUser().then((resp) => {
              if (resp === 'error') {
                // Possible DB error.  Log the user out
                this.logoutFunction().then(() => {
                  alert('There was an error communicating with the Database. Please try again later');
                });
              } else if (!resp) {
                // User does not exist in DB
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

    try {
      await userRequests.getUserByTokenId(token, tokenId.user_id);
      sessionStorage.setItem('DMI_User', 'true');
      return true;
    } catch (error) {
      if (error.response !== undefined && error.response.status === 404) {
        return false;
      } else {
        console.log('Error locating your user account', error);
        // await this.logoutFunction();
        return 'error';
      }
    }
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
