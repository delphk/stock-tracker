import React from "react";
import { Table, Container } from "reactstrap";

class Dashboard extends React.Component {
  state = {
    stocks: []
  };

  async componentDidMount() {
    const request = await fetch("/stocks", {
      method: "get",
      headers: { "Content-Type": "application/json" }
    });
    const response = await request.json();
    this.setState({ stocks: response });
    if (this.state.stocks.length > 0) {
      this.getStocks();
    }
  }

  getStocks = async () => {
    const arrayOfSymbols = this.state.stocks.map(stock => stock.symbol);
    const symbols = arrayOfSymbols.join(",");
    const url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbols}&types=quote`;
    const request = await fetch(url);
    const response = await request.json();
    const arrayOfStockPrices = [];
    let stocks = [...this.state.stocks];
    for (let i = 0; i < arrayOfSymbols.length; i++) {
      const prices = response[arrayOfSymbols[i]]["quote"]["close"];
      arrayOfStockPrices.push(prices);
    }
    stocks.map((stock, index) => (stock.price = arrayOfStockPrices[index]));
    this.setState({ stocks });
    console.log(this.state);
  };

  handleDelete = async (id, index) => {
    const request = await fetch(`/stocks/${id}`, {
      method: "delete",
      headers: { "Content-Type": "application/json" }
    });
    const response = await request.json();
    console.log(response);
    let stocks = [...this.state.stocks];
    stocks.splice(index, 1);
    this.setState({ stocks });
  };

  render() {
    console.log(this.state);
    return (
      <Container>
        <h2>Dashboard </h2>
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
            {this.state.stocks.map((stock, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{stock.name}</td>
                <td>{stock.symbol}</td>
                <td>{stock.price}</td>
                <td>{stock.targetlow}</td>
                <td>{stock.targethigh}</td>
                <td>
                  <i className="fa fa-edit fa-lg" />
                  <i
                    className="fa fa-trash fa-lg"
                    onClick={() => this.handleDelete(stock._id, index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default Dashboard;
