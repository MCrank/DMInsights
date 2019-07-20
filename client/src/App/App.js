import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import AppNavbar from '../Components/AppNavbar/AppNavbar';
import Home from '../Pages/Home/Home';
import Login from '../Components/Auth/Login';
import PlayerCharacter from '../Pages/Pc/PlayerCharacter';
import NonPlayerCharacter from '../Pages/Npc/NonPlayerCharacter';
import Campaign from '../Pages/Campaign/Campaign';
import About from '../Pages/About/About';
import apiKeys from '../helpers/apiKeys';

import './App.scss';

const { oktaConfig } = apiKeys;

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Security issuer={oktaConfig.issuer} redirect_uri={oktaConfig.redirect_uri} client_id={oktaConfig.client_id} onAuthRequired={oktaConfig.onAuthRequired}>
            <AppNavbar />
            <Route path="/" exact={true} component={Home} />
            <Route path="/login" render={() => <Login baseUrl="https://dev-531773.okta.com" />} />
            <SecureRoute path="/characters" component={PlayerCharacter} />
            <SecureRoute path="/npcs" component={NonPlayerCharacter} />
            <SecureRoute path="/campaigns" component={Campaign} />
            <SecureRoute path="/about" component={About} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
          </Security>
        </div>
      </Router>
    );
  }
}

export default App;
