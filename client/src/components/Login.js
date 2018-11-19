import React from "react";
import {
  Alert,
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    errorMessage: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    try {
      const request = await fetch("/users/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      });
      const response = await request.json();
      if (response.user) {
        this.props.toggleLogin();
      } else {
        this.setState({ errorMessage: response.error.message });
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <Container>
        {this.state.errorMessage && (
          <Alert color="danger">{this.state.errorMessage}</Alert>
        )}
        <h2>Account Login</h2>
        <Form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              type="text"
              name="username"
              value={this.state.username}
              placeholder="Enter username"
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              value={this.state.password}
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
