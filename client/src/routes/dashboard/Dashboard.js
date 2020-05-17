import React from "react";
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

class Dashboard extends React.Component {
  state = {
    stocks: [],
    modalVisible: false,
    historicalData: [],
    isLoading: true,
    historicalPricesLoading: true
  };

  async componentDidMount() {
    try {
      const response = await fetchCurrentStockPrices();
      this.setState({ stocks: response.data, isLoading: false });
      if (this.state.stocks.length > 0) {
        const historicalData = await fetchHistoricalPrices();
        this.setState({
          historicalData: historicalData.data,
          historicalPricesLoading: false
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  formatStockPrice = price => {
    return "$" + price.toFixed(2);
  };

  handleEdit = () => {
    const { form } = this.formRef.props;
    const { id, index } = this.state.stockToEdit;
    this.setState({
      confirmLoading: true
    });
    form.validateFields(async (err, value) => {
      try {
        const response = await editStock(id, {
          targetlow: value.newtargetlow,
          targethigh: value.newtargethigh
        });
        let stocks = [...this.state.stocks];
        stocks[index]["targetlow"] = response.data.stock.targetlow;
        stocks[index]["targethigh"] = response.data.stock.targethigh;
        this.setState({ stocks, confirmLoading: false, modalVisible: false });
      } catch (err) {
        this.setState({ confirmLoading: false, modalVisible: false });
      }
    });
  };

  handleDelete = async (id, index) => {
    try {
      await deleteStock(id);
      let stocks = [...this.state.stocks];
      stocks.splice(index, 1);
      this.setState({ stocks });
    } catch (err) {
      console.log(err);
    }
  };

  showModal = (id, index) => {
    this.setState({
      modalVisible: true,
      stockToEdit: { id, index }
    });
  };

  handleModalCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
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
        render: text => this.formatStockPrice(text)
      },
      {
        title: "Target low",
        dataIndex: "targetlow",
        key: "targetlow",
        render: text => (text ? this.formatStockPrice(text) : "-")
      },
      {
        title: "Target high",
        dataIndex: "targethigh",
        key: "targethigh",
        render: text => (text ? this.formatStockPrice(text) : "-")
      },
      {
        title: "Action",
        key: "action",
        render: (text, record, index) => (
          <span>
            <Button
              type="link"
              onClick={() => this.showModal(record._id, index)}
            >
              Edit
            </Button>
            <Divider type="vertical" style={{ background: "#243B53" }} />
            <Button
              type="link"
              onClick={() => this.handleDelete(record._id, index)}
            >
              Delete
            </Button>
          </span>
        )
      }
    ];
    const {
      isLoading,
      stocks,
      modalVisible,
      confirmLoading,
      historicalData,
      historicalPricesLoading
    } = this.state;
    return (
      <React.Fragment>
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
                  wrappedComponentRef={this.saveFormRef}
                  modalVisible={modalVisible}
                  handleModalCancel={this.handleModalCancel}
                  handleEdit={this.handleEdit}
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
      </React.Fragment>
    );
  }
}

const DashboardScreen = Form.create({ name: "form_in_modal" })(Dashboard);
export default DashboardScreen;
