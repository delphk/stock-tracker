import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { Table, Divider, Empty, Form, Button } from "antd";
import { Link } from "react-router-dom";
import Historical from "../historical/Historical";
import Spinner from "../../components/spinner/Spinner";
import CollectionCreateForm from "../../components/FormInModal";
import {
  fetchCurrentStockPrices,
  fetchHistoricalPrices,
  editStock,
  deleteStock
} from "../../helpers/api/api";

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historicalPricesLoading, setHistoricalPricesLoading] = useState(true);
  const [stockToEdit, setStockToEdit] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  let formRef;

  useEffect(() => {
    async function fetchStockPrices() {
      try {
        const response = await fetchCurrentStockPrices();
        setStocks(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    fetchStockPrices();
  }, []);

  useEffect(
    () => {
      async function fetchHistorical() {
        try {
          const historicalData = await fetchHistoricalPrices();
          setHistoricalData(historicalData.data);
          setHistoricalPricesLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
      if (stocks.length > 0) {
        fetchHistorical();
      }
    },
    [stocks.length]
  );

  const formatStockPrice = price => {
    return "$" + price.toFixed(2);
  };

  const handleEdit = () => {
    const { form } = formRef.props;
    const { id, index } = stockToEdit;
    setConfirmLoading(true);
    form.validateFields(async (err, value) => {
      try {
        const response = await editStock(id, {
          targetlow: value.newtargetlow,
          targethigh: value.newtargethigh
        });
        let stocksCopy = [...stocks];
        stocksCopy[index]["targetlow"] = response.data.stock.targetlow;
        stocksCopy[index]["targethigh"] = response.data.stock.targethigh;
        setStocks(stocksCopy);
        setConfirmLoading(false);
        setModalVisible(false);
      } catch (err) {
        setConfirmLoading(false);
        setModalVisible(false);
      }
    });
  };

  const handleDelete = async (id, index) => {
    try {
      await deleteStock(id);
      let stocksCopy = [...stocks];
      stocksCopy.splice(index, 1);
      setStocks({ stocksCopy });
    } catch (err) {
      console.log(err);
    }
  };

  const showModal = (id, index) => {
    setModalVisible(true);
    setStockToEdit({ id, index });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const saveFormRef = ref => {
    formRef = ref;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <p>{text}</p>
          <p className="table-subheader">({record.symbol})</p>
        </div>
      )
    },
    {
      title: "Current Price",
      dataIndex: "price",
      key: "price",
      render: text => formatStockPrice(text)
    },
    {
      title: "Target low",
      dataIndex: "targetlow",
      key: "targetlow",
      render: text => (text ? formatStockPrice(text) : "-")
    },
    {
      title: "Target high",
      dataIndex: "targethigh",
      key: "targethigh",
      render: text => (text ? formatStockPrice(text) : "-")
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => (
        <span>
          <Button type="link" onClick={() => showModal(record._id, index)}>
            Edit
          </Button>
          <Divider type="vertical" style={{ background: "#243B53" }} />
          <Button type="link" onClick={() => handleDelete(record._id, index)}>
            Delete
          </Button>
        </span>
      )
    }
  ];

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Container>
          <h1 className="heading">Dashboard</h1>
          {stocks.length === 0 && (
            <Empty
              description={
                <h6>
                  Click <Link to="/addstock">here</Link> to add stocks to your
                  watchlist!
                </h6>
              }
            />
          )}
          {stocks.length > 0 && (
            <div>
              <Table
                rowKey="name"
                columns={columns}
                dataSource={stocks}
                scroll={{ x: 480 }}
                pagination={{ defaultPageSize: 5 }}
              />
              <CollectionCreateForm
                wrappedComponentRef={saveFormRef}
                modalVisible={modalVisible}
                handleModalCancel={handleModalCancel}
                handleEdit={handleEdit}
                confirmLoading={confirmLoading}
              />
              {historicalPricesLoading ? (
                <Spinner />
              ) : (
                <Historical data={historicalData} />
              )}
            </div>
          )}
        </Container>
      )}
    </>
  );
};

const DashboardScreen = Form.create({ name: "form_in_modal" })(Dashboard);
export default DashboardScreen;
