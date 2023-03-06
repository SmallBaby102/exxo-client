/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Button,CustomInput ,Label, Input, Table, FormGroup, Form, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import ReactSelect from "react-select";
import s from "./SocialRegister.module.scss";
import "../../../styles/custom.css"

import { withRouter } from "react-router-dom";
import { setChecking } from '../../../actions/navigation'
import { toast } from "react-toastify";

class SocialRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step:1, 
      hasWebsite:false, 
      promoteContent:"", 
      hasClientBase:false, 
      tradingInstruements:[], 
      tradingAccountForSocial:"", 
      incentiveFeePercentage:0
    };

    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
    this.setFormData = this.setFormData(this);
  }


  withdraw = (e) => {
    
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
         
        ],
        step:1,
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

  next = (e) =>{
    this.setState({
      ...this.state,
      step:2
    })
  }
  prev = (e) =>{
    this.setState({
      ...this.state,
      step:1
    })
  }
  
  setFormData = (data)=>{
    this.setState({
      ...this.state, 
      ...data
    })
  }
  submit = () =>{
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
      console.log(e);
    })

  }

  render() {
  const { themeColor } = this.props;
    return (
      <div className={s.root}>
      {this.state.step===1 && 
          <div className="form-content">
                <h3 className={`page-title-${themeColor}`}>
                    What is Social Trading?
                </h3>
                <Row>
                  <Col lg={12} >
                    <p >
                        Social trading is a form of dealing that enables traders or investors to copy and execute the strategies of their peers or more experienced traders. While most traders perform their own fundamental and technical analysis, there is a class of traders that prefer to observe and replicate the analysis of others.
  You must fill in an application form so we can ascertain your suitability to become a Social Trading master. You will be expected to provide evidence of profitability and that you can bring clients to Exxomarkets
                    </p>
                  </Col>
                </Row>
                  <Button 
                    color = "primary"
                    onClick = {e=>this.next() }
                  >
                    Apply for Social Trading
                  </Button>  
            </div>
        }
        {
          this.state.step===2 && 
          <div className="form-content">
                <h3 className={`page-title-${themeColor}`}>
                    Social Trading application form
                </h3>
                <p>
                Please fill in the form below so we can find out a little bit more about you. We need to understand that a working relationship between us would be mutually beneficial.
                </p>
                <Form>
                  <FormGroup  className="mt-3">
                    <Label className="mb-1" for="website">Do you have a website?*</Label>
                    <div>
                      <FormGroup inline>
                        <Input type="radio" id="website1" name="hasWebsite" onClick ={e=>this.setFormData({hasWebsite:true})} /> <Label className="mr-5"> Yes </Label>
                        <Input type="radio" id="website2" name="hasWebsite" onClick ={e=>this.setFormData({hasWebsite:false})} /><Label>No </Label> 
                      </FormGroup>
                    </div>
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label className = "mb-1" for="website">Do you share your trading performance on any social trading platform?</Label>
                    <div>
                      <FormGroup inline>
                        <Input type="radio" id="website1" name="willShare" /> <Label  className="mr-5" >Yes </Label>
                        <Input type="radio" id="website2" name="willShare" /><Label>No </Label> 
                      </FormGroup>
                    </div>
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label for="website">How do you promote the services?</Label>
                    <Input type="textarea" name="text" id="exampleText" />
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label className = "mb-1" for="website">Do you have your own client base?*</Label>
                    <div>
                      <FormGroup inline>
                        <Input type="radio" id="website1" name="hasWebsite"/> <Label  className="mr-5" >Yes </Label>
                        <Input type="radio" id="website2" name="customRadio" /><Label>No </Label> 
                      </FormGroup>
                    </div>
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label className = "mb-1" for="website">What trading instrument are you interested in?*</Label>
                    <div>
                      <CustomInput type="checkbox" id="tradingInstrument1" label="Currencies" inline />
                      <CustomInput type="checkbox" id="tradingInstrument2" label="CFD's" inline />
                      <CustomInput type="checkbox" id="tradingInstrument3" label="Precious Metals" inline />
                    </div>
                  </FormGroup> 
                  <FormGroup className="mt-3">
                    <Label className="mb-1" for="website">What trading account do you want to apply as Social Trading master?</Label>
                    <Input type="text" name="TradingAccount" id="exampleText" />
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label className="mb-1" for="website">What is your incentive fee percentage?</Label>
                    <Input type="number" name="TradingAccount" id="exampleText" />
                  </FormGroup>
                </Form>
                <FormGroup className="mt-3">
                  <Button 
                    color = "primary"
                    onClick = {e=>this.submit()}
                  >
                    Submit
                  </Button>  
                  <Button 
                    className= "ml-3"
                    color = "primary"
                    onClick = {e=>this.prev()}
                  >
                    Back
                  </Button>  
                </FormGroup>
            </div>
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
export default withRouter(connect(mapStateToProps)(SocialRegister));