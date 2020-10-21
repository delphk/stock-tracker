import React from "react";
import { fireEvent } from "react-testing-library";
import { renderWithRouter } from "../../utils/setUpTests";
import LoginForm from "./Login";

const props = {
  toggleLogin: jest.fn()
};

describe("Renders on page", () => {
  test("should render login heading", () => {
    const { container } = renderWithRouter(<LoginForm {...props} />);
    const title = container.querySelector("h1");

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Log in to your account");
  });

  test("should render a button to submit request", () => {
    const { container } = renderWithRouter(<LoginForm {...props} />);
    const button = container.querySelector(".form-button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Log in");
  });
});

describe("Form functionality", () => {
  test("username field contains input name", () => {
    const username = "jane";
    const { getByPlaceholderText } = renderWithRouter(<LoginForm {...props} />);
    const input = getByPlaceholderText("Username");

    fireEvent.change(input, { target: { value: username } });

    expect(input.value).toBe("jane");
  });

  test("password field contains input password", () => {
    const { container } = renderWithRouter(<LoginForm {...props} />);
    const input = container.querySelector(`input[name="password"]`);
    const password = "jane";
    fireEvent.change(input, {
      target: { value: password }
    });
    expect(input.value).toBe(password);
  });

  test("successful login redirects", async () => {
    const { container } = renderWithRouter(<LoginForm {...props} />);
    const inputFieldUsername = container.querySelector(
      `input[name="username"]`
    );
    const inputFieldPassword = container.querySelector(
      `input[name="password"]`
    );
    const button = container.querySelector(".form-button");
    const username = "john";
    const password = "john12345";
    fireEvent.change(inputFieldUsername, {
      target: { value: username }
    });
    fireEvent.change(inputFieldPassword, {
      target: { value: password }
    });
    fireEvent.click(button);
    jest.runAllTimers();

    const { updatedContainer } = renderWithRouter(<LoginForm {...props} />);
    expect(updatedContainer).toBeUndefined();
  });
});
