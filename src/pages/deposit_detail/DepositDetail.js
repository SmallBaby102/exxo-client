/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Button , Label, Input,Spinner } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import s from "./Deposit.module.scss";
import { Link, withRouter } from "react-router-dom";
import { AiOutlineCopy } from "react-icons/ai";
import { Snackbar } from "@mui/material";
import ReactSelect from "react-select";

import { setChecking } from '../../actions/navigation'
import { toast } from "react-toastify";
import StacoinexResult from "./StacoinexResult";

class DepositDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      accounts: [],
      account: "",
      currency: "BTC",
      open: false,
      title : "",
      address : null,
      amount : null,
      result: null
    };
    this.onDeposit = this.onDeposit.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.changeAccount = this.changeAccount.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
  }
 
  changeAccount = (e) => {
    this.setState({ account: e.value, address: e.address })
  }
  changeAmount = (e) => {
    this.setState({ amount: e.target.value })
  }
  changeCurrency = (e) => {
    this.setState({ currency: e.value})
  }
  handleCopy = (e) => {
    this.setState({ open: true})
    navigator.clipboard.writeText(this.state.address);
  }
  capitalizeFirstLetter(v) {
    return v.charAt(0).toUpperCase() + v.substring(1);
  }
  onDeposit() {
    const { address, amount } = this.state;
    if (!address) {
      toast.warning("Please input the wallet address!");
      return;
    }
    let validation = true;
    if (amount > 9500) {
      validation = false;
    }
    if (amount < 100) {
      validation = false;
    }
    if(!validation){
      toast.warning("Please input the amount under 9500 and over 100!");
      return;
    }
    const data = {
      receive_address : address,
      receive_amount : amount,
      user_info : this.props.account?.email,
    }
    this.setState({ loading: true });
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/buy`, data)
    .then(res => {
        // toast.success("Deposit Success!");
        this.setState({ loading: false, result: res.data?.data?.order });
      })
    .catch(err => {
      console.log(err);
      toast.error("Deposit Failed!");
      this.setState({ loading: false });

    })
  }
  
  componentDidMount() {
    const { match } = this.props;
    let accounts = [];
    this.props.dispatch(setChecking(true));
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccounts`, { params: { clientUuid: this.props.account?.accountUuid, partnerId: this.props.account?.partnerId }})
    .then( async res => {
      this.props.dispatch(setChecking(false));
      let temp = [];
      for (let index = 0; index < res.data.length; index++) {
        const element = res.data[index];
        temp.push({ value: element.login, label: element.login, address: element.address})
      }
      this.setState({ title: match.params.currency, accounts: temp, account: res.data[0].login, address: res.data[0].address }); 
    console.log(res);
    })
    .catch(e => {
      this.props.dispatch(setChecking(false));
      this.setState({ title: match.params.currency, accounts }); 
      console.log(e);
    })

  }
  render() {
  const { themeColor } = this.props;
  const { title, address, amount, accounts, account, result } = this.state;
    return (
      <div className={s.root}>
          {
            result === null?
            <div>
              <div className="form-content">
                <h4 className={`page-title-${themeColor}`}>
                    { title === "Tether" ? "Deposit USDT BEP20" : this.capitalizeFirstLetter(title) }
                </h4>
                <Row>
                    <Col lg={6} >
                          <div className="mt-2">
                            <Label>Trading Account *</Label>
                              <ReactSelect
                                  options={ accounts } 
                                  className="react-select-container mt-1" 
                                  classNamePrefix="react-select"
                                  value={{ value: account, label: account }}
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
              </div> 
              {
                address !== null &&
                <div className="form-content">
                    {
                      title === "stacoinex" ? 
                      <div>
                        <Row className="mt-2">
                            <Col lg={6} >
                              <div className="">
                                  <Label><strong >Amount: </strong></Label>
                                  <Input value={ amount } onChange={e => this.changeAmount(e)} ></Input>
                              </div>
                            </Col>
                          </Row>
                          <div className="mt-4 mb-3 ">
                              <Button className={`btn-success`} onClick={e => this.onDeposit()} >
                              {this.state.loading ? <Spinner size="sm" color="light"></Spinner> : 'Deposit via Stacoinex'}</Button>       
                          </div>
                      </div>:
                      <div>
                          <h6 className={`page-title-${themeColor}`}>
                            To deposit funds, make a transfer to the blockchain address below. Copy the address or scan the QR code with the camera on your phone.
                          </h6>
                          <br/>Your unique USDT BEP20 account address
                          <Row className="mt-2">
                              <Col md={1} className="d-flex align-items-center">
                                  <Label><strong >Address: </strong></Label>
                              </Col>
                              <Col md={8}>
                                  <Input disabled value={ address }></Input>
                              </Col>
                              <Col md={3}>
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
                          <Row>
                              <Col md={12}>
                                  <p className="mt-3">Alternatively you can use the QR code below to complete this transaction with your mobile device:</p>
                              </Col>
                              <Col md={12} className="text-center">
                                  <img src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${address}`} alt="QrCode"></img>
                              </Col>
                          </Row>
                      </div>
                    }
                </div>
              }
            </div>:
            <StacoinexResult result={result}></StacoinexResult>
          }
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
export default withRouter(connect(mapStateToProps)(DepositDetail));