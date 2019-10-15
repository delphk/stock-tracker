import React from "react";
import Settings from "./Settings";
import { render } from "react-testing-library";

it("should render spinner", () => {
  const { getByTestId } = render(<Settings />);

  const spinner = getByTestId("spinner");

  expect(spinner).toBeInTheDocument();
});
