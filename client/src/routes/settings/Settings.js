import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { Alert, Button, Switch, Modal, Row, Col, Icon, Typography } from "antd";
import Spinner from "../../components/spinner/Spinner";
import {
  getUserInfo,
  verifyUser,
  updateEmailAlert
} from "../../helpers/api/api";
const { Text } = Typography;
const Settings = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [emailSentMessage, setEmailSentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getUserInfo();
        setUserInfo(response.data);
        setIsLoading(false);
        if (!response.data.isVerified) {
          setVerificationMessage(
            "Your email has not been verified. Please verify your email in order to receive email alerts."
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const sendVerification = async () => {
    try {
      const response = await verifyUser();
      if (response) {
        setEmailSentMessage(response.data.msg);
        modalEmailSuccess();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleAlert = async () => {
    try {
      const response = await updateEmailAlert({
        emailAlert: !userInfo.emailAlert
      });
      setUserInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const renderVerificationMessage = message => (
    <div className="responsive-flex">
      <span>{message}</span>
      <Button onClick={sendVerification}>Send verification email</Button>
    </div>
  );

  const modalEmailSuccess = () => {
    Modal.success({
      title: "Email Sent!",
      content: emailSentMessage
    });
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Container style={{ paddingTop: "1%" }}>
          {verificationMessage && (
            <Alert
              message={renderVerificationMessage(verificationMessage)}
              type="error"
              showIcon
            />
          )}
          <h1 className="heading">Account Settings</h1>
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
                        Verified <Icon type="check-circle" className="icon" />
                      </span>
                    ) : (
                      <span id="unverified">
                        Unverified <Icon type="close-circle" className="icon" />
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
                    onClick={toggleAlert}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Settings;
