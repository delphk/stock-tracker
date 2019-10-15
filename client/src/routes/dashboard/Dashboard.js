import React from "react";
import { Container } from "reactstrap";
import { Table, Divider, Empty, Form, Button } from "antd";
import { Link } from "react-router-dom";
import Historical from "../historical/Historical";
import Spinner from "../../components/spinner/Spinner";
import CollectionCreateForm from "../../components/FormInModal";
import {
  getStocks,
  fetchStockPrices,
  editStock,
  deleteStock
} from "../../helpers/api/api";

class Dashboard extends React.Component {
  state = {
    stocks: [],
    modalVisible: false,
    data: [],
    isLoading: true
  };

  async componentDidMount() {
    try {
      const response = await getStocks();
      this.setState({ stocks: response.data.stocks });
      if (this.state.stocks.length > 0) {
        this.getStockPrices();
      } else {
        this.setState({ isLoading: false });
      }
    } catch (err) {
      console.log(err);
    }
  }

  getStockPrices = async () => {
    // Make batch query to API for all the stocks added to dashboard
    try {
      const arrayOfSymbols = this.state.stocks.map(stock => stock.symbol);
      const symbols = arrayOfSymbols.join(",");
      const response = await fetchStockPrices(symbols);

      // Get stock prices for each symbol
      const arrayOfStockPrices = [];
      for (let i = 0; i < arrayOfSymbols.length; i++) {
        const prices = response.data[arrayOfSymbols[i]]["quote"]["latestPrice"];
        arrayOfStockPrices.push(prices);
      }
      let stocks = [...this.state.stocks];
      stocks.map((stock, index) => (stock.price = arrayOfStockPrices[index]));
      this.setState({
        stocks,
        isLoading: false
      });

      // Get historical data
      const data = [];
      for (let i = 0; i < arrayOfSymbols.length; i++) {
        for (
          let j = 0;
          j < response.data[arrayOfSymbols[i]]["chart"].length;
          j++
        ) {
          data.push({
            date: response.data[arrayOfSymbols[i]]["chart"][j]["label"],
            [arrayOfSymbols[i]]:
              response.data[arrayOfSymbols[i]]["chart"][j]["close"]
          });
        }
      }
      const output = data.reduce((result, item) => {
        const i = result.findIndex(resultItem => resultItem.date === item.date);
        if (i === -1) {
          result.push(item);
        } else {
          result[i] = { ...result[i], ...item };
        }
        return result;
      }, []);
      this.setState({
        data: output
      });
    } catch (err) {
      console.log(err);
    }
  };

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
    return (
      <React.Fragment>
        {this.state.isLoading && <Spinner />}
        {!this.state.isLoading && (
          <Container>
            <h3 id="heading">Dashboard</h3>
            {this.state.stocks.length === 0 && (
              <Empty
                description={
                  <h6>
                    Click <Link to="/addstock">here</Link> to add stocks to your
                    watchlist!
                  </h6>
                }
              />
            )}
            {this.state.stocks.length > 0 && (
              <div>
                <Table
                  columns={columns}
                  dataSource={this.state.stocks}
                  scroll={{ x: 480 }}
                  pagination={{ defaultPageSize: 5 }}
                />
                <CollectionCreateForm
                  wrappedComponentRef={this.saveFormRef}
                  modalVisible={this.state.modalVisible}
                  handleModalCancel={this.handleModalCancel}
                  handleEdit={this.handleEdit}
                  confirmLoading={this.state.confirmLoading}
                />
                <Historical data={this.state.data} />
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
