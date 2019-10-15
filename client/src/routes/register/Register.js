import React from "react";
import { Form, Input, Button, Alert, Icon } from "antd";
import { withRouter } from "react-router-dom";
import { registerUser } from "../../helpers/api/api";
import "./Register.css";

class Register extends React.Component {
  state = {
    errorMessage: "",
    successMessage: "",
    isLoading: false,
    confirmDirty: false
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Passwords do not match");
    } else {
      callback();
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        try {
          this.setState({ isLoading: true });
          const response = await registerUser(values);
          if (response.data.user) {
            this.setState({
              errorMessage: "",
              successMessage: "You have successfully registered!",
              isLoading: false
            });
            setTimeout(() => {
              this.props.history.push("/login");
            }, 3000);
          } else if (response.data.message) {
            if (response.data.message.match(/username/)) {
              this.setState({
                errorMessage: "Username has been taken",
                isLoading: false
              });
            } else if (response.data.message.match(/email/)) {
              this.setState({
                errorMessage: "An account with this email already exists",
                isLoading: false
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={{ width: "100%", maxWidth: 600, margin: "auto" }}>
        <div className="form-container">
          <div className="register-container">
            {this.state.errorMessage && (
              <Alert message={this.state.errorMessage} type="error" showIcon />
            )}
            {this.state.successMessage && (
              <Alert
                message={this.state.successMessage}
                type="success"
                showIcon
              />
            )}
            <Form onSubmit={this.handleSubmit} className="custom-form">
              <h3>Create your account</h3>
              <Form.Item>
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your name",
                      whitespace: true
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="user" className="form-icon" />}
                    placeholder="Name"
                    size="large"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("username", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your username"
                    },
                    {
                      pattern: /^[a-zA-Z0-9]+$/,
                      message: "Please enter only alphanumeric characters"
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="user" className="form-icon" />}
                    placeholder="Username"
                    size="large"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("email", {
                  rules: [
                    {
                      type: "email",
                      message: "Please enter a valid email"
                    },
                    {
                      required: true,
                      message: "Please input your email"
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="mail" className="form-icon" />}
                    placeholder="Email"
                    size="large"
                  />
                )}
              </Form.Item>
              <Form.Item hasFeedback>
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your password"
                    },
                    {
                      min: 8,
                      message:
                        "Please choose a password with at least 8 characters"
                    },
                    {
                      validator: this.validateToNextPassword
                    }
                  ]
                })(
                  <Input.Password
                    prefix={<Icon type="lock" className="form-icon" />}
                    placeholder="Password (min 8 characters)"
                    size="large"
                  />
                )}
              </Form.Item>
              <Form.Item hasFeedback>
                {getFieldDecorator("confirm", {
                  rules: [
                    {
                      required: true,
                      message: "Please confirm your password"
                    },
                    {
                      validator: this.compareToFirstPassword
                    }
                  ]
                })(
                  <Input.Password
                    prefix={<Icon type="lock" className="form-icon" />}
                    placeholder="Confirm password"
                    size="large"
                    onBlur={this.handleConfirmBlur}
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
                  Register
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const RegistrationForm = Form.create({ name: "register" })(Register);
export default withRouter(RegistrationForm);
