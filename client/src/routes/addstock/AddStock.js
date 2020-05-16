import React from "react";
import { Alert, Button, Input, Form, Row, Col } from "antd";
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
      <div className="form-container">
        <div className="responsive-container">
          {this.state.errorMessage && (
            <Alert message={this.state.errorMessage} type="error" showIcon />
          )}
          <h1 className="heading">Add Stocks</h1>

          {this.state.isSymbolValid === false && (
            <Form
              onSubmit={e => this.getSymbol(this.state.symbol, e)}
              layout="vertical"
            >
              <Form.Item label="Symbol">
                <Input
                  type="text"
                  name="symbol"
                  size="large"
                  value={this.state.symbol}
                  onChange={this.handleChange}
                  placeholder="Enter symbol"
                />
              </Form.Item>
              <Button
                type="primary"
                size="large"
                className="form-button"
                htmlType="submit"
              >
                Search
              </Button>
            </Form>
          )}

          {this.state.isSymbolValid && (
            <div>
              <Row>
                <Col span={12}>
                  <p className="label">Name</p>
                  <p className="statistic">{this.state.name}</p>
                  <p className="subtext">({this.state.symbol})</p>
                </Col>
                <Col span={12}>
                  <p className="label">Current Price</p>
                  <p className="statistic">${this.state.price}</p>
                </Col>
              </Row>
              <Form onSubmit={this.handleSubmit} layout="vertical">
                <Form.Item label="Target Low:">
                  <Input
                    type="number"
                    size="large"
                    name="targetlow"
                    value={this.state.targetlow}
                    onChange={this.handleChange}
                  />
                </Form.Item>
                <Form.Item label="Target High:">
                  <Input
                    type="number"
                    size="large"
                    name="targethigh"
                    value={this.state.targethigh}
                    onChange={this.handleChange}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    className="form-button"
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    size="large"
                    className="form-button"
                    onClick={this.resetState}
                  >
                    Reset
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(AddStock);
