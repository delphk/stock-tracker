import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  Container
} from "reactstrap";
import { NavLink } from "react-router-dom";

class AppNavBar extends Component {
  state = {
    isOpen: false
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="sm" className="mb-5">
          <Container>
            <NavLink id="navbarbrand" to="/">
              $tockTracker
            </NavLink>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                {!this.props.isLoggedIn && (
                  <React.Fragment>
                    <NavItem>
                      <NavLink
                        id="navbarlink"
                        to="/login"
                        activeStyle={{
                          color: "#d4d3d3"
                        }}
                      >
                        Login
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        id="navbarlink"
                        to="/register"
                        activeStyle={{
                          color: "#d4d3d3"
                        }}
                      >
                        Register
                      </NavLink>
                    </NavItem>
                  </React.Fragment>
                )}
                {this.props.isLoggedIn && (
                  <React.Fragment>
                    <NavItem>
                      <NavLink
                        id="navbarlink"
                        to="/addstock"
                        activeStyle={{
                          color: "#d4d3d3"
                        }}
                      >
                        Add stocks
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        id="navbarlink"
                        to="/dashboard"
                        activeStyle={{
                          color: "#d4d3d3"
                        }}
                      >
                        Dashboard
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        id="navbarlink"
                        to="/logout"
                        activeStyle={{
                          color: "#d4d3d3"
                        }}
                      >
                        Logout
                      </NavLink>
                    </NavItem>
                  </React.Fragment>
                )}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default AppNavBar;
