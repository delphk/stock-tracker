import React from "react";
import { Container, Button, Form, FormGroup, Label, Input } from "reactstrap";

class AddStock extends React.Component {
  state = {
    name: "",
    symbol: "",
    targetlow: undefined,
    targethigh: undefined,
    userid: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    fetch("/stocks", {
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
        <h2>Add Stocks</h2>
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
            <Label for="symbol" name="symbol" id="symbol">
              Symbol
            </Label>
            <Input
              type="text"
              name="symbol"
              value={this.state.symbol}
              onChange={this.handleChange}
              placeholder="Enter symbol"
            />
          </FormGroup>
          <FormGroup>
            <Label for="targetlow" name="targetlow" id="targetlow">
              Target Low:
            </Label>
            <Input
              type="number"
              name="targetlow"
              value={this.state.targetlow}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="targethigh">Target High</Label>
            <Input
              type="number"
              name="targethigh"
              value={this.state.targethigh}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="userid">User ID</Label>
            <Input
              type="text"
              name="userid"
              value={this.state.userid}
              onChange={this.handleChange}
            />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      </Container>
    );
  }
}

export default AddStock;
