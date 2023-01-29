/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Progress, Button, Label, Input, Table } from "reactstrap";
import axios from "axios";
import xml2js from "xml2js";
import { connect } from "react-redux";
import ReactSelect from "react-select";


import Widget from "../../components/Widget/Widget";

import s from "./Withdrawal.module.scss";
import { Link, withRouter } from "react-router-dom";
import { setChecking } from '../../actions/navigation'
import { toast } from "react-toastify";

class Withdrawal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      withdraws: [],
      tradingAccount: "",
      amount : null
    };
    this.changeAccount = this.changeAccount.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
    this.withdraw = this.withdraw.bind(this);
  }
  changeAccount = (e) => {
    this.setState({ tradingAccount: e.value })
  }
  changeAmount = (e) => {
    this.setState({ amount: e.target.value })
  }
  withdraw = (e) => {
    let inputValidation = true;
    if(!this.state.tradingAccount){
      toast.warn("Please select trading account!");
      inputValidation = false;
    }
    if(!this.state.amount){
      toast.warn("Please input withdraw amount!");
      inputValidation = false;
    }
    if(!inputValidation){
      return;
    }
    const { account } = this.props;

    const tradingAccountFilter = this.state.accounts?.find(item => item.value === this.state.tradingAccount);
    console.log("tr.acc",  tradingAccountFilter)
    const data = {
      email: account?.email,
      tradingAccountUuid: tradingAccountFilter.tradingAccountUuid,
      tradingAccountId: this.state.tradingAccount,
      amount: this.state.amount,
      partnerId: account?.partnerId,
      // for only update current states
      currency: "USD",
      status: "Pending",
      submittedAt: new Date(),
    }
    this.props.dispatch(setChecking(true));
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/other/withdraw`, data )
    .then( res => {
      this.props.dispatch(setChecking(false));
      this.setState({ withdraws: [...this.state.withdraws, data ] });
      toast.success("Withdraw request was successfully sent to admin!")
    })
    .catch(e => {
      this.props.dispatch(setChecking(false));
      toast.success("Withdraw request was failed!")
      console.log(e);
    })
  }
  componentDidMount() {
    const { match } = this.props;
    let accounts = [];
    this.props.dispatch(setChecking(true));

    axios.get(`${process.env.REACT_APP_BASE_URL}/api/other/withdraw`, { params: { email: this.props.account?.email }})
    .then( async res => {
        this.setState({ withdraws: res.data });
    })
    .catch(e => {
      console.log(e);
    })
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccounts`, { params: { email: this.props.account?.email, partnerId: this.props.account?.partnerId }})
    .then( async res => {
      this.props.dispatch(setChecking(false));
      let temp = [];
      for (let index = 0; index < res.data.length; index++) {
        const element = res.data[index];
        temp.push({ value: element.tradingAccountId, label: element.tradingAccountId, address: element.address, tradingAccountUuid: element.uuid})
      }
      this.setState({ accounts: temp, tradingAccount: res.data[0].tradingAccountId, address: res.data[0].address }); 
    console.log("tr.accounts", res.data);
    })
    .catch(e => {
      this.props.dispatch(setChecking(false));
      this.setState({ title: match.params.currency, accounts }); 
      console.log(e);
    })

  }
  render() {
  const { themeColor } = this.props;
  const { accounts, tradingAccount, amount } = this.state;

    return (
      <div className={s.root}>
         <div className="form-content">
              <p className={`page-title-${themeColor}`}>
                  IMPORTANT: More withdrawal options are available than you can see here. Contact us for details.
              </p>
              <Row>
                <Col lg={6} >
                      <div className="mt-2">
                          <Label><strong>Trading Account *</strong></Label>
                          <ReactSelect
                              options={ accounts } 
                              className="react-select-container mt-1" 
                              classNamePrefix="react-select"
                              value={{ value: tradingAccount, label: tradingAccount }}
                              onChange={e => this.changeAccount(e)}
                              styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: 'grey',
                                    backgroundColor: "white",
                                      cursor: "pointer",
                                      opacity: .8
                                  }),
                                  option: (base) => ({
                                      ...base,
                                      color: 'black',
                                      backgroundColor: "white",
                                      cursor: "pointer"
                                    }),
                              }}
                          />
                      </div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col lg={6} >
                  <div className="">
                      <Label><strong >Amount: </strong></Label>
                      <Input value={ amount } onChange={e => this.changeAmount(e)} ></Input>
                  </div>
                </Col>
              </Row>
              <div className="mt-4 mb-3">
                  <Button className={`btn-success`} onClick={e => this.withdraw()} >Request Withdraw</Button>       
              </div>
              <hr></hr>
              <h5 className="mb-3">
                Withdraw History
              </h5>
              <div className={s.overFlow}>
                  <Table lg={12} md={12} sm={12} striped>
                    <thead>
                      <tr className="fs-sm">
                        <th>Trading Account Id</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Submitted At</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      { this.state.withdraws.map((row) => (
                        <tr key={row.uuid}>
                          <td>
                          { row.tradingAccountId }
                          </td>
                          <td>
                            { row.email }
                          </td>
                          <td>{ row.amount }</td>
                          <td>{ row.currency }</td>
                          <td>{ new Date(row.submittedAt).toLocaleString() }</td>
                          <td >
                            <span
                              className={`tb-status text-${
                                row.status === "Approved" ? "success" : row.status === "Pending" ? "info" : "danger"
                              }`}
                            >
                              { row.status } 
                            </span>
                            </td>
                        </tr>
                      ))}
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
export default withRouter(connect(mapStateToProps)(Withdrawal));