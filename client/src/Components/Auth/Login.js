import React from 'react';
import { Redirect } from 'react-router-dom';
import SignInWidget from './SignInWidget';
import { withAuth } from '@okta/okta-react';

class Login extends React.Component {
  state = {
    isAuthed: null,
  };

  checkAuthentication = async () => {
    const isAuthed = await this.props.auth.isAuthenticated();
    if (isAuthed !== this.state.isAuthed) {
      this.setState({
        isAuthed,
      });
    }
  };

  componentDidMount() {
    this.checkAuthentication();
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  onSuccess = (res) => {
    return this.props.auth.handleAuthentication();
  };

  onError = (err) => {
    console.error('Error logging in', err);
  };

  render() {
    if (this.state.isAuthed === null) {
      return null;
    }
    return this.state.isAuthed ? <Redirect to={{ pathname: '/' }} /> : <SignInWidget baseUrl={this.props.baseUrl} onSuccess={this.onSuccess} onError={this.onError} />;
  }
}

export default withAuth(Login);
