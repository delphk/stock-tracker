import React, { Component } from "react";
import "./App.css";
import AppNavBar from "./components/AppNavbar";
import Login from "./components/Login";
import Register from "./components/Register";
import AddStock from "./components/AddStock";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <AppNavBar />
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/addstock" component={AddStock} />
            <Route path="/dashboard" component={Dashboard} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
