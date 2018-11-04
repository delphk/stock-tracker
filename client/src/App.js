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

  // Checks whether user is logged in
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
    const { isLoggedIn } = this.state;
    return (
      <Router>
        <React.Fragment>
          <AppNavBar isLoggedIn={isLoggedIn} />

          <Switch>
            <Route
              path="/login"
              render={() => {
                return isLoggedIn ? (
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
                return isLoggedIn ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Redirect to="/login" />
                );
              }}
            />
            <Route
              path="/register"
              render={props => {
                return isLoggedIn ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Register history={props.history} />
                );
              }}
            />
            <Route
              path="/addstock"
              render={props => {
                return isLoggedIn ? (
                  <AddStock history={props.history} />
                ) : (
                  <Redirect to="/login" />
                );
              }}
            />
            <Route
              path="/dashboard"
              render={() => {
                return isLoggedIn ? <Dashboard /> : <Redirect to="/login" />;
              }}
            />
            <Route
              path="/logout"
              render={props => {
                return isLoggedIn ? (
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
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
