import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Icon, Input, Button, Alert } from "antd";
import "./Login.css";
import { loginUser } from "../../helpers/api/api";

const Login = props => {
  const [state, setState] = useState({
    username: "",
    password: "",
    errorMessage: "",
    isLoading: false
  });

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setState({ ...state, isLoading: true });
    try {
      const response = await loginUser(state);
      if (response) {
        props.toggleLogin();
      }
    } catch (err) {
      setState({
        ...state,
        errorMessage: err.response.data.error.message,
        isLoading: false
      });
    }
  };

  const { getFieldDecorator } = props.form;
  return (
    <div className="form-container">
      <div className="responsive-container login-container">
        {state.errorMessage && (
          <Alert message={state.errorMessage} type="error" showIcon />
        )}
        <Form onSubmit={handleSubmit} className="custom-form">
          <h1 className="heading">Log in to your account</h1>
          <Form.Item>
            {getFieldDecorator("username")(
              <Input
                prefix={<Icon type="user" className="form-icon" />}
                placeholder="Username"
                aria-label="Username"
                size="large"
                name="username"
                onChange={handleChange}
                allowClear
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password")(
              <Input.Password
                prefix={<Icon type="lock" className="form-icon" />}
                placeholder="Password"
                aria-label="Password"
                size="large"
                name="password"
                onChange={handleChange}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              loading={state.isLoading}
              size="large"
              type="primary"
              htmlType="submit"
              className="form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
        <Link to="/register">
          <Button size="large" className="signup-button">
            Don't have an account? <b> Get started</b>
          </Button>
        </Link>
      </div>
    </div>
  );
};

const LoginForm = Form.create({ name: "normal_login" })(Login);
export default LoginForm;
