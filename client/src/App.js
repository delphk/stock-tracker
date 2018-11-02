import React, { Component } from "react";
import "./App.css";
import AppNavBar from "./components/AppNavbar";
import Login from "./components/Login";
import Register from "./components/Register";
import AddStock from "./components/AddStock";
import Dashboard from "./components/Dashboard";
import Logout from "./components/Logout";
import NotFound from "./components/NotFound";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  state = { isLoggedIn: false };

  toggleLogin = () => {
    this.setState({ isLoggedIn: !this.state.isLoggedIn });
  };

  async componentDidMount() {
    try {
      const request = await fetch("/stocks", {
        method: "get"
      });
      const response = await request.json();
      if (response.stocks) {
        this.setState({ isLoggedIn: true });
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    console.log(this.state.isLoggedIn);
    return (
      <React.Fragment>
        <Router>
          <div>
            <AppNavBar isLoggedIn={this.state.isLoggedIn} />

            <Switch>
              <Route
                path="/login"
                render={() => {
                  return this.state.isLoggedIn ? (
                    <Redirect to="/dashboard" />
                  ) : (
                    <Login toggleLogin={this.toggleLogin} />
                  );
                }}
              />
              <Route
                exact
                path="/"
                render={() => {
                  return this.state.isLoggedIn ? (
                    <Redirect to="/dashboard" />
                  ) : (
                    <Redirect to="/login" />
                  );
                }}
              />
              <Route
                path="/register"
                render={() => {
                  return this.state.isLoggedIn ? (
                    <Redirect to="/dashboard" />
                  ) : (
                    <Register />
                  );
                }}
              />
              <Route
                path="/addstock"
                render={() => {
                  return this.state.isLoggedIn ? (
                    <AddStock />
                  ) : (
                    <Redirect to="/login" />
                  );
                }}
              />
              <Route
                path="/dashboard"
                render={() => {
                  return this.state.isLoggedIn ? (
                    <Dashboard />
                  ) : (
                    <Redirect to="/login" />
                  );
                }}
              />
              <Route
                path="/logout"
                render={props => {
                  return this.state.isLoggedIn ? (
                    <Logout
                      history={props.history}
                      toggleLogin={this.toggleLogin}
                    />
                  ) : (
                    <Redirect to="/login" />
                  );
                }}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
