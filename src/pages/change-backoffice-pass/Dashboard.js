/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Spinner, Table, Label, Input, Button } from "reactstrap";
import { connect } from "react-redux";

import s from "./Dashboard.module.scss";
import axios from "axios";
import { toast } from "react-toastify";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentPassword: "",
      newPassword: "",
    };
    this.changePassword = this.changePassword.bind(this);
  }
  changePassword() {
    const { currentPassword, newPassword } = this.state;
    const data = {
      currentPassword,
      newPassword,
      email: this.props.account?.email,
      partnerId: this.props.account?.partnerId,
    }
    this.setState({ loading: true });
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/changePassword`, data)
    .then(res => {
      toast.success("Successfully changed");
      this.setState({ loading: false });
    })
    .catch(e => {
      toast.error(e.response.data.message);
      this.setState({ loading: false });
    })
  }
  render() {
  const { themeColor } = this.props;
  const { currentPassword, newPassword } = this.state;
    return (
      <div className={s.root}>
       
        <div className="form-content">
            <h4 className={`page-title-${themeColor}`}>
              Change Password
            </h4>
            <div>
              Please type your new password in the field below. If you change this password, the passwords of Backoffice and this site are all changed.
            </div>
            <Row>
                <Col lg={6} style={{ marginLeft: "10px" }}>
                      <div className="mt-2">
                        <Label>Current Password *</Label>
                        <Input className="input-content" value={currentPassword} type="password"
                        onChange={e => { this.setState({ currentPassword: e.target.value})}}
                        required></Input>
                      </div>
                      <div className="mt-2">
                        <Label>New Password *</Label>
                        <Input className="input-content" value={newPassword}  type="password"
                        onChange={e => { this.setState({ newPassword: e.target.value})}}
                        required></Input>
                      </div>
                      <div className="mt-3">
                        <Button className="input-content btn-info"
                         onClick={this.changePassword}
                        >
                            {this.state.loading ? <Spinner size="sm" color="light"></Spinner> : 'Submit'}
                        </Button>
                      </div>
                </Col>
             </Row>
        </div>
      </div>
    );
  }
}
function mapStateToProps(store) {
  return {
    themeColor: store.navigation.themeColor,
    account: store.auth.account
  };
}
export default connect(mapStateToProps)(Dashboard);
