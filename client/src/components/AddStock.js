import React from "react";
import { Container, Button, Form, FormGroup, Label, Input } from "reactstrap";

class AddStock extends React.Component {
  state = {
    name: "",
    symbol: "",
    targetlow: undefined,
    targethigh: undefined,
    isSymbolValid: false,
    errorMessage: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const request = await fetch("/stocks", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    });
    const response = await request.json();
    console.log(response);
    this.props.history.push("/dashboard");
  };

  getSymbol = async value => {
    console.log(value);
    const url = `https://api.iextrading.com/1.0/stock/${value}/quote`;
    try {
      const request = await fetch(url);
      const response = await request.json();
      const name = response["companyName"];
      const symbol = response["symbol"];
      this.setState({ name, symbol, isSymbolValid: true, errorMessage: "" });
      console.log(this.state);
    } catch {
      this.setState({ errorMessage: "No such stock exists" });
    }
  };

  render() {
    return (
      <Container>
        <h2>Add Stocks</h2>
        <Form onSubmit={this.handleSubmit}>
          {this.state.isSymbolValid === false && (
            <FormGroup>
              <Label for="symbol">Symbol</Label>
              <Input
                type="text"
                name="symbol"
                value={this.state.symbol}
                onChange={this.handleChange}
                placeholder="Enter symbol"
              />
              <Button
                className="mt-3"
                onClick={() => this.getSymbol(this.state.symbol)}
              >
                Search
              </Button>
            </FormGroup>
          )}
          {<p>{this.state.errorMessage}</p>}

          {this.state.isSymbolValid && (
            <div>
              <p>Symbol: {this.state.symbol}</p>
              <p>Name: {this.state.name}</p>

              <FormGroup>
                <Label for="targetlow">Target Low:</Label>
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
              <Button>Submit</Button>
            </div>
          )}
        </Form>
      </Container>
    );
  }
}

export default AddStock;
