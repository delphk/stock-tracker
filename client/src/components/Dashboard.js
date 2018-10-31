import React from "react";
import { Table, Container } from "reactstrap";

class Dashboard extends React.Component {
  state = {
    stocks: []
  };

  async componentDidMount() {
    const request = await fetch("/stocks/5bd91d334726e44cc1793dbd", {
      method: "get",
      headers: { "Content-Type": "application/json" }
    });
    const response = await request.json();
    this.setState({ stocks: response });
  }

  render() {
    return (
      <Container>
        <h2>Dashboard</h2>
        <Table striped responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Stock name</th>
              <th>Symbol</th>
              <th>Current price</th>
              <th>Target low price</th>
              <th>Target high price</th>
            </tr>
          </thead>
          <tbody>
            {this.state.stocks.map((stock, index) => (
              <tr key={index}>
                <th scope="row">1</th>
                <td>{stock.name}</td>
                <td>{stock.symbol}</td>
                <td>100</td>
                <td>{stock.targetlow}</td>
                <td>{stock.targethigh}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default Dashboard;
