import React from "react";
import { render } from "react-testing-library";
import { BrowserRouter as Router } from "react-router-dom";
import mockClient from "../helpers/api/__mocks__";

export const renderWithRouter = component =>
  render(<Router>{component}</Router>);

export const mockResponse = mockClient.mockResponse;
