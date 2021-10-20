import React, { useState } from "react";
import { Alert, Button, Input, Form, Row, Col } from "antd";
import { withRouter } from "react-router-dom";
import { addStock, searchSymbol } from "../../helpers/api/api";

const AddStock = props => {
  const initialState = {
    name: "",
    symbol: "",
    latestPrice: "",
    targetlow: undefined,
    targethigh: undefined,
    isSymbolValid: false,
    errorMessage: ""
  };
  const [state, setState] = useState({ ...initialState });

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await addStock(state);
      if (response.status === 201) {
        props.history.push("/dashboard");
      }
    } catch (err) {
      setState({
        ...state,
        errorMessage: "This stock is already in your dashboard"
      });
    }
  };

  const resetState = () => {
    setState(initialState);
  };

  const getSymbol = async (value, e) => {
    e.preventDefault();
    try {
      const response = await searchSymbol(value);
      if (response.data.message)
        setState({ ...state, errorMessage: "No such stock exists :(" });
      else {
        const { companyName, symbol, latestPrice } = response.data;
        setState({
          ...state,
          name: companyName,
          symbol,
          latestPrice,
          isSymbolValid: true,
          errorMessage: ""
        });
      }
    } catch (err) {
      setState({
        ...state,
        errorMessage: "Something went wrong, please try again later."
      });
    }
  };

  const {
    errorMessage,
    isSymbolValid,
    symbol,
    name,
    latestPrice,
    targethigh,
    targetlow
  } = state;
  return (
    <div className="form-container">
      <div className="responsive-container">
        {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
        <h1 className="heading">Add Stocks</h1>

        {isSymbolValid === false && (
          <Form onSubmit={e => getSymbol(symbol, e)} layout="vertical">
            <Form.Item label="Symbol">
              <Input
                type="text"
                name="symbol"
                size="large"
                value={symbol}
                onChange={handleChange}
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
                <p className="statistic">{name}</p>
                <p className="subtext">({symbol})</p>
              </Col>
              <Col span={12}>
                <p className="label">Current Price</p>
                <p className="statistic">${latestPrice}</p>
              </Col>
            </Row>
            <Form onSubmit={handleSubmit} layout="vertical">
              <Form.Item label="Target Low:">
                <Input
                  type="number"
                  size="large"
                  name="targetlow"
                  value={targetlow}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item label="Target High:">
                <Input
                  type="number"
                  size="large"
                  name="targethigh"
                  value={targethigh}
                  onChange={handleChange}
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
                  onClick={resetState}
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
};

export default withRouter(AddStock);
