import React from "react";
import NotFound from "./NotFound";
import { render } from "react-testing-library";

it("should render 404 image", () => {
  const { getByAltText } = render(<NotFound />);

  const img = getByAltText("404");

  expect(img).toBeInTheDocument();
});
