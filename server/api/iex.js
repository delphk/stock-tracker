const axios = require("axios");

const iex = axios.create({
  baseURL: "https://cloud.iexapis.com/stable/stock/"
});

module.exports = iex;
