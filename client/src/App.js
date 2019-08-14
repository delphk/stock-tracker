import React, { Component } from "react";
import "./App.css";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
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

class App extends Component {
  state = { isLoggedIn: undefined };

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
      this.setState({ isLoggedIn: false });
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
            <AuthenticatedRoute
              isLoggedIn={isLoggedIn}
              exact
              path="/"
              component={Dashboard}
            />
            <Route
              path="/register"
              render={() => {
                return isLoggedIn ? <Redirect to="/dashboard" /> : <Register />;
              }}
            />
            <AuthenticatedRoute
              isLoggedIn={isLoggedIn}
              path="/settings"
              component={Settings}
            />
            <AuthenticatedRoute
              isLoggedIn={isLoggedIn}
              path="/dashboard"
              component={Dashboard}
            />
            <AuthenticatedRoute
              isLoggedIn={isLoggedIn}
              path="/addstock"
              component={AddStock}
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
