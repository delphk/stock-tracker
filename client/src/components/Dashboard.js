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

class Dashboard extends React.Component {
  state = {
    stocks: [],
    modal: false
  };

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  async componentDidMount() {
    try {
      const request = await fetch("/stocks", {
        method: "get"
      });
      const response = await request.json();
      this.setState({ stocks: response });
      if (this.state.stocks.length > 0) {
        this.getStockPrices();
      }
    } catch (err) {
      console.log(err);
    }
  }

  getStockPrices = async () => {
    const arrayOfSymbols = this.state.stocks.map(stock => stock.symbol);
    const symbols = arrayOfSymbols.join(",");
    const url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbols}&types=quote`;
    const request = await fetch(url);
    const response = await request.json();
    const arrayOfStockPrices = [];
    for (let i = 0; i < arrayOfSymbols.length; i++) {
      const prices = response[arrayOfSymbols[i]]["quote"]["close"];
      arrayOfStockPrices.push(prices);
    }
    let stocks = [...this.state.stocks];
    stocks.map((stock, index) => (stock.price = arrayOfStockPrices[index]));
    this.setState({ stocks });
  };

  handleEdit = async (id, index, e) => {
    e.preventDefault();
    console.log(index);
    const request = await fetch(`/stocks/${id}`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetlow: e.target.newtargetlow.value,
        targethigh: e.target.newtargethigh.value
      })
    });
    const response = await request.json();
    console.log(response);
    let stocks = [...this.state.stocks];
    stocks[index]["targetlow"] = response.stock.targetlow;
    stocks[index]["targethigh"] = response.stock.targethigh;
    this.setState({ stocks });
    this.toggleModal();
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
            {this.state.stocks.map((stock, index) => {
              let myStock = stock;
              let myIndex = index;
              let handler = this.handleEdit.bind(stock._id, index);
              return (
                <tr key={index}>
                  <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>
                      Edit Target Price
                    </ModalHeader>
                    <form onSubmit={e => handler(e)}>
                      <ModalBody>
                        <Label>Target Low:</Label>{" "}
                        <Input name="newtargetlow" type="number" />
                        <Label>Target High:</Label>{" "}
                        <Input name="newtargethigh" type="number" />
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary">Do Something</Button>
                      </ModalFooter>
                    </form>
                  </Modal>
                  <th scope="row">{myIndex + 1}</th>
                  <td>{myStock.name}</td>
                  <td>{myStock.symbol}</td>
                  <td>${myStock.price}</td>
                  <td>
                    {myStock.targetlow
                      ? "$" + myStock.targetlow.toFixed(2)
                      : "-"}
                  </td>
                  <td>
                    {myStock.targethigh
                      ? "$" + myStock.targethigh.toFixed(2)
                      : "-"}
                  </td>
                  <td>
                    <i
                      className="fa fa-edit fa-lg"
                      onClick={this.toggleModal}
                    />
                    <i
                      className="fa fa-trash fa-lg"
                      onClick={() => this.handleDelete(myStock._id, myIndex)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default Dashboard;
