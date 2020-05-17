import { apiRequest } from "../../utils/apiRequest";

//Check user authenticated API
const authenticationCheck = async () =>
  await apiRequest({ url: "/users/authenticationcheck" });

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

const fetchCurrentStockPrices = async () =>
  await apiRequest({ url: `/stocks/prices` });

const fetchHistoricalPrices = async (range = "1m") =>
  await apiRequest({ url: `/stocks/prices?&range=${range}` });

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
  authenticationCheck,
  loginUser,
  registerUser,
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
