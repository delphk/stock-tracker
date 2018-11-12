import React from "react";
import {
  Alert,
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Table
} from "reactstrap";

class Settings extends React.Component {
  state = {
    userInfo: [],
    modal: false,
    verificationMessage: "",
    emailSentMessage: "",
    isLoading: true
  };

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  async componentDidMount() {
    try {
      const request = await fetch("/users", {
        method: "get"
      });
      const response = await request.json();
      this.setState({ userInfo: response, isLoading: false });
      if (!response.isVerified) {
        this.setState({
          verificationMessage:
            "Your email has not been verified. Please verify your email in order to receive email alerts."
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  sendVerification = async () => {
    try {
      const request = await fetch("/users/verify", {
        method: "post"
      });
      const response = await request.json();
      if (response.msg) {
        this.setState({ emailSentMessage: response.msg });
        this.toggleModal();
      }
    } catch (err) {
      console.log(err);
    }
  };

  toggleAlert = async () => {
    try {
      const request = await fetch("/users", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAlert: !this.state.userInfo.emailAlert
        })
      });
      const response = await request.json();
      this.setState({ userInfo: response });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    console.log(this.state);
    return (
      !this.state.isLoading && (
        <Container>
          {this.state.verificationMessage && (
            <Alert color="danger">
              {this.state.verificationMessage}{" "}
              <Button
                className="secondary m-2"
                size="sm"
                onClick={this.sendVerification}
              >
                Send verification email
              </Button>
              <Modal
                isOpen={this.state.modal}
                toggle={this.toggleModal}
                className={this.props.className}
              >
                <ModalHeader toggle={this.toggleModal}>Email Sent!</ModalHeader>
                <ModalBody>{this.state.emailSentMessage}</ModalBody>
              </Modal>
            </Alert>
          )}
          <h2 id="heading">User Info</h2>

          <Table borderless>
            <tbody>
              <tr>
                <th scope="row">Name:</th>
                <td>{this.state.userInfo.name}</td>
              </tr>
              <tr>
                <th scope="row">Username:</th>
                <td>{this.state.userInfo.username}</td>
              </tr>
              <tr>
                <th scope="row">Email:</th>
                <td>
                  {this.state.userInfo.email}{" "}
                  {this.state.userInfo.isVerified ? (
                    <span id="verified">
                      <em>Verified</em>
                    </span>
                  ) : (
                    <span id="unverified">
                      <em>Unverified</em>
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </Table>

          <h2 id="heading">Preferences</h2>
          <Table borderless>
            <tbody>
              <tr>
                <th scope="row">Email Price Alerts:</th>
                <td>
                  {" "}
                  <span className="toggle-switch">
                    <label className="switch">
                      <input
                        type="checkbox"
                        disabled={!this.state.userInfo.isVerified}
                        checked={this.state.userInfo.emailAlert}
                        onClick={this.toggleAlert}
                      />
                      <span className="slider round" />
                    </label>
                  </span>
                </td>
              </tr>
            </tbody>
          </Table>
        </Container>
      )
    );
  }
}

export default Settings;
