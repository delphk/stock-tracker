import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container
} from "reactstrap";
import { Link } from "react-router-dom";

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
            <NavbarBrand href="/">$tockInfo</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                {!this.props.isLoggedIn && (
                  <React.Fragment>
                    <NavItem>
                      <Link to="/login">Login</Link>
                    </NavItem>
                    <NavItem>
                      <Link to="/register">Register</Link>
                    </NavItem>
                  </React.Fragment>
                )}
                {this.props.isLoggedIn && (
                  <React.Fragment>
                    <NavItem>
                      <Link to="/addstock">Add stocks</Link>
                    </NavItem>
                    <NavItem>
                      <Link to="/dashboard">Dashboard</Link>
                    </NavItem>
                    <NavItem>
                      <Link to="/logout">Logout</Link>
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
