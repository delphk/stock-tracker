import { apiRequest } from "../../utils/apiRequest";

//Login API
const loginUser = async payload =>
  await apiRequest({
    method: "post",
    url: "/users/login",
    data: payload
  });

//Register API
const registerUser = async payload =>
  await apiRequest({
    method: "post",
    url: "/users/register",
    data: payload
  });

//Dashboard APIs
const getStocks = async () => await apiRequest({ url: "/stocks" });
const editStock = async (id, payload) =>
  await apiRequest({
    method: "put",
    url: `/stocks/${id}`,
    data: payload
  });
const deleteStock = async id =>
  await apiRequest({
    method: "delete",
    url: `/stocks/${id}`
  });

const fetchCurrentStockPrices = async symbols =>
  await apiRequest({ url: `/stocks/prices/${symbols}` });

const fetchHistoricalPrices = async (symbols, range = "1m") =>
  await apiRequest({ url: `/stocks/prices/${symbols}?&range=${range}` });

//Settings APIs
const getUserInfo = async () => await apiRequest({ url: "/users" });

const verifyUser = async () =>
  await apiRequest({ method: "post", url: "/users/verify" });

const updateEmailAlert = async payload =>
  await apiRequest({
    method: "put",
    url: "/users",
    data: payload
  });

//AddStock APIs
const addStock = async payload =>
  await apiRequest({
    method: "post",
    url: "/stocks",
    data: payload
  });

const searchSymbol = async symbol =>
  await apiRequest({ url: `/stocks/symbol/${symbol}` });

//Logout API
const userLogout = async () =>
  await apiRequest({ method: "post", url: "/users/logout" });

export {
  loginUser,
  registerUser,
  getStocks,
  fetchCurrentStockPrices,
  fetchHistoricalPrices,
  editStock,
  deleteStock,
  getUserInfo,
  verifyUser,
  updateEmailAlert,
  addStock,
  searchSymbol,
  userLogout
};
