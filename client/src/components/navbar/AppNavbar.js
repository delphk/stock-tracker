import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  Container
} from "reactstrap";
import { NavLink } from "react-router-dom";
import stocker from "../../assets/stocker.png";

const AppNavBar = ({ isLoggedIn }) => {
  const [isOpen, toggleOpen] = useState(false);

  return (
    <div>
      <Navbar color="secondary" dark expand="sm">
        <Container>
          <img
            id="logo"
            alt="logo"
            src={stocker}
            style={{ width: "40px", height: "40px" }}
          />
          <NavLink id="navbarbrand" to="/">
            $TOCKER
          </NavLink>
          <NavbarToggler onClick={() => toggleOpen(!isOpen)} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {isLoggedIn ? (
                <React.Fragment>
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
                      to="/settings"
                      activeStyle={{
                        color: "#d4d3d3"
                      }}
                    >
                      Settings
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
              ) : (
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
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default AppNavBar;
