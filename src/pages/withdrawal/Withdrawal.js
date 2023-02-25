/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Button, Label, Input, Table, FormGroup, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import ReactSelect from "react-select";

import Widget from "../../components/Widget/Widget";

import s from "./Withdrawal.module.scss";
import "../../styles/custom.css"

import { Link, withRouter } from "react-router-dom";
import { setChecking } from '../../actions/navigation'
import { toast } from "react-toastify";

class Withdrawal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      methods: [],
      method: null,
      withdraws: [],
      tradingAccount: "",
      tradingAccountBalance: "",
      address : '',
      amount : null,
      benificiaryName : null,
      bankName : null,
      bankAccount : null,
      bankBranch : null,
      verifycode: null
    };

    this.changeAccount = this.changeAccount.bind(this);
    this.changeMethod = this.changeMethod.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
    this.changeBenificiaryName = this.changeBenificiaryName.bind(this);
    this.changeBankName = this.changeBankName.bind(this);
    this.changeBankAccount = this.changeBankAccount.bind(this);
    this.changeBankBranch = this.changeBankBranch.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.sendVerifyCode = this.sendVerifyCode.bind(this);
    this.changeVerifyCode = this.changeVerifyCode.bind(this);
  }

  changeVerifyCode = (e) => {
    this.setState({ verifycode: e.target.value })
  }

  sendVerifyCode = (e) => {
    // confirm sms code from email
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/auth/send-verify-code`, { params: { email: this.props.account?.email }})
    .then( async result => {
      toast.success("Withdraw verification code sent successfully! Please check the email.")
    }) 
    .catch(e => {
      console.log(e);
    })
  }

  changeAccount = (e) => {
    this.setState({ tradingAccount: e.value }); 
    this.setState({ tradingAccountBalance: e.balance });
  }
  changeMethod = (e) => {
    this.setState({ method: e.value })
  }
  changeAddress = (e) => {
    this.setState({ address: e.target.value })
  }
  changeAmount = (e) => {
    this.setState({ amount: e.target.value })
  }
  changeBenificiaryName = (e) => {
    this.setState({ benificiaryName: e.target.value })
  }
  changeBankName = (e) => {
    this.setState({ bankName: e.target.value })
  }
  changeBankAccount = (e) => {
    this.setState({ bankAccount: e.target.value })
  }
  changeBankBranch = (e) => {
    this.setState({ bankBranch: e.target.value })
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
    if (this.state.method === "USDT BEP20") {
      /*
      if(parseInt(this.state.amount) < 50 ){
        toast.warn("Please set the amount more than 50USD");
        inputValidation = false;
      }
      */
      if(!this.state.address){
        toast.warn("Please input withdraw address!");
        inputValidation = false;
      }
      let regex = /^0x[a-fA-F0-9]{40}$/;
      if (this.state.address.match(regex) === null) {
        toast.warning("Invalid address entered. Please input a correct BEP20 address!");
        inputValidation = false;
      }
    } else if ( this.state.method === "Vietnam Bank Transfer" ) {
      if(!this.state.benificiaryName){
        toast.warn("Please input Benificiary Name!");
        inputValidation = false;
      }
      if(!this.state.bankName){
        toast.warn("Please input Bank Name!");
        inputValidation = false;
      }
      if(!this.state.bankAccount){
        toast.warn("Please input Bank Account!");
        inputValidation = false;
      }
    }

   console.log(this.state);
    if(!this.state.verifycode){
      toast.warn("Please input verification code!");
      inputValidation = false;
    }
    
    if(!inputValidation){
      return;
    }
    const { account } = this.props;

    const tradingAccountFilter = this.state.accounts?.find(item => item.value === this.state.tradingAccount);
    const data = {
      email:                account?.email, 
      tradingAccountUuid:   tradingAccountFilter.tradingAccountUuid,
      tradingAccountId:     this.state.tradingAccount,
      address:              this.state.address,
      amount:               this.state.amount,
      code:                 this.state.verifycode,
      partnerId:            account?.partnerId,
      method:               this.state.method, 
      benificiaryName:      this.state.benificiaryName, 
      bankName:             this.state.bankName, 
      bankAccount:          this.state.bankAccount, 
      bankBranch:           this.state.bankBranch, 
      // for only update current states
      currency: "USD",
      status: "Pending",
      submittedAt: new Date(),
    }
    this.props.dispatch(setChecking(true));
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/other/withdraw`, data )
    .then( res => {
      if ( res.data.status == "0" ) {
        toast.warning(res.data.message);
        this.props.dispatch(setChecking(false));
        return;
      }
      this.props.dispatch(setChecking(false));
      this.setState({ withdraws: [...this.state.withdraws, data ] });
      toast.success("Withdraw request was successfully sent to admin!")
      this.setState({ address:'', amount: '', verifycode:'', benificiaryName:'', bankName:'', bankAccount:'', bankBranch:''});
    })
    .catch(e => {
      this.props.dispatch(setChecking(false));
      toast.success("Withdraw request was failed!")
      console.log(e);
    })
  }

  componentDidMount() {
    if(this.props.account?.verification_status !== "Approved")
    {
      this.props.history.push(`/app/profile/verify`);
      return;
    }
    const { match } = this.props;
    let accounts = [];
    this.props.dispatch(setChecking(true));
    this.setState({ 
        methods: [
          {
            value: "USDT BEP20",
            label: "USDT BEP20"
          },
          {
            value: "Vietnam Bank Transfer",
            label: "Vietnam Bank Transfer"
          },
          {
            value: "Neteller",
            label: "Neteller"
          },
          {
            value: "Skrill",
            label: "Skrill"
          },
          {
            value: "International Bankwire",
            label: "International Bankwire"
          },
        ],
      benificiaryName: this.props.account.fullname,
    })
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/other/withdraw`, { params: { email: this.props.account?.email }})
    .then( async res => {
        this.setState({ withdraws: res.data });
    })
    .catch(e => {
      console.log(e);
    })
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccounts`, { params: { clientUuid: this.props.account?.accountUuid, partnerId: this.props.account?.partnerId }})
    .then( async res => {
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/offers`, { params: { email: this.props.account?.email, partnerId: this.props.account?.partnerId }})
      .then( async offersRes => {
        let offersTemp = offersRes.data.filter(item => item.demo === false );
        let liveTrAccounts = res.data?.filter(item => {
          let liveOffer = offersTemp.find(offer =>  offer.uuid === item.offerUuid);
          if(liveOffer) return true;
          else return false;
        });

        let temp = [];
        for (const element of liveTrAccounts) {
          temp.push({ value: element.login, balance: element.balance, label: element.login, address: element.address, tradingAccountUuid: element.uuid})
        }
        this.setState({ accounts: temp, tradingAccount: liveTrAccounts[0].login, tradingAccountBalance: liveTrAccounts[0].balance, address: liveTrAccounts[0].address }); 
        this.props.dispatch(setChecking(false));
      })
      .catch(err => {
        console.log(err)
        this.props.dispatch(setChecking(false));
      })
    })
    .catch(e => {
      this.props.dispatch(setChecking(false));
      this.setState({ title: match.params.currency, accounts }); 
      console.log(e);
    })

  }
  render() {
  const { themeColor } = this.props;
  const { accounts, methods, method, tradingAccount, tradingAccountBalance, address, amount, benificiaryName, bankName, bankAccount, bankBranch, verifycode } = this.state;

    return (
      <div className={s.root}>
         <div className="form-content">
              <p className={`page-title-${themeColor}`}>
                  IMPORTANT: More withdrawal options are available than you can see here. Contact us for details.
              </p>
              <Row>
                <Col lg={6} >
                      <div className="mt-2">
                          <Label><strong>Method *</strong></Label>
                          <ReactSelect
                              options={ methods } 
                              className="react-select-container mt-1" 
                              classNamePrefix="react-select"
                              value={{ value: method, label: method }}
                              onChange={e => this.changeMethod(e)}
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
              {
                method === "USDT BEP20" &&
                <div>
                  <Row>
                    <Col lg={6} >
                          <div className="mt-2">
                              <Label><strong>Trading Account *</strong></Label>
                              <ReactSelect
                                  options={ accounts } 
                                  className="react-select-container mt-1" 
                                  classNamePrefix="react-select"
                                  balance={ tradingAccountBalance } 
                                  value={{ value: tradingAccount, label: tradingAccount + " ( " + tradingAccountBalance  + "USD )" }}
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
                          <Label><strong >Address: </strong></Label>
                          <Input value={ address } onChange={e => this.changeAddress(e)} ></Input>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={6} >
                      <div className="">
                          <Label><strong >Amount: </strong></Label>
                          <Input type="number" value={ amount } onChange={e => this.changeAmount(e)} ></Input>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={3}>
                      <FormGroup>
                          <InputGroup className="input-group-no-border mt-3">
                              <Input className="input-transparent c_code_ipt pl-3" type="text" value={verifycode} name="verifycode" onChange={e => this.changeVerifyCode(e)} placeholder="CODE"/>
                              <InputGroupAddon addonType="prepend">
                                  <InputGroupText className="c_sendcode_btn" onClick={e => this.sendVerifyCode()} >
                                      Email Code
                                  </InputGroupText>
                              </InputGroupAddon>
                          </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="mt-4 mb-3">
                      <Button className={`btn-success`} onClick={e => this.withdraw()} >Request Withdraw</Button>       
                  </div>
                </div>
              }
              {
                method === "Vietnam Bank Transfer" &&
                <div>
                  <Row>
                    <Col lg={6} >
                          <div className="mt-2">
                              <Label><strong>Trading Account *</strong></Label>
                              <ReactSelect
                                  options={ accounts } 
                                  className="react-select-container mt-1" 
                                  classNamePrefix="react-select"
                                  balance={ tradingAccountBalance } 
                                  value={{ value: tradingAccount, label: tradingAccount + " ( " + tradingAccountBalance  + "USD )" }}
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
                          <Label><strong >Benificiary Name: </strong></Label>
                          <Input value={ benificiaryName } onChange={e => this.changeBenificiaryName(e)} ></Input>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={6} >
                      <div className="">
                          <Label><strong >Bank Name: </strong></Label>
                          <Input value={ bankName } onChange={e => this.changeBankName(e)} ></Input>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={6} >
                      <div className="">
                          <Label><strong >Bank Account: </strong></Label>
                          <Input value={ bankAccount } onChange={e => this.changeBankAccount(e)} ></Input>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={6} >
                      <div className="">
                          <Label><strong >Bank Branch: </strong></Label>
                          <Input value={ bankBranch } onChange={e => this.changeBankBranch(e)} ></Input>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={6} >
                      <div className="">
                          <Label><strong >Amount: </strong></Label>
                          <Input type="number" value={ amount } onChange={e => this.changeAmount(e)} ></Input>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={3}>
                      <FormGroup>
                          <InputGroup className="input-group-no-border mt-3">
                              <Input className="input-transparent c_code_ipt pl-3" type="text" value={verifycode} name="verifycode" onChange={e => this.changeVerifyCode(e)} placeholder="CODE"/>
                              <InputGroupAddon addonType="prepend">
                                  <InputGroupText className="c_sendcode_btn" onClick={e => this.sendVerifyCode()} >
                                      Send Code
                                  </InputGroupText>
                              </InputGroupAddon>
                          </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="mt-4 mb-3">
                      <Button className={`btn-success`} onClick={e => this.withdraw()} >Request Withdraw</Button>       
                  </div>
                </div>
              }
              {
                (method === "Neteller" || method === "Skrill" || method === "International Bankwire" ) &&
                <p>This method is not supported in your region</p>

              }
             
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
                        <th>Address</th>
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
                          <td>{ row.address }</td>
                          <td>{ row.amount }</td>
                          <td>{ row.currency }</td>
                          <td>{ new Date(row.submittedAt).toLocaleString() }</td>
                          <td >
                            <span
                              className={`tb-status text-${
                                (row.status === "Approved" || row.status === "DONE") ? "success" : row.status === "Pending" ? "info" : "danger"
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