import React from "react";
import { Container, Button, Form, FormGroup, Label, Input } from "reactstrap";

class AddStock extends React.Component {
  state = {
    name: "",
    symbol: "",
    price: "",
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
    try {
      const request = await fetch("/stocks", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      });
      const response = await request.json();
      this.props.history.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  getSymbol = async (value, e) => {
    e.preventDefault();
    const url = `https://api.iextrading.com/1.0/stock/${value}/quote`;
    try {
      const request = await fetch(url);
      const response = await request.json();
      const name = response["companyName"];
      const symbol = response["symbol"];
      const price = response["close"];
      this.setState({
        name,
        symbol,
        price,
        isSymbolValid: true,
        errorMessage: ""
      });
    } catch {
      this.setState({ errorMessage: "No such stock exists :(" });
    }
  };

  render() {
    return (
      <Container>
        <h2>Add Stocks</h2>
        {this.state.isSymbolValid === false && (
          <Form onSubmit={e => this.getSymbol(this.state.symbol, e)}>
            <FormGroup>
              <Label for="symbol">Symbol</Label>
              <Input
                type="text"
                name="symbol"
                value={this.state.symbol}
                onChange={this.handleChange}
                placeholder="Enter symbol"
              />
              <Button className="mt-3">Search</Button>
            </FormGroup>
          </Form>
        )}
        {<p style={{ color: "#e03428" }}>{this.state.errorMessage}</p>}

        {this.state.isSymbolValid && (
          <div>
            <p>Symbol: {this.state.symbol}</p>
            <p>Name: {this.state.name}</p>
            <p>Current price: ${this.state.price}</p>
            <Form onSubmit={this.handleSubmit}>
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
            </Form>
          </div>
        )}
      </Container>
    );
  }
}

export default AddStock;
