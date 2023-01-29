/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Button, Table, Label, Badge, Input, FormGroup, InputGroup } from "reactstrap";
import axios from "axios";
import { setChecking } from '../../actions/navigation'
import { connect } from "react-redux";
import Select from "react-select";
import s from "./Accounts.module.scss";

class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0, 
      tradingAccounts: [],
      offers: [],
      offerNames: [],
      account: "",
      password: "",
      currencies: [{ value: "USD", label: "USD"}],
      currency: "USD",
      leverages: [{ value: "1:200", label: "1:200"}, { value: "1:100", label: "1:100"}, { value: "1:50", label: "1:50"}],
      leverage: "1:200"
    };
    this.setLiveAccount = this.setLiveAccount.bind(this)
    this.openLiveAccount = this.openLiveAccount.bind(this)
    this.changeAccount = this.changeAccount.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
    this.changeLeverage = this.changeLeverage.bind(this);
  }
  changeAccount(event) {
      this.setState({ account: event.value });
  }
  changePassword(event) {
      this.setState({ password: event.value });
  }
  changeCurrency(event) {
      this.setState({ currency: event.value });
  }
  changeLeverage(event) {
      this.setState({ leverage: event.value });
  }
  setLiveAccount() {
    this.setState({ step: 1 })
  }
 
  openLiveAccount() {
    const offer = this.state.offers.find(item => item.name === this.state.account);
    let data = {
      partnerId: this.props.account?.partnerId,
      offerUuid: offer?.uuid,
      clientUuid: this.props.account?.uuid
    }
    this.props.dispatch(setChecking(true));
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccount`, data )
    .then( async res => {
      this.props.dispatch(setChecking(false));
      this.setState({ step: 0 })
      this.props.dispatch(setChecking(true));
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccounts`, { params: { email: this.props.account?.email, partnerId: this.props.account?.partnerId }})
      .then( async res => {
        this.props.dispatch(setChecking(false));
        this.setState({ tradingAccounts: res.data})
        console.log(res);
      })
      .catch(e => {
        this.props.dispatch(setChecking(false));
        console.log(e);
      })
      // this.setState({ tradingAccounts: [...this.state.tradingAccounts, res.data.account] })
    
      // console.log("updated trading account", { tradingAccounts: [...this.state.tradingAccounts, res.data.account] });
    })
    .catch(e => {
      this.props.dispatch(setChecking(false));
      this.setState({ step: 0 })
      console.log(e);
    })
  } 
  componentDidMount() {
    // this.setState({ tradingAccounts: this.props.tradingAccounts})
    // this.setState({ offerNames: this.props.offerNames })
    
    this.props.dispatch(setChecking(true));
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccounts`, { params: { email: this.props.account?.email, partnerId: this.props.account?.partnerId }})
    .then( async res => {
      this.props.dispatch(setChecking(false));
      this.setState({ tradingAccounts: res.data})
      console.log(res);
    })
    .catch(e => {
      this.props.dispatch(setChecking(false));
      console.log(e);
    })
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/offers`, { params: { email: this.props.account?.email, partnerId: this.props.account?.partnerId }})
    .then( async res => {
      this.setState({ offers: res.data})
      let temp = [];
      for (const iterator of res.data) {
        temp.push({ value: iterator.name, label: iterator.name })
      }
      this.setState({ offerNames: temp })
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    })

  }
  render() {
  const { themeColor } = this.props;
  const { step, password, account, currencies, currency, leverages, leverage, offerNames } = this.state;
    return (
      <div className={s.root}>
         <div className="form-content">
              <h4 className={`page-title-${themeColor}`}>
                { step === 0 ? "Accounts" : (step === 1 ? "Open Live account" : "")}
              </h4>
              {
                step === 0 &&
                <div className={s.overFlow}>
                  <Table lg={12} md={12} sm={12} striped>
                    <thead>
                      <tr className="fs-sm">
                        <th>Id</th>
                        <th>Partner Id</th>
                        <th>Email</th>
                        <th>Currency</th>
                        <th>Balance</th>
                        <th>Equity</th>
                        <th>Free Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      { this.state.tradingAccounts?.map((row) => (
                        <tr key={row.uuid}>
                          <td>
                          { row.tradingAccountId }
                          </td>
                          <td>
                            {row.partnerId}
                          </td>
                          <td>
                            {row.accountEmail}
                          </td>
                          <td>{row.balance?.currency}</td>
                          <td>{row.balance?.balance}</td>
                          <td>{row.balance?.equity}</td>
                          <td>{row.balance?.freeMargin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              }
              {
                step === 1 &&
                <Row className="mt-4">
                   <Col md={6}>
                      <div className="input-transparent mt-3"  style={{ flex: 1 }}>
                        <Label>
                          Account *
                        </Label>
                        <Select
                            options={offerNames} 
                            className="react-select-container" 
                            classNamePrefix="react-select"
                            value={{ value: account, label: account }}
                            onChange={e => this.changeAccount(e)}
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
                          Currency *
                        </Label>
                        <Select
                            options={currencies} 
                            className="react-select-container" 
                            classNamePrefix="react-select"
                            value={{ value: currency, label: currency }}
                            onChange={e => this.changeCurrency(e)}
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
                      {/* <div className="input-transparent mt-3"  style={{ flex: 1 }}>
                        <Label>
                            Leverage *
                        </Label>
                        <Select
                            options={leverages} 
                            className="react-select-container" 
                            classNamePrefix="react-select"
                            value={{ value: leverage, label: leverage }}
                            onChange={e => this.changeLeverage(e)}
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
                      </div> */}
                      <div className="input-transparent mt-3" >
                          <Label>
                            Password *
                          </Label>
                          <Input 
                              className="input-transparent" 
                              value={password} 
                              style={{paddingLeft: "10px" }}
                              onChange={this.changePassword} 
                              type="text"
                              placeholder="Password"/>
                      </div>
                   </Col>
                </Row>
               
              }
              
          </div>
          <div className={s.buttonGroup}>
            {
              step === 0 ?
              <Button className="btn-success sm" onClick={this.setLiveAccount}>Open Live Account</Button> :
              <Button className="btn-success sm" onClick={this.openLiveAccount}>Open account</Button>

            }
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
    offerNames: store.auth.offerNames,
  };
}
export default connect(mapStateToProps)(Accounts);