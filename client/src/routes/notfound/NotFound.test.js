import React from "react";
import NotFound from "./NotFound";
import { renderWithRouter } from "../../utils/setUpTests";

it("should render 404 image", () => {
  const { getByText } = renderWithRouter(<NotFound />);

  const errorText = getByText("Sorry, the page you visited does not exist.");

  expect(errorText).toBeInTheDocument();
});
