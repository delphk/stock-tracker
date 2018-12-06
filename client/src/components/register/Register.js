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
import { withRouter } from "react-router-dom";
import { registerUser } from "../../helpers/api/api";

class Register extends React.Component {
  state = {
    name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
    errorMessage: "",
    successMessage: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  ValidateEmail(mail) {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { name, username, email, password, password2 } = this.state;
    if (password !== password2) {
      return this.setState({ errorMessage: "Passwords do not match" });
    } else if (!name || !email || !username || !password) {
      return this.setState({ errorMessage: "Please fill up all fields" });
    } else if (!this.ValidateEmail(email)) {
      return this.setState({ errorMessage: "Please enter a valid email" });
    }
    try {
      const response = await registerUser(this.state);
      if (response.data.user) {
        this.setState({
          errorMessage: "",
          successMessage: "You have successfully registered!"
        });

        setTimeout(() => {
          this.props.history.push("/login");
        }, 3000);
      } else if (response.data.message) {
        if (response.data.message.match(/username/)) {
          this.setState({ errorMessage: "Username has been taken" });
        } else if (response.data.message.match(/email/)) {
          this.setState({
            errorMessage: "An account with this email already exists"
          });
        }
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
        {this.state.successMessage && (
          <Alert color="success">{this.state.successMessage}</Alert>
        )}
        <h2>Create your account</h2>
        <Form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={this.state.name}
              placeholder="Enter name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={this.state.username}
              placeholder="Enter username"
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={this.state.email}
              placeholder="Enter email"
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
          <FormGroup>
            <Label for="password2">Confirm Password</Label>
            <Input
              id="password2"
              type="password"
              name="password2"
              value={this.state.password2}
              placeholder="Enter password again"
            />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      </Container>
    );
  }
}

export default withRouter(Register);