import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import AppNavbar from '../Components/AppNavbar/AppNavbar';
import Home from '../Pages/Home/Home';
import Login from '../Components/Auth/Login';
import PlayerCharacter from '../Pages/Pc/PlayerCharacter';
import PlayerCharacterForm from '../Pages/Pc/PcForm/PlayerCharacterForm';
import NonPlayerCharacter from '../Pages/Npc/NonPlayerCharacter';
import NonPlayerCharacterForm from '../Pages/Npc/NpcForm/NonPlayerCharacterForm';
import Campaign from '../Pages/Campaign/Campaign';
import CampaignForm from '../Pages/Campaign/CampaignForm/CampaignForm';
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
            <SecureRoute path="/playercharacterform" component={PlayerCharacterForm} />
            <SecureRoute path="/npcs" component={NonPlayerCharacter} />
            <SecureRoute path="/npcform" component={NonPlayerCharacterForm} />
            <SecureRoute path="/campaigns" component={Campaign} />
            <SecureRoute path="/campaignform" component={CampaignForm} />
            <SecureRoute path="/about" component={About} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
          </Security>
        </div>
      </Router>
    );
  }
}

export default App;
