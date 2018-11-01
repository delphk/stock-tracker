import React, { Component } from "react";

class Logout extends Component {
  async componentDidMount() {
    const request = await fetch("/users/logout", {
      method: "post",
      headers: { "Content-Type": "application/json" }
    });
    const response = await request.json();
    console.log(response);
    this.props.history.push("/login");
  }

  render() {
    return <div>Logged out!</div>;
  }
}

export default Logout;
