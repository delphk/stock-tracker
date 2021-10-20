import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import AppNavBar from "./components/navbar/AppNavbar";
import LoginForm from "./routes/login/Login";
import RegistrationForm from "./routes/register/Register";
import AddStock from "./routes/addstock/AddStock";
import Dashboard from "./routes/dashboard/Dashboard";
import Logout from "./routes/logout/Logout";
import NotFound from "./routes/notfound/NotFound";
import Settings from "./routes/settings/Settings";
import { authenticationCheck } from "./helpers/api/api";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  // Checks whether user is logged in
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await authenticationCheck();
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    }
    checkLogin();
  }, []);

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
                  <LoginForm toggleLogin={toggleLogin} />
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
              toggleLogin={toggleLogin}
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
};

export default App;
