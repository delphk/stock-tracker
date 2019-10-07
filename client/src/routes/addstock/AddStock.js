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
import { addStock, searchSymbol } from "../../helpers/api/api";

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
      const response = await addStock(this.state);
      if (response.status === 201) {
        this.props.history.push("/dashboard");
      }
    } catch (err) {
      this.setState({
        errorMessage: "This stock is already in your dashboard"
      });
    }
  };

  resetState = () => {
    this.setState(this.initialState);
  };

  getSymbol = async (value, e) => {
    e.preventDefault();
    try {
      const response = await searchSymbol(value);
      if (response.data.message)
        this.setState({ errorMessage: "No such stock exists :(" });
      else {
        const name = response.data["companyName"];
        const symbol = response.data["symbol"];
        const price = response.data["latestPrice"];
        this.setState({
          name,
          symbol,
          price,
          isSymbolValid: true,
          errorMessage: ""
        });
      }
    } catch (err) {
      this.setState({
        errorMessage: "Something went wrong, please try again later."
      });
    }
  };

  render() {
    return (
      <Container>
        {this.state.errorMessage && (
          <Alert color="danger">{this.state.errorMessage}</Alert>
        )}
        <h2 id="heading">Add Stocks</h2>

        {this.state.isSymbolValid === false && (
          <Form onSubmit={e => this.getSymbol(this.state.symbol, e)}>
            <FormGroup>
              <Label for="symbol">Symbol</Label>
              <Input
                id="shortinput"
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
                  id="shortinput"
                  type="number"
                  name="targetlow"
                  value={this.state.targetlow}
                  onChange={this.handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="targethigh">Target High:</Label>
                <Input
                  id="shortinput"
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

export default withRouter(AddStock);
