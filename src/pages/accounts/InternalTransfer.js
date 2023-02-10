/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Button, Table, Label, Badge, Input, FormGroup, InputGroup } from "reactstrap";
import axios from "axios";
import { setChecking } from '../../actions/navigation'
import { connect } from "react-redux";
import Select from "react-select";
import s from "./Accounts.module.scss";
import { toast } from "react-toastify";

class InternalTransfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0, 
      tradingAccounts: [],
      targetTradingAccounts: [],
      account: "",
      targetAccount: "",
      amount: "",
      originBalance: null,
      targetBalance: null,
    };
    this.withdraw = this.withdraw.bind(this)
    this.changeAccount = this.changeAccount.bind(this);
    this.changeTargetAccount = this.changeTargetAccount.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
  }
  changeAccount(event) {
      let temp = this.state.tradingAccounts?.filter(item => item.value !== event.value);
      this.setState({ targetTradingAccounts: temp});
      this.setState({ account: event.value });
      let originAccount = this.state.tradingAccounts?.find(item => item.value !== event.value);
      this.setState({ originBalance: originAccount.balance });
      if(this.state.targetAccount === event.value){
        this.setState({ targetAccount: ""});
      }
    }
  changeTargetAccount(event) {
      this.setState({ targetAccount: event.value });
      let targetAccount = this.state.tradingAccounts?.find(item => item.value !== event.value);
      this.setState({ targetBalance: targetAccount.balance });
  }
  changeAmount(event) {
      this.setState({ amount: event.target.value });
  }
  withdraw() {
    if(!this.state.account) {
      toast.warning("Please select an origin account!");
      return;
    }
    if(!this.state.targetAccount) {
      toast.warning("Please select a target account!");
      return;
    }
    if(!this.state.amount) {
      toast.warning("Please select amount!");
      return;
    }
    this.props.dispatch(setChecking(true));
    const originTradingAccount = this.state.tradingAccounts.find(item => item.value === this.state.account)
    const targetTradingAccount = this.state.tradingAccounts.find(item => item.value === this.state.targetAccount)
    const data = {
      originTradingAccountUuid: originTradingAccount.uuid,
      targetTradingAccountUuid: targetTradingAccount.uuid,
      amount: this.state.amount,
      email: this.props.account?.email,
    }
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/internal-transfer`, data )
    .then( async res => {
      this.props.dispatch(setChecking(false));
    })
    .catch(e => {
      this.props.dispatch(setChecking(false));
      console.log(e);
    })
    
  } 
  componentDidMount() {
    
    this.props.dispatch(setChecking(true));
    
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccounts`, { params: { clientUuid: this.props.account?.accountUuid, partnerId: this.props.account?.partnerId }})
    .then( async res => {
      let temp = [];
      for (const iterator of res.data) {
        temp.push({ ...iterator, value: iterator.login, label: iterator.login })
      }
      this.setState({ tradingAccounts: temp })
      this.setState({ targetTradingAccounts: temp })
      this.props.dispatch(setChecking(false));

    })
    .catch(e => {
      this.props.dispatch(setChecking(false));
      console.log(e);
    })

  }
  render() {
  const { themeColor } = this.props;
  const { step, amount, account, targetAccount, originBalance, targetBalance, tradingAccounts, targetTradingAccounts } = this.state;
    return (
      <div className={s.root}>
         <div className="form-content">
              <h4 className={`page-title-${themeColor}`}>
                { step === 0 ? "Accounts" : (step === 1 ? "Open Live account" : "")}
              </h4>
                <Row className="mt-4">
                   <Col md={6}>
                      <div className="input-transparent mt-3"  style={{ flex: 1 }}>
                        <Label>
                          Origin Trading Account *
                        </Label>
                        <Select
                            options={tradingAccounts} 
                            className="react-select-container" 
                            classNamePrefix="react-select"
                            value={{ value: account, label: account }}
                            onChange={e => this.changeAccount(e)}
                            placeholder="Please select a origin trading account"
                            styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  borderColor: 'grey',
                                  backgroundColor: "white",
                                  opacity: .8
                                  
                                }),
                                option: (base) => ({
                                    ...base,
                                    color: 'black',
                                  }),
                            }}
                        />
                      </div>
                      <div className="input-transparent mt-3"  style={{ flex: 1 }}>
                        <Label>
                          Target Trading Account *
                        </Label>
                        <Select
                            options={targetTradingAccounts} 
                            className="react-select-container" 
                            classNamePrefix="react-select"
                            value={{ value: targetAccount, label: targetAccount }}
                            onChange={e => this.changeTargetAccount(e)}
                            styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  borderColor: 'grey',
                                  backgroundColor: "white",
                                  opacity: .8
                                  
                                }),
                                option: (base) => ({
                                    ...base,
                                    color: 'black',
                                  }),
                            }}
                        />
                      </div>
                       <div className="input-transparent mt-3" >
                          <Label>
                            Amount *
                          </Label>
                          <Input 
                              value={amount} 
                              style={{paddingLeft: "10px" }}
                              onChange={this.changeAmount} 
                              placeholder="Amount in USD"/>
                      </div>
                    </Col>
                    <Col md={4}>
                      <Label> 
                              Balances
                      </Label>
                      <div className="input-transparent mt-1"  style={{ flex: 1 }}>
                          <Label>
                              Origin Trading Account
                          </Label>
                          <div  className="mt-2">{originBalance} USD</div>
                        </div>
                      <div className="input-transparent mt-4"  style={{ flex: 1 }}>
                          <Label>
                              Target Trading Account
                          </Label>
                          <div className="mt-2">{targetBalance} USD</div>
                        </div>
                    </Col>
                </Row>
          </div>
          <div className={`s.buttonGroup mt-2`}>
              <Button className="btn-success sm " onClick={this.withdraw}>Withdraw</Button>
          </div>
      </div>
    );
  }
}
function mapStateToProps(store) {
  return {
    themeColor: store.navigation.themeColor,
    account: store.auth.account,
    tradingAccounts: store.auth.tradingAccounts,
  };
}
export default connect(mapStateToProps)(InternalTransfer);