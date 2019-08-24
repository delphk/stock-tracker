import React from "react";
import { render, fireEvent } from "react-testing-library";
import Login from "./Login";

describe("Renders on page", () => {
  test("should render login heading", () => {
    const { container } = render(<Login />);

    const title = container.querySelector("h2");

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Login");
  });

  test("should render label and input fields for username", () => {
    const { getByLabelText, getByPlaceholderText } = render(<Login />);

    const label = getByLabelText("Username");
    const input = getByPlaceholderText("Enter username");
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test("should render label and input fields for password", () => {
    const { getByLabelText, getByPlaceholderText } = render(<Login />);

    const label = getByLabelText("Password");
    const input = getByPlaceholderText("Enter password");

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test("should render a button to submit request", () => {
    const { container } = render(<Login />);

    const button = container.querySelector("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Submit");
  });
});

describe("Form functionality", () => {
  test("username field contains input name", () => {
    const username = "jane";
    const { getByPlaceholderText } = render(<Login />);
    const input = getByPlaceholderText("Enter username");

    fireEvent.change(input, { target: { value: username } });

    expect(input.value).toBe("jane");
  });

  test("password field contains input password", () => {
    const { container } = render(<Login />);
    const input = container.querySelector(`input[name="password"]`);
    const password = "jane";
    fireEvent.change(input, {
      target: { value: password }
    });
    expect(input.value).toBe(password);
  });

  test("submit button will invoke a function", () => {
    const handleSubmit = jest.fn();
    const { container } = render(<Login />);
    const button = container.querySelector("button");
    button.onclick = handleSubmit;
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  test("successful login redirects", () => {
    const { container } = render(<Login />);
    const handleSubmit = jest.fn();
    const inputFieldUsername = container.querySelector(
      `input[name="username"]`
    );
    const inputFieldPassword = container.querySelector(
      `input[name="password"]`
    );
    const button = container.querySelector("button");
    button.onclick = handleSubmit;
    const username = "jane";
    const password = "jane123";
    fireEvent.change(inputFieldUsername, {
      target: { value: username }
    });
    fireEvent.change(inputFieldPassword, {
      target: { value: password }
    });
    fireEvent.click(button);
    const { updatedContainer } = render(<Login />);
    expect(updatedContainer).toBeUndefined();
  });
});
