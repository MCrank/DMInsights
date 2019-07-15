import React from 'react';
import { Button } from 'reactstrap';
import logo from './logo.svg';
import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button tag="a" color="info" size="large" href="https://github.com/MCrank/react-nss-template" target="_blank">
          React NSS Template
        </Button>
      </header>
    </div>
  );
}

export default App;
