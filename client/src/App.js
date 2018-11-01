import React, { Component } from "react";
import "./App.css";
import AppNavBar from "./components/AppNavbar";
import Login from "./components/Login";
import Register from "./components/Register";
import AddStock from "./components/AddStock";
import Dashboard from "./components/Dashboard";
import Logout from "./components/Logout";
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

  render() {
    console.log(this.state.isLoggedIn);
    return (
      <React.Fragment>
        <AppNavBar />
        <Router>
          <Switch>
            <Route
              path="/login"
              render={props => {
                return this.state.isLoggedIn ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Login toggleLogin={this.toggleLogin} />
                );
              }}
            />
            <Route path="/register" component={Register} />
            <Route path="/addstock" component={AddStock} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/logout" component={Logout} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
