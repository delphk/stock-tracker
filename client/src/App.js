import React, { Component } from "react";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import AppNavBar from "./components/navbar/AppNavbar";
import LoginForm from "./routes/login/Login";
import RegistrationForm from "./routes/register/Register";
import AddStock from "./routes/addstock/AddStock";
import Dashboard from "./routes/dashboard/Dashboard";
import Logout from "./routes/logout/Logout";
import NotFound from "./routes/notfound/NotFound";
import Settings from "./routes/settings/Settings";
import { getStocks } from "./helpers/api/api";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

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
          <div role="main">
            <Switch>
              <Route
                path="/login"
                render={() => {
                  return isLoggedIn ? (
                    <Redirect to="/dashboard" />
                  ) : (
                    <LoginForm toggleLogin={this.toggleLogin} />
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
                  return isLoggedIn ? (
                    <Redirect to="/dashboard" />
                  ) : (
                    <RegistrationForm />
                  );
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
              <AuthenticatedRoute
                toggleLogin={this.toggleLogin}
                isLoggedIn={isLoggedIn}
                path="/logout"
                component={Logout}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
