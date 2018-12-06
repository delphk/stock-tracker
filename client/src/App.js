import React, { Component } from "react";
import "./App.css";
import AppNavBar from "./components/navbar/AppNavbar";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import AddStock from "./components/addstock/AddStock";
import Dashboard from "./components/dashboard/Dashboard";
import Logout from "./components/logout/Logout";
import NotFound from "./components/notfound/NotFound";
import Settings from "./components/settings/Settings";
import { getStocks } from "./helpers/api/api";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

function PrivateRoute({ component: Component, isLoggedIn }) {
  return (
    <Route
      render={props =>
        isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

class App extends Component {
  state = { isLoggedIn: false };

  toggleLogin = () => {
    this.setState({ isLoggedIn: !this.state.isLoggedIn });
  };

  // Checks whether user is logged in
  async componentDidMount() {
    try {
      const response = await getStocks();
      if (response.data.stocks) {
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
              render={() => {
                return isLoggedIn ? <Redirect to="/dashboard" /> : <Register />;
              }}
            />

            <PrivateRoute
              path="/settings"
              component={Settings}
              isLoggedIn={isLoggedIn}
            />
            <PrivateRoute
              path="/dashboard"
              component={Dashboard}
              isLoggedIn={isLoggedIn}
            />
            <PrivateRoute
              path="/addstock"
              component={AddStock}
              isLoggedIn={isLoggedIn}
            />
            <Route
              path="/logout"
              render={() => {
                return isLoggedIn ? (
                  <Logout toggleLogin={this.toggleLogin} />
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
