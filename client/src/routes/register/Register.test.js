import React from "react";
import { fireEvent, waitForElement } from "react-testing-library";
import { renderWithRouter } from "../../utils/setUpTests";
import Register from "./Register";

describe("Renders on page", () => {
  test("should render heading to create account", () => {
    const { container } = renderWithRouter(<Register />);

    const title = container.querySelector("h1");

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Create your account");
  });

  test("should render input field for name", () => {
    const { getByPlaceholderText } = renderWithRouter(<Register />);

    const input = getByPlaceholderText("Name");
    expect(input).toBeInTheDocument();
  });

  test("should render input field for username", () => {
    const { getByPlaceholderText } = renderWithRouter(<Register />);

    const input = getByPlaceholderText("Username");
    expect(input).toBeInTheDocument();
  });

  test("should render input field for email", () => {
    const { getByPlaceholderText } = renderWithRouter(<Register />);

    const input = getByPlaceholderText("Email");
    expect(input).toBeInTheDocument();
  });

  test("should render input field for password", () => {
    const { getByPlaceholderText } = renderWithRouter(<Register />);

    const input = getByPlaceholderText(/Password/);
    expect(input).toBeInTheDocument();
  });

  test("should render input field for confirming password", () => {
    const { getByPlaceholderText } = renderWithRouter(<Register />);

    const input = getByPlaceholderText("Confirm password");

    expect(input).toBeInTheDocument();
  });

  test("should render a button to submit request", () => {
    const { container } = renderWithRouter(<Register />);

    const button = container.querySelector("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Register");
  });
});

describe("Form functionality", () => {
  test("fields contains input value", () => {
    const { getByPlaceholderText } = renderWithRouter(<Register />);
    const nameInput = getByPlaceholderText("Name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const usernameInput = getByPlaceholderText("Username");
    fireEvent.change(usernameInput, { target: { value: "jane" } });

    const emailInput = getByPlaceholderText("Email");
    fireEvent.change(emailInput, { target: { value: "jane@email.com" } });

    const passwordInput = getByPlaceholderText(/Password/);
    fireEvent.change(passwordInput, { target: { value: "jane12345" } });

    const confirmPasswordInput = getByPlaceholderText("Confirm password");
    fireEvent.change(confirmPasswordInput, { target: { value: "jane12345" } });

    expect(nameInput.value).toBe("Jane Doe");
    expect(usernameInput.value).toBe("jane");
    expect(emailInput.value).toBe("jane@email.com");
    expect(passwordInput.value).toBe("jane12345");
    expect(confirmPasswordInput.value).toBe("jane12345");
  });

  test("error message not an email is entered into the input field", () => {
    const { container, getByPlaceholderText, getByText } = renderWithRouter(
      <Register />
    );

    const nameInput = getByPlaceholderText("Name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const usernameInput = getByPlaceholderText("Username");
    fireEvent.change(usernameInput, { target: { value: "jane" } });

    const emailInput = getByPlaceholderText("Email");
    fireEvent.change(emailInput, { target: { value: "jane" } });

    const passwordInput = getByPlaceholderText(/Password/);
    fireEvent.change(passwordInput, { target: { value: "jane123" } });

    const confirmPasswordInput = getByPlaceholderText("Confirm password");
    fireEvent.change(confirmPasswordInput, { target: { value: "jane123" } });
    const button = container.querySelector("button");

    fireEvent.click(button);
    const errorMessage = getByText("Please enter a valid email");

    expect(errorMessage).toBeInTheDocument();
  });

  test("error message when passwords do not match", () => {
    const { getByPlaceholderText, getByText } = renderWithRouter(<Register />);

    const nameInput = getByPlaceholderText("Name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const usernameInput = getByPlaceholderText("Username");
    fireEvent.change(usernameInput, { target: { value: "jane" } });

    const emailInput = getByPlaceholderText("Email");
    fireEvent.change(emailInput, { target: { value: "jane@email.com" } });

    const passwordInput = getByPlaceholderText(/Password/);
    fireEvent.change(passwordInput, { target: { value: "jane123" } });

    const confirmPasswordInput = getByPlaceholderText("Confirm password");
    fireEvent.change(confirmPasswordInput, { target: { value: "jane12345" } });

    const errorMessage = getByText("Passwords do not match");

    expect(errorMessage).toBeInTheDocument();
  });
});
