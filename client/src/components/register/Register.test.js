import React from "react";
import { render, fireEvent } from "react-testing-library";
import Register from "./Register";
import { BrowserRouter as Router } from "react-router-dom";

describe("Renders on page", () => {
  test("should render heading to create account", () => {
    const { container } = render(
      <Router>
        <Register />
      </Router>
    );

    const title = container.querySelector("h2");

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Create your account");
  });

  test("should render label and input fields for name", () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <Router>
        <Register />
      </Router>
    );

    const label = getByLabelText("Name");
    const input = getByPlaceholderText("Enter name");
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test("should render label and input fields for username", () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <Router>
        <Register />
      </Router>
    );

    const label = getByLabelText("Username");
    const input = getByPlaceholderText("Enter username");
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test("should render label and input fields for email", () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <Router>
        <Register />
      </Router>
    );

    const label = getByLabelText("Email");
    const input = getByPlaceholderText("Enter email");
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test("should render label and input fields for password", () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <Router>
        <Register />
      </Router>
    );

    const label = getByLabelText("Password");
    const input = getByPlaceholderText("Enter password");

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test("should render label and input fields for confirming password", () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <Router>
        <Register />
      </Router>
    );

    const label = getByLabelText("Confirm Password");
    const input = getByPlaceholderText("Enter password again");

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test("should render a button to submit request", () => {
    const { container } = render(
      <Router>
        <Register />
      </Router>
    );

    const button = container.querySelector("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Submit");
  });
});

describe("Form functionality", () => {
  test("fields contains input value", () => {
    const { getByPlaceholderText } = render(
      <Router>
        <Register />
      </Router>
    );
    const nameInput = getByPlaceholderText("Enter name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const usernameInput = getByPlaceholderText("Enter username");
    fireEvent.change(usernameInput, { target: { value: "jane" } });

    const emailInput = getByPlaceholderText("Enter email");
    fireEvent.change(emailInput, { target: { value: "jane@email.com" } });

    const passwordInput = getByPlaceholderText("Enter password");
    fireEvent.change(passwordInput, { target: { value: "jane123" } });

    const confirmPasswordInput = getByPlaceholderText("Enter password again");
    fireEvent.change(confirmPasswordInput, { target: { value: "jane123" } });

    expect(nameInput.value).toBe("Jane Doe");
    expect(usernameInput.value).toBe("jane");
    expect(emailInput.value).toBe("jane@email.com");
    expect(passwordInput.value).toBe("jane123");
    expect(confirmPasswordInput.value).toBe("jane123");
  });

  test("error message displays when all fields not filled in", () => {
    const { getByText, getByPlaceholderText } = render(
      <Router>
        <Register />
      </Router>
    );

    const nameInput = getByPlaceholderText("Enter name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const emailInput = getByPlaceholderText("Enter email");
    fireEvent.change(emailInput, { target: { value: "jane@email.com" } });

    const passwordInput = getByPlaceholderText("Enter password");
    fireEvent.change(passwordInput, { target: { value: "jane123" } });

    const confirmPasswordInput = getByPlaceholderText("Enter password again");
    fireEvent.change(confirmPasswordInput, { target: { value: "jane123" } });
    const button = getByText("Submit");
    fireEvent.click(button);

    const errorMessage = getByText("Please fill up all fields");
    expect(errorMessage).toBeInTheDocument();
  });

  test("error message not an email is entered into the input field", () => {
    const { container, getByPlaceholderText, getByText } = render(
      <Router>
        <Register />
      </Router>
    );

    const nameInput = getByPlaceholderText("Enter name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const usernameInput = getByPlaceholderText("Enter username");
    fireEvent.change(usernameInput, { target: { value: "jane" } });

    const emailInput = getByPlaceholderText("Enter email");
    fireEvent.change(emailInput, { target: { value: "jane" } });

    const passwordInput = getByPlaceholderText("Enter password");
    fireEvent.change(passwordInput, { target: { value: "jane123" } });

    const confirmPasswordInput = getByPlaceholderText("Enter password again");
    fireEvent.change(confirmPasswordInput, { target: { value: "jane123" } });
    const button = container.querySelector("button");

    fireEvent.click(button);
    const errorMessage = getByText("Please enter a valid email");

    expect(errorMessage).toBeInTheDocument();
  });

  test("error message when passwords do not match", () => {
    const { container, getByPlaceholderText, getByText } = render(
      <Router>
        <Register />
      </Router>
    );

    const nameInput = getByPlaceholderText("Enter name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const usernameInput = getByPlaceholderText("Enter username");
    fireEvent.change(usernameInput, { target: { value: "jane" } });

    const emailInput = getByPlaceholderText("Enter email");
    fireEvent.change(emailInput, { target: { value: "jane@email.com" } });

    const passwordInput = getByPlaceholderText("Enter password");
    fireEvent.change(passwordInput, { target: { value: "jane123" } });

    const confirmPasswordInput = getByPlaceholderText("Enter password again");
    fireEvent.change(confirmPasswordInput, { target: { value: "jane12345" } });
    const button = container.querySelector("button");

    fireEvent.click(button);
    const errorMessage = getByText("Passwords do not match");

    expect(errorMessage).toBeInTheDocument();
  });
});
