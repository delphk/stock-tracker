import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class Logout extends Component {
  async componentDidMount() {
    try {
      const request = await fetch("/users/logout", {
        method: "post",
        headers: { "Content-Type": "application/json" }
      });
      await request.json();
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
