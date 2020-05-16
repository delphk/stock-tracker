import React from "react";
import { Link } from "react-router-dom";
import { Form, Icon, Input, Button, Alert } from "antd";
import "./Login.css";
import { loginUser } from "../../helpers/api/api";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    errorMessage: "",
    isLoading: false
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    try {
      const response = await loginUser(this.state);
      if (response) {
        this.props.toggleLogin();
      }
    } catch (err) {
      this.setState({
        errorMessage: err.response.data.error.message,
        isLoading: false
      });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="form-container">
        <div className="responsive-container login-container">
          {this.state.errorMessage && (
            <Alert message={this.state.errorMessage} type="error" showIcon />
          )}
          <Form onSubmit={this.handleSubmit} className="custom-form">
            <h1 className="heading">Log in to your account</h1>
            <Form.Item>
              {getFieldDecorator("username")(
                <Input
                  prefix={<Icon type="user" className="form-icon" />}
                  placeholder="Username"
                  aria-label="Username"
                  size="large"
                  name="username"
                  onChange={this.handleChange}
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
                  onChange={this.handleChange}
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                loading={this.state.isLoading}
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
  }
}

const LoginForm = Form.create({ name: "normal_login" })(Login);
export default LoginForm;
