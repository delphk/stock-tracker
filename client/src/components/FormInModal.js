import React from "react";
import { Modal, Form, Input } from "antd";

const CollectionCreateForm = Form.create({ name: "form_in_modal" })(
  class extends React.Component {
    render() {
      const {
        modalVisible,
        handleEdit,
        confirmLoading,
        handleModalCancel,
        form
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          className="custom-modal"
          title="Edit target price"
          visible={modalVisible}
          onOk={handleEdit}
          okText={"Edit"}
          confirmLoading={confirmLoading}
          onCancel={handleModalCancel}
        >
          <Form layout="vertical">
            <Form.Item label="Target low:">
              {getFieldDecorator("newtargetlow")(
                <Input name="newtargetlow" type="number" />
              )}
            </Form.Item>
            <Form.Item label="Target high:">
              {getFieldDecorator("newtargethigh")(
                <Input name="newtargetlow" type="number" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

export default CollectionCreateForm;
