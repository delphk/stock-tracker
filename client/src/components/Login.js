import React from "react";
import { Container, Button, Form, FormGroup, Label, Input } from "reactstrap";

class Login extends React.Component {
  state = {
    username: "",
    password: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    fetch("/users/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    })
      .then(response => response.json())
      .then(res => console.log(res));
  };

  render() {
    return (
      <Container>
        <h2>Account Login</h2>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              placeholder="Enter username"
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              placeholder="Enter password"
            />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      </Container>
    );
  }
}

export default Login;
