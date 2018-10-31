import React from "react";
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";

class Register extends React.Component {
  state = {
    name: "",
    username: "",
    email: "",
    password: "",
    password2: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    fetch("/users/register", {
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
            />
            {/* <FormFeedback valid>Sweet! that name is available</FormFeedback> */}
          </FormGroup>
          {/* <FormGroup>
            <Label for="username" name="username" id="username">
              Username
            </Label>
            <Input invalid />
            <FormFeedback>Oh noes! that name is already taken</FormFeedback>
          </FormGroup> */}
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
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
