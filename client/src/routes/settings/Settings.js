import React from "react";
import { Container } from "reactstrap";
import { Alert, Button, Switch, Modal, Row, Col, Icon, Typography } from "antd";
import Spinner from "../../components/spinner/Spinner";
import {
  getUserInfo,
  verifyUser,
  updateEmailAlert
} from "../../helpers/api/api";
const { Text } = Typography;
class Settings extends React.Component {
  state = {
    userInfo: [],
    verificationMessage: "",
    emailSentMessage: "",
    isLoading: true
  };

  async componentDidMount() {
    try {
      const response = await getUserInfo();
      this.setState({ userInfo: response.data, isLoading: false });
      if (!response.data.isVerified) {
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
      const response = await verifyUser();
      if (response) {
        this.setState({ emailSentMessage: response.data.msg });
        this.modalEmailSuccess();
      }
    } catch (err) {
      console.log(err);
    }
  };

  toggleAlert = async () => {
    try {
      const response = await updateEmailAlert({
        emailAlert: !this.state.userInfo.emailAlert
      });
      this.setState({ userInfo: response.data });
    } catch (err) {
      console.log(err);
    }
  };

  renderVerificationMessage = message => (
    <div className="responsive-flex">
      <span>{message}</span>
      <Button onClick={this.sendVerification}>Send verification email</Button>
    </div>
  );

  modalEmailSuccess = () => {
    Modal.success({
      title: "Email Sent!",
      content: this.state.emailSentMessage
    });
  };

  render() {
    const { isLoading, verificationMessage, userInfo } = this.state;
    return (
      <React.Fragment>
        {isLoading ? (
          <Spinner />
        ) : (
          <Container style={{ paddingTop: "1%" }}>
            {verificationMessage && (
              <Alert
                message={this.renderVerificationMessage(verificationMessage)}
                type="error"
                showIcon
              />
            )}
            <h2 className="heading">Account Settings</h2>
            <Row>
              <Col sm={24} md={8} lg={8} xl={8}>
                <p className="subheader">Profile</p>
              </Col>
              <Col sm={24} md={12} lg={16} xl={16}>
                <Row className="pd-btm">
                  <Col span={8}>
                    <Text strong>Name:</Text>
                  </Col>
                  <Col>{userInfo.name}</Col>
                </Row>
                <Row className="pd-btm">
                  <Col span={8}>
                    <Text strong>Username:</Text>
                  </Col>
                  <Col>{userInfo.username}</Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Text strong>Email:</Text>
                  </Col>
                  <Col offset={8}>
                    <div>
                      <span className="custom-field">{userInfo.email}</span>
                      {userInfo.isVerified ? (
                        <span id="verified">
                          Verified <Icon type="check-circle" />
                        </span>
                      ) : (
                        <span id="unverified">
                          Unverified <Icon type="close-circle" />
                        </span>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col sm={24} md={8} lg={8} xl={8}>
                <p className="subheader">Preferences</p>
              </Col>
              <Col sm={24} md={8} lg={8} xl={8}>
                <Row className="pd-btm">
                  <Col className="pd-btm">Email Alerts:</Col>
                  <Col>
                    <Switch
                      disabled={!userInfo.isVerified}
                      checked={userInfo.emailAlert}
                      onClick={this.toggleAlert}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        )}
      </React.Fragment>
    );
  }
}

export default Settings;
