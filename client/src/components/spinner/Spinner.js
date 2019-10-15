import React from "react";
import { Spin, Icon } from "antd";

export default () => {
  return (
    <Spin
      data-testid="spinner"
      style={{ margin: "60px auto", display: "block" }}
      indicator={<Icon type="loading" style={{ fontSize: 48 }} spin />}
    />
  );
};
