import React from "react";
import { Route, Redirect } from "react-router-dom";
import Spinner from "./spinner/Spinner";

const AuthenticatedRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn === true ? (
          <Component {...props} />
        ) : isLoggedIn === false ? (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        ) : (
          <Spinner />
        )
      }
    />
  );
};

export default AuthenticatedRoute;
