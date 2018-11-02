import React, { Component } from "react";

class Logout extends Component {
  async componentDidMount() {
    const request = await fetch("/users/logout", {
      method: "post",
      headers: { "Content-Type": "application/json" }
    });
    await request.json();
    this.props.toggleLogin();
    this.props.history.push("/");
  }

  render() {
    console.log(this.props);
    return <div style={{ textAlign: "center" }}>Logged out!</div>;
  }
}

export default Logout;
