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
    const request = await fetch("/users/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    });
    const response = await request.json();
    if (response.user) {
      this.setState({
        errorMessage: "",
        successMessage: "You have successfully registered!"
      });

      setTimeout(() => {
        this.props.history.push("/login");
      }, 3000);
    } else {
      if (response.message.match(/username/)) {
        console.log(response);
        this.setState({ errorMessage: "Username has been taken" });
      } else if (response.message.match(/email/)) {
        this.setState({ errorMessage: "Email has been taken" });
      }
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
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              placeholder="Enter name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              placeholder="Enter username"
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="Enter email"
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
          <FormGroup>
            <Label for="password2">Confirm Password</Label>
            <Input
              type="password"
              name="password2"
              value={this.state.password2}
              onChange={this.handleChange}
              placeholder="Enter password again"
            />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      </Container>
    );
  }
}

export default Register;
