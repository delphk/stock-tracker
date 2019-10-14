const axios = require("axios");

let mockClient = require("../helpers/api/__mocks__/index").default;

let client = axios.create({
  baseURL: "/"
});

if (process.env.NODE_ENV === "test") {
  client = mockClient;
}
export const apiRequest = async api => {
  return await client.request({ ...api });
};
