import React from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBIcon } from 'mdbreact';
import { withAuth } from '@okta/okta-react';

import './AppNavbar.scss';

class AppNavbar extends React.Component {
  state = {
    isAuthed: false,
    activeLink: 'Home',
  };

  checkAuthentication = async () => {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({
        isAuthed: authenticated,
      });
    }
  };

  logoutFunction = async () => {
    await this.props.auth.logout();
    sessionStorage.removeItem('DMI_User');
    this.setState({
      isAuthed: false,
    });
  };

  componentDidMount() {
    this.checkAuthentication();
    this.setState({
      activeLink: window.location.pathname,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth === this.props.auth) {
      this.checkAuthentication();
    }
  }

  toggleCollapse = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  linkClick = (e) => {
    this.setState({
      activeLink: e.target.pathname,
    });
  };

  render() {
    const { isAuthed, activeLink } = this.state;
    const buidlNavbar = () => {
      if (isAuthed) {
        return (
          <MDBNavbarNav right>
            <MDBNavItem className={activeLink === '/' ? 'active' : 'default'}>
              <MDBNavLink to="/" onClick={this.linkClick}>
                <MDBIcon className="nav-icon" icon="home" size="lg" />
                Home
              </MDBNavLink>
            </MDBNavItem>
            <div className="nav-divider" />
            <MDBNavItem className={activeLink === '/characters' ? 'active' : 'default'}>
              <MDBNavLink to="/characters" onClick={this.linkClick}>
                <MDBIcon className="nav-icon" icon="users" size="lg" />
                Characters
              </MDBNavLink>
            </MDBNavItem>
            <div className="nav-divider" />
            <MDBNavItem className={activeLink === '/npcs' ? 'active' : 'default'}>
              <MDBNavLink to="/npcs" onClick={this.linkClick}>
                <MDBIcon className="nav-icon" icon="pastafarianism" size="lg" />
                NPCs
              </MDBNavLink>
            </MDBNavItem>
            <div className="nav-divider" />
            <MDBNavItem className={activeLink === '/campaigns' ? 'active' : 'default'}>
              <MDBNavLink to="/campaigns" onClick={this.linkClick}>
                <MDBIcon className="nav-icon" icon="atlas" size="lg" />
                Campaigns
              </MDBNavLink>
            </MDBNavItem>
            <div className="nav-divider" />
            <MDBNavItem className={activeLink === '/about' ? 'active' : 'default'}>
              <MDBNavLink to="/about" onClick={this.linkClick}>
                <MDBIcon className="nav-icon" icon="question-circle" size="lg" />
                About
              </MDBNavLink>
            </MDBNavItem>
            <div className="nav-divider" />
            <MDBNavItem>
              <MDBNavLink to="#!" onClick={this.logoutFunction}>
                <MDBIcon className="nav-icon" icon="sign-out-alt" size="lg" />
                Logout
              </MDBNavLink>
            </MDBNavItem>
          </MDBNavbarNav>
        );
      }
      return (
        <MDBNavbarNav right>
          <MDBNavItem active>
            <MDBNavLink to="/login">Login</MDBNavLink>
          </MDBNavItem>
        </MDBNavbarNav>
      );
    };

    return (
      <MDBNavbar className="app-navbar" color="unique-color" dark expand="md" fixed="top">
        <MDBNavbarBrand>
          <strong className="white-text">DM InSights</strong>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={this.toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
          {buidlNavbar()}
        </MDBCollapse>
      </MDBNavbar>
    );
  }
}

export default withAuth(AppNavbar);
