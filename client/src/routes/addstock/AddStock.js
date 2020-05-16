import React from "react";
import { Alert, Button, Input, Form, Row, Col } from "antd";
import { withRouter } from "react-router-dom";
import { addStock, searchSymbol } from "../../helpers/api/api";

class AddStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: "",
      symbol: "",
      latestPrice: "",
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
        const { companyName, symbol, latestPrice } = response.data;
        this.setState({
          companyName,
          symbol,
          latestPrice,
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
    const {
      errorMessage,
      isSymbolValid,
      symbol,
      companyName,
      latestPrice,
      targethigh,
      targetlow
    } = this.state;
    return (
      <div className="form-container">
        <div className="responsive-container">
          {errorMessage && (
            <Alert message={errorMessage} type="error" showIcon />
          )}
          <h1 className="heading">Add Stocks</h1>

          {isSymbolValid === false && (
            <Form onSubmit={e => this.getSymbol(symbol, e)} layout="vertical">
              <Form.Item label="Symbol">
                <Input
                  type="text"
                  name="symbol"
                  size="large"
                  value={symbol}
                  onChange={this.handleChange}
                  placeholder="Enter symbol"
                  aria-label="Enter symbol"
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

          {isSymbolValid && (
            <div>
              <Row>
                <Col span={12}>
                  <p className="label">Name</p>
                  <p className="statistic">{companyName}</p>
                  <p className="subtext">({symbol})</p>
                </Col>
                <Col span={12}>
                  <p className="label">Current Price</p>
                  <p className="statistic">${latestPrice}</p>
                </Col>
              </Row>
              <Form onSubmit={this.handleSubmit} layout="vertical">
                <Form.Item label="Target Low:">
                  <Input
                    type="number"
                    size="large"
                    name="targetlow"
                    value={targetlow}
                    onChange={this.handleChange}
                  />
                </Form.Item>
                <Form.Item label="Target High:">
                  <Input
                    type="number"
                    size="large"
                    name="targethigh"
                    value={targethigh}
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
