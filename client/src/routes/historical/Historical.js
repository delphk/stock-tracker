import React from "react";
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
import { getRandomColor } from "../../utils";

const Historical = ({ data }) => {
  let keys;
  if (data.length > 0) {
    keys = Object.keys(data[0]);
    keys.splice(0, 1);
  }

  return (
    data.length > 0 && (
      <div>
        <h1 className="heading">Historical Chart</h1>
        <ResponsiveContainer width="80%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={15} />
            <YAxis />
            {keys.map((key, index) => {
              return (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={key}
                  stroke={getRandomColor()}
                />
              );
            })}
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  );
};

export default Historical;
