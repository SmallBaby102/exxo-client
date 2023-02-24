/* eslint-disable no-unreachable */
import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Row, Col, Table, Input, Button } from "reactstrap";
import { Snackbar } from "@mui/material";
import { AiOutlineCopy } from "react-icons/ai";
import s from "./Withdrawal.module.scss";

import { Link, withRouter } from "react-router-dom";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ibClients: [],
      inviteLink: "http://localhost:3000/register",
    };
  }

  componentDidMount() { 
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/own-ib-clients`, { params: { parentTradingAccountUuid: this.props.account?.ibParentTradingAccountUuid }})
    .then( async res => {
        this.setState({ ibClients: res.data });
    })
    .catch(e => {
      console.log(e);
    });
    const account = this.props.account;
    this.setState({ inviteLink: account?.IBLink})
  }

  handleCopy = (e) => {
    this.setState({ open: true})
    navigator.clipboard.writeText(this.state.inviteLink);
  }
  
  render() {
    const { themeColor } = this.props;
    const { ibClients, inviteLink } = this.state;

    return (
      <div className={s.root}>
        <div className={s.refer_banner}>
          <div className={s.refe_earn_banner}>
            <h1 className="mt-2">Earn up to $250 per referral</h1>
            <h3 style={{ maxWidth: "380px"}}>Each referral will receive a one-time 15% Deposit Bonus</h3>
            <Row>
              <Col lg={12}>                      
              <div className="mt-3">
                <div>
                  <div className="c_ib_alert_dv">You are already IB user. You can invite your friends using bellow invite link.</div>
                  <Row className="mt-2 c_ib_link_row">
                      <Col md={8} className={s.c_padd_right_0}>
                          <Input disabled value={ inviteLink }></Input>
                      </Col>
                      <Col md={1} className={s.c_padd_left_0}>
                          <Button onClick={(e) => this.handleCopy(e)} className="btn-success"><AiOutlineCopy></AiOutlineCopy></Button>
                          <Snackbar
                            open={this.state.open}
                            onClose={() => this.setState({ open: false})}
                            message="Copied to clibboard"
                            anchorOrigin={{ vertical: "top", horizontal: "center" }}
                            autoHideDuration={1600}
                          />
                      </Col>
                  </Row>
                </div>
              </div>
            </Col>
            </Row>
          </div>
        </div> 
        <div className="form-content">
          <hr></hr>
          <h5 className="mb-3">
            IB Clients History
          </h5>
          <div className={s.overFlow}>
              <Table lg={12} md={12} sm={12} striped>
                <thead>
                  <tr className="fs-sm">
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Account UUID</th>
                    <th>phone</th>
                    <th>Submitted At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  { this.state.ibClients.map((row) => (
                    <tr key={row.uuid}>
                      <td>
                      { row.fullname }
                      </td>
                      <td>
                        { row.email }
                      </td>
                      <td>{ row.accountUuid }</td>
                      <td>{ row.phone }</td>
                      <td>{ new Date(row.submittedAt).toLocaleString() }</td>
                      <td >
                        <span
                          className={`tb-status text-${
                            (row.verification_status === "Approved" || row.verification_status === "DONE") ? "success" : row.verification_status === "Pending" ? "info" : "danger"
                          }`}
                        >
                          { row.verification_status } 
                        </span>
                        </td>
                    </tr>
                  ))}
                  {
                    this.state.ibClients.length < 1 && 
                    <tr>
                      <td colspan="6" className="text-center">There are not IB client.</td>
                    </tr>
                  }
                </tbody>
              </Table>
          </div>
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
export default withRouter(connect(mapStateToProps)(Dashboard));