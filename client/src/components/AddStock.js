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

class AddStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      symbol: "",
      price: "",
      targetlow: undefined,
      targethigh: undefined,
      isSymbolValid: false,
      errorMessage: ""
    };

    this.initialState = this.state;
  }

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
      console.log("request:", request);
      const response = await request.json();
      console.log("response:", response);
      if (request.status === 201) {
        this.props.history.push("/dashboard");
      } else {
        this.setState({
          errorMessage: "This stock is already in your dashboard"
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  resetState = () => {
    this.setState(this.initialState);
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
    console.log(this.state);
    return (
      <Container>
        {this.state.errorMessage && (
          <Alert color="danger">{this.state.errorMessage}</Alert>
        )}
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
              <Button id="button">Submit</Button>
              <Button onClick={this.resetState}>Reset</Button>
            </Form>
          </div>
        )}
      </Container>
    );
  }
}

export default AddStock;
