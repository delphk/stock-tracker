import React, { useState } from "react";
import { Form, Input, Button, Alert, Icon } from "antd";
import { withRouter } from "react-router-dom";
import { registerUser } from "../../helpers/api/api";
import "./Register.css";

const Register = props => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDirty, setConfirmDirty] = useState(false);

  const handleConfirmBlur = e => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const validateToNextPassword = (rule, value, callback) => {
    const { form } = props;
    if (value && confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  const compareToFirstPassword = (rule, value, callback) => {
    const { form } = props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Passwords do not match");
    } else {
      callback();
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        try {
          setIsLoading(true);
          const response = await registerUser(values);
          if (response.data.user) {
            setErrorMessage("");
            setSuccessMessage("You have successfully registered!");
            setTimeout(() => {
              props.history.push("/login");
            }, 3000);
          } else if (response.data.message) {
            if (response.data.message.match(/username/)) {
              setErrorMessage("Username has been taken");
            } else if (response.data.message.match(/email/)) {
              setErrorMessage("An account with this email already exists");
            }
            setIsLoading(false);
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
  };
  const { getFieldDecorator } = props.form;

  return (
    <div style={{ width: "100%", maxWidth: 600, margin: "auto" }}>
      <div className="form-container">
        <div className="register-container">
          {errorMessage && (
            <Alert message={errorMessage} type="error" showIcon />
          )}
          {successMessage && (
            <Alert message={successMessage} type="success" showIcon />
          )}
          <Form onSubmit={handleSubmit} className="custom-form">
            <h1 className="heading">Create your account</h1>
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
                  aria-label="Name"
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
                  aria-label="Username"
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
                  aria-label="Email"
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
                    validator: validateToNextPassword
                  }
                ]
              })(
                <Input.Password
                  prefix={<Icon type="lock" className="form-icon" />}
                  placeholder="Password (min 8 characters)"
                  size="large"
                  aria-label="Password"
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
                    validator: compareToFirstPassword
                  }
                ]
              })(
                <Input.Password
                  prefix={<Icon type="lock" className="form-icon" />}
                  placeholder="Confirm password"
                  size="large"
                  onBlur={handleConfirmBlur}
                  aria-label="Confirm password"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                loading={isLoading}
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
};

const RegistrationForm = Form.create({ name: "register" })(Register);
export default withRouter(RegistrationForm);
