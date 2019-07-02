import axios from "axios";
//Register API
const registerUser = async payload =>
  await axios({
    method: "post",
    url: "/users/register",
    data: payload
  });

//Dashboard APIs
const getStocks = async () => await axios.get("/stocks");
const editStock = async (id, payload) =>
  await axios({
    method: "put",
    url: `/stocks/${id}`,
    data: payload
  });
const deleteStock = async id =>
  await axios({
    method: "delete",
    url: `/stocks/${id}`
  });

const fetchStockPrices = async symbols =>
  await axios.get(`/stocks/prices/${symbols}`);

//Settings APIs
const getUserInfo = async () => await axios.get("/users");

const verifyUser = async () => await axios.post("/users/verify");

const updateEmailAlert = async payload =>
  await axios({
    method: "put",
    url: "/users",
    data: payload
  });

//AddStock APIs
const addStock = async payload =>
  await axios({
    method: "post",
    url: "/stocks",
    data: payload
  });

const searchSymbol = async symbol =>
  await axios.get(`/stocks/symbol/${symbol}`);

//Logout API
const userLogout = async () => await axios.post("/users/logout");

export {
  registerUser,
  getStocks,
  fetchStockPrices,
  editStock,
  deleteStock,
  getUserInfo,
  verifyUser,
  updateEmailAlert,
  addStock,
  searchSymbol,
  userLogout
};
