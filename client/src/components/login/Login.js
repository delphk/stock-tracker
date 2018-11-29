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
import axios from "axios";

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
      const response = await axios({
        method: "post",
        url: "/users/login",
        data: this.state
      });
      if (response) {
        this.props.toggleLogin();
      }
    } catch (err) {
      this.setState({ errorMessage: err.response.data.error.message });
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
              id="username"
              type="text"
              name="username"
              value={this.state.username}
              placeholder="Enter username"
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              id="password"
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
