/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Button, Table, Label } from "reactstrap";
import axios from "axios";
import { setChecking } from '../../actions/navigation'
import { connect } from "react-redux";
import Select from "react-select";
import s from "./Accounts.module.scss";
import { toast } from "react-toastify";

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
      leverage: "1:200",
      accountTitle: "Open Live Account",
    };
    this.setLiveAccount = this.setLiveAccount.bind(this)
    this.setDemoAccount = this.setDemoAccount.bind(this)
    this.openLiveAccount = this.openLiveAccount.bind(this)
    this.changeAccount = this.changeAccount.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
    this.changeLeverage = this.changeLeverage.bind(this);
    this.setInternalTransfer = this.setInternalTransfer.bind(this);
    this.accountDetail = this.accountDetail.bind(this);
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
    let temp = [];
    for (const iterator of this.state.offers) {
      if ( iterator.demo ) continue;
      if ( iterator.name === "Exxo IB" ) continue;
      temp.push({ value: iterator.name, label: iterator.name, demo: iterator.demo })
    }
    this.setState({ offerNames: temp });
    this.setState({ step: 1 });
    this.setState( { accountTitle: "Open Live Account"} );
  }
 
  setDemoAccount() {
    let temp = [];
    for (const iterator of this.state.offers) {
      if(!iterator.demo) continue;
      temp.push({ value: iterator.name, label: iterator.name, demo: iterator.demo })
    }
    this.setState({ offerNames: temp });
    this.setState({ step: 1 });
    this.setState( { accountTitle: "Open Demo Account"} );
  }
  setInternalTransfer() {
    this.props.history.push("/app/internal-transfer");
  }
  accountDetail(id) {
    const tradingAccount = this.state.tradingAccounts.find(item => item.login === id);
    const offer = this.state.offers.find(item => item.uuid === tradingAccount?.offerUuid);
    const systemUuid = offer?.system?.uuid;
    const tradingAccountUuid = tradingAccount.uuid;
    this.props.history.push(`/app/account-detail/${id}/${systemUuid}/${tradingAccountUuid}`);
  }
  
  openLiveAccount() {
    if(!this.state.account) {
      toast.warning("Please select an account!");
      return;
    }
    const offer = this.state.offers.find(item => item.name === this.state.account);
    let data = {
      partnerId: this.props.account?.partnerId,
      offerUuid: offer?.uuid,
      clientUuid: this.props.account?.accountUuid
    }
    this.props.dispatch(setChecking(true));

    axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccount`, data )
    .then( async res => {
      this.props.dispatch(setChecking(false));
      this.setState({ step: 0 })
      this.props.dispatch(setChecking(true));
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccounts`, { params: { clientUuid: this.props.account?.accountUuid, partnerId: this.props.account?.partnerId }})
      .then( async res => {
        // this.setState({ tradingAccounts: res.data})
        // console.log(res);
        // this.props.history.push("/app/accounts");
        let tempAcc = res.data?.map(item => {
          const offer = this.state.offers?.find(offer => offer.uuid === item.offerUuid);
          return { ...item, partnerId: offer?.partnerId, offerName: offer?.name};
        })
        this.setState({ tradingAccounts: tempAcc})
        this.props.dispatch(setChecking(false));
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
    // if(this.props.account?.verification_status !== "Approved")
    // {
    //   this.props.history.push(`/app/profile/verify`);
    //   return;
    // }
    this.props.dispatch(setChecking(true));
    const temp =  JSON.parse(localStorage.getItem("account"));
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/offers`, { params: { email: temp?.email, partnerId: temp?.partnerId }})
    .then( async res => {
      this.setState({ offers: res.data})
    
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccounts`, { params: { clientUuid: temp?.accountUuid, partnerId: temp?.partnerId }})
      .then( async result => {
        this.props.dispatch(setChecking(false));
        let tempAcc = result.data?.map(item => {
          const offer = res.data?.find(offer => offer.uuid === item.offerUuid);
          return { ...item, partnerId: offer?.partnerId, offerName: offer?.name};
        })
        this.setState({ tradingAccounts: tempAcc})
      }) 
      .catch(e => {
        this.props.dispatch(setChecking(false));
        console.log(e);
      })
    })
    .catch(e => {
      console.log(e);
    })
  }

  render() {
  const { themeColor } = this.props;
  const { step, password, account, currencies, currency, offerNames, accountTitle } = this.state;
    return (
      <div className={s.root}>
         <div className="form-content">
              <h4 className={`page-title-${themeColor}`}>
                { step === 0 ? "Accounts" : (step === 1 ? accountTitle : "")}
              </h4>
              {
                step === 0 &&
                <div className={s.overFlow}>
                  <label>Please doube click a row to see an account detail</label>
                  <Table lg={12} md={12} sm={12} striped>
                    <thead>
                      <tr className="fs-sm">
                        <th className="hover-overlay hover-zoom hover-shadow ripple">Id</th>
                        <th>Account Type</th>
                        <th>Currency</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      { this.state.tradingAccounts?.map((row) => (
                        <tr className="c_accounts_tr" key={row.uuid} onDoubleClick={(e) => this.accountDetail(row.login)} >
                          <td >
                          { row.login }
                          </td>
                          <td>{ row.offerName }</td>
                          <td>{row.currency}</td>
                          <td>{row.balance}</td>
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
                   </Col>
                </Row>
               
              }
              
          </div>
          <div className={s.buttonGroup}>
            {
              step === 0 ?
              <div>
                <Button className="btn-success sm col-md-3" onClick={this.setLiveAccount}>Open Live Account</Button>
                <Button className="btn-info sm  ml-1 col-md-3" onClick={this.setDemoAccount}>Open Demo Account</Button>
                <Button className="btn-warning sm col-md-3" onClick={this.setInternalTransfer}>Internal Transfer</Button>
                <a href = "https://terminal.exxomarkets.com/web" target="_blank">
                  <Button 
                      style={{
                        backgroundColor:"#191f2c"
                      }}
                      className="sm col-md-3" 
                  >
                      Go To Terminal 
                  </Button>
                </a>
              </div>
              :
              <Button className="btn-success sm col-md-3" onClick={this.openLiveAccount}>Open account</Button>

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