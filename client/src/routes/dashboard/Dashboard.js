import React from "react";
import {
  Table,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  Input
} from "reactstrap";
import { Link } from "react-router-dom";
import Historical from "../historical/Historical";
import Spinner from "../../components/spinner/Spinner";
import {
  getStocks,
  fetchStockPrices,
  editStock,
  deleteStock
} from "../../helpers/api/api";

class Dashboard extends React.Component {
  state = {
    stocks: [],
    modalIndex: undefined,
    data: [],
    isLoading: true
  };

  toggleModal = index => {
    this.setState({
      modalIndex: index
    });
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

      //Get historical data
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

  handleEdit = async (id, index, e) => {
    e.preventDefault();
    try {
      const response = await editStock(id, {
        targetlow: e.target.newtargetlow.value,
        targethigh: e.target.newtargethigh.value
      });
      let stocks = [...this.state.stocks];
      stocks[index]["targetlow"] = response.data.stock.targetlow;
      stocks[index]["targethigh"] = response.data.stock.targethigh;
      this.setState({ stocks });
      this.toggleModal();
    } catch (err) {
      console.log(err);
    }
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

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading && <Spinner />}
        {!this.state.isLoading && (
          <Container>
            <h2 id="heading">Dashboard</h2>
            {this.state.stocks.length === 0 && (
              <h5>
                Click <Link to="/addstock">here</Link> to add stocks to your
                watchlist!
              </h5>
            )}
            {this.state.stocks.length > 0 && (
              <React.Fragment>
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Stock name</th>
                      <th>Symbol</th>
                      <th>Current price</th>
                      <th>Target low price</th>
                      <th>Target high price</th>
                      <th>Edit/ Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.stocks.map((stock, index) => {
                      return (
                        <tr key={index}>
                          <Modal
                            isOpen={this.state.modalIndex === index}
                            toggle={this.toggleModal}
                          >
                            <ModalHeader toggle={this.toggleModal}>
                              Edit Target Price
                            </ModalHeader>
                            <form
                              onSubmit={e =>
                                this.handleEdit(stock._id, index, e)
                              }
                            >
                              <ModalBody>
                                <Label>Target Low:</Label>{" "}
                                <Input name="newtargetlow" type="number" />
                                <Label>Target High:</Label>{" "}
                                <Input name="newtargethigh" type="number" />
                              </ModalBody>
                              <ModalFooter>
                                <Button color="secondary">Edit</Button>
                              </ModalFooter>
                            </form>
                          </Modal>
                          <th scope="row">{index + 1}</th>
                          <td>{stock.name}</td>
                          <td>{stock.symbol}</td>
                          <td>
                            {stock.price
                              ? this.formatStockPrice(stock.price)
                              : ""}
                          </td>
                          <td>
                            {stock.targetlow
                              ? this.formatStockPrice(stock.targetlow)
                              : "-"}
                          </td>
                          <td>
                            {stock.targethigh
                              ? this.formatStockPrice(stock.targethigh)
                              : "-"}
                          </td>
                          <td>
                            <i
                              className="fa fa-edit fa-lg"
                              onClick={() => this.toggleModal(index)}
                            />
                            <i
                              className="fa fa-trash fa-lg"
                              onClick={() =>
                                this.handleDelete(stock._id, index)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <Historical data={this.state.data} />
              </React.Fragment>
            )}
          </Container>
        )}
      </React.Fragment>
    );
  }
}

export default Dashboard;
