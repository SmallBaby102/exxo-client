/* eslint-disable no-unreachable */
import React from "react";
import { Table } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";

import s from "./Withdrawal.module.scss";

import { Link, withRouter } from "react-router-dom";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ibClients: [],
    };
  }

  componentDidMount() { 
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/own-ib-clients`, { params: { parentTradingAccountUuid: this.props.account?.parentTradingAccountUuid }})
    .then( async res => {
        this.setState({ ibClients: res.data });
    })
    .catch(e => {
      console.log(e);
    })
  }
  render() {
  const { themeColor } = this.props;
  const { ibClients } = this.state;

    return (
      <div className={s.root}>
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