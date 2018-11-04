import React, { Component } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Legend
} from "recharts";

class Historical extends Component {
  state = {
    data: []
  };

  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  render() {
    let keys;
    if (this.props.data.length > 0) {
      keys = Object.keys(this.props.data[0]);
      keys.splice(0, 1);
    }

    return (
      this.props.data.length > 0 && (
        <div>
          <h2 id="heading">Historical Chart</h2>
          <ResponsiveContainer width="80%" height={400}>
            <LineChart data={this.props.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" minTickGap={15} />
              <YAxis />
              {keys.map((key, index) => {
                return (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={key}
                    stroke={this.getRandomColor()}
                  />
                );
              })}
              <Tooltip />;<Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    );
  }
}

export default Historical;
