import React from "react";
import Settings from "./Settings";
import { render } from "react-testing-library";

it("should render spinner", () => {
  const { getByAltText } = render(<Settings />);

  const spinner = getByAltText("Loading...");

  expect(spinner).toBeInTheDocument();
});
