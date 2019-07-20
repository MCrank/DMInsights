import React from 'react';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  // MDBFormInline,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdbreact';
import { withAuth } from '@okta/okta-react';

import './AppNavbar.scss';

class AppNavbar extends React.Component {
  state = {
    isAuthed: false,
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
    this.setState({
      isAuthed: false,
    });
  };

  componentDidMount() {
    this.checkAuthentication();
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

  render() {
    const { isAuthed } = this.state;
    const buidlNavbar = () => {
      if (isAuthed) {
        return (
          <MDBNavbarNav right>
            <MDBNavItem active>
              <MDBNavLink to="#!">Home</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="#!">Characters</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="#!">Campaigns</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <span className="mr-2">Profile</span>
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem href="#!">Action</MDBDropdownItem>
                  <hr />
                  <MDBDropdownItem onClick={this.logoutFunction}>Logout</MDBDropdownItem>
                  {/* <MDBDropdownItem href="#!">Something else here</MDBDropdownItem>
                    <MDBDropdownItem href="#!">Something else here</MDBDropdownItem> */}
                </MDBDropdownMenu>
              </MDBDropdown>
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
      // <div className="AppNavbar">
      <MDBNavbar color="indigo" dark expand="md">
        <MDBNavbarBrand>
          <strong className="white-text">DM InSights</strong>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={this.toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
          {buidlNavbar()}
          {/* <MDBNavbarNav right>
          <MDBNavItem>
            <MDBFormInline waves>
              <div className="md-form my-0">
                <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
              </div>
            </MDBFormInline>
          </MDBNavItem>
        </MDBNavbarNav> */}
        </MDBCollapse>
      </MDBNavbar>
      // </div>);
    );
  }
}

export default withAuth(AppNavbar);
