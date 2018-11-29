import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { userLogout } from "../../helpers/api/api";

class Logout extends Component {
  async componentDidMount() {
    try {
      await userLogout();
      this.props.toggleLogin();
      this.props.history.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return <div style={{ textAlign: "center" }}>Logged out!</div>;
  }
}

export default withRouter(Logout);
