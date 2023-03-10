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
      socialAccountInfo:{
        hasWebsite:false, 
        hasClientBase:false,
        shareTradingPerformance:false,
        promoteContent:"", 
        hasClientBase:false, 
        tradingInstruments:0, 
        tradingAccountForSocial:"", 
        incentiveFeePercentage:0
      }
    };

    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
    this.updateSocialData = this.updateSocialData.bind(this);
    this.updateSocilaDataWithTradingInstrument = this.updateSocilaDataWithTradingInstrument.bind(this)

  }


  withdraw = (e) => {
    
  }

  componentDidMount() {
    
    const { match } = this.props;
    let accounts = [];
    this.props.dispatch(setChecking(true));
    
    this.setState({ 
        step:1,
        benificiaryName: this.props.account.fullname,
    })
    
    this.props.dispatch(setChecking(true));
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/social-account-info`, 
    { params: { email: this.props.account?.email , accountUuid: this.props.account?.accountUuid}})
    .then( async res => {
        this.setState({ 
            ...this.state, 
            socialAccountInfo:{
              ...res.data.socialAccountInfo
            }
          });
        console.log(res.data.socialAccountInfo);
        this.props.dispatch(setChecking(false));
    })
    .catch(e => {
      console.log(e);
      this.props.dispatch(setChecking(false));
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
  
  updateSocialData = (data)=>{
    this.setState({
      ...this.state, 
      socialAccountInfo:{
        ...this.state.socialAccountInfo,
        ...data
      }
    })
    console.log(this.state);
  }
  updateSocilaDataWithTradingInstrument=(e, offset)=>{
    
    let offsetTrue = 0x01 << offset; 
    let offsetFalse =  0x07 ^ offsetTrue; 

    console.log(offset, offsetTrue, offsetFalse, this.state.socialAccountInfo.tradingInstruments);
    let tradingInstruments = this.state.tradingInstruments;       
    console.log(e.target.checked)
    if(e.target.checked === true){
      this.setState({
        ...this.state,
        socialAccountInfo:{
          ...this.state.socialAccountInfo, 
          tradingInstruments: this.state.socialAccountInfo.tradingInstruments | offsetTrue
        } 
      }); 
    }else {
      this.setState({
        ...this.state,
        socialAccountInfo:{
          ...this.state.socialAccountInfo, 
          tradingInstruments: this.state.socialAccountInfo.tradingInstruments & offsetFalse
        } 
      }); 
    }
  }

  submit = () =>{
    if(this.state.socialAccountInfo.sStatus){
      toast.alert("You are already in Social Trading Accounts");
      return;
    }
    console.log("Social Account Applied with ", this.state.socialAccountInfo);
    console.log("client Uuiid", this.props.account.accountUuid);
    this.props.dispatch(setChecking(true));
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/user/social-account-info`, 
    { 
      params: { 
        email: this.props.account.email, 
        accountUuid: this.props.account.accountUuid, 
        socialAccountInfo: this.state.socialAccountInfo
      }
    })
    .then(result=>{
      
      this.props.dispatch(setChecking(false));
      console.log(result);
      toast.success("Your Social Account was successfully applied"); 
      this.setState(
        {
          ...this.state, 
          socialAccountInfo: result.data
        }
      )     
    })
    .catch(e=>{
      this.props.dispatch(setChecking(false));
      if(e.response.status == 501){
        toast.warn("You are already applied for Social Trading Account"); 
        console.log("Error with social account application", e.response); 
      }else {
        toast.warn("Something is wrong with server"); 
      }
    });
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
                    <p className="form-text">
                        Social trading is a form of dealing that enables traders or investors to copy and execute the strategies of their peers or more experienced traders. While most traders perform their own fundamental and technical analysis, there is a class of traders that prefer to observe and replicate the analysis of others.
  You must fill in an application form so we can ascertain your suitability to become a Social Trading master. You will be expected to provide evidence of profitability and that you can bring clients to Exxomarkets
                    </p>
                  </Col>
                </Row>
                  <Button 
                    className={s.backgroundDark} 
                    onClick = {e=>this.next() }
                    style={{
                      color:"white",
                      background: "linear-gradient(#244985, #243b61)"
                      
                    }}
                  >
                    {this.state.socialAccountInfo.sStatus?"See your Info": "Apply for Social Trading"}
                  </Button>  
            </div>
        }
        {
          this.state.step===2 && 
          <div className="form-content">
                <h3 className={`page-title-${themeColor}`}>
                    Social Trading application form
                </h3>
                <p className="form-text">
                Please fill in the form below so we can find out a little bit more about you. We need to understand that a working relationship between us would be mutually beneficial.
                </p>
                <Form>
                  <FormGroup  className="mt-3">
                    <Label className="mb-1 form-text" for="website">Do you have a website?*</Label>
                    <div>
                    {
                      this.state.socialAccountInfo.hasWebsite? 
                      <FormGroup >
                        <Input  className= "ml-3 form-text1"  type="radio" id="website1" name="hasWebsite" onClick ={e=>this.updateSocialData({"hasWebsite":true})} checked onChange={()=>{}} /> <Label className="mr-5"> Yes </Label>
                        <Input className= "ml-3 form-text1"  type="radio" id="website2" name="hasWebsite" onClick ={e=>this.updateSocialData({"hasWebsite":false})} /><Label>No </Label> 
                      </FormGroup>
                      :
                      <FormGroup >
                        <Input className= "ml-3 form-text1" type="radio" id="website1" name="hasWebsite" onClick ={e=>this.updateSocialData({"hasWebsite":true})} /> <Label className="mr-5"> Yes </Label>
                        <Input className= "ml-3 form-text1" type="radio" id="website2" name="hasWebsite" onClick ={e=>this.updateSocialData({"hasWebsite":false})} checked onChange={()=>{}}/><Label>No </Label> 
                      </FormGroup>
                    } 
                    </div>
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label className = "mb-1 form-text" for="promoteContent">Do you share your trading performance on any social trading platform?</Label>
                    <div>
                      {
                        this.state.socialAccountInfo.shareTradingPerformance?
                          <FormGroup >
                            <Input className= "ml-3 form-text1" type="radio" id="website1" name="promoteContent" onClick ={e=>this.updateSocialData({"shareTradingPerformance":true})} checked onChange={()=>{}}/> <Label  className="" >Yes </Label>
                            <Input className= "ml-3 form-text1" type="radio" id="website2" name="promoteContent" onClick ={e=>this.updateSocialData({"shareTradingPerformance":false})} /><Label>No </Label> 
                          </FormGroup>
                        :
                          <FormGroup >
                            <Input className= "ml-3 form-text1" type="radio" id="website1" name="promoteContent" onClick ={e=>this.updateSocialData({"shareTradingPerformance":true})} /> <Label  className="mr-5" >Yes </Label>
                            <Input className= "ml-3 form-text1" type="radio" id="website2" name="promoteContent" onClick ={e=>this.updateSocialData({"shareTradingPerformance":false})} checked onChange={()=>{}} /><Label>No </Label> 
                          </FormGroup>
                      }
                    </div>
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label className="mb-1 form-text" for="website">How do you promote the services?</Label>
                    <Input className= "ml-3 form-text1"  type="textarea" name="text" id="exampleText" value = {this.state.socialAccountInfo.promoteContent} onChange = {e=>this.updateSocialData({"promoteContent":e.target.value})} />
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label className = "mb-1 form-text" for="website">Do you have your own client base?*</Label>
                    <div>
                      {
                        this.state.socialAccountInfo.hasClientBase?
                          <FormGroup >
                            <Input className= "ml-3 form-text1" type="radio" id="website1" name="hasClientBase" onClick = {e=>this.updateSocialData({"hasClientBase":true})}/> <Label  className="ml-1 form-text1" >Yes </Label>
                            <Input className= "ml-3 form-text1" type="radio" id="website2" name="hasClientBase" onClick = {e=>this.updateSocialData({"hasClientBase":false})} /><Label className="ml-1 form-text1">No </Label> 
                          </FormGroup>
                        :
                          <FormGroup >
                            <Input className= "ml-3 form-text1" type="radio" id="website1" name="hasClientBase" onClick = {e=>this.updateSocialData({"hasClientBase":true})}/>   <Label className="ml-1 form-text1">Yes </Label>
                            <Input className= "ml-3 form-text1" type="radio" id="website2" name="hasClientBase" onClick = {e=>this.updateSocialData({"hasClientBase":false})} /> <Label className="ml-1 form-text1">No </Label> 
                          </FormGroup>
                      }
                    </div>
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label className = "mb-1 form-text flex p-1" for="website">What trading instrument are you interested in?*</Label>
                    <div>
                      <Input className="mt-1 ml-3 form-text1" type="checkbox" id="tradingInstrument1"  
                          onChange = {e=>this.updateSocilaDataWithTradingInstrument(e, 0)}
                          checked = {this.state.socialAccountInfo?.tradingInstruments & 0x01 ? true: false }
                      />
                      <Label className="mt-1 form-text1" >
                        Currencies
                      </Label>
                      <Input className="mt-1 ml-3 form-text1" type="checkbox" id="tradingInstrument2" 
                        onChange = {e=>this.updateSocilaDataWithTradingInstrument(e, 1)}
                        checked = {this.state.socialAccountInfo?.tradingInstruments & 0x02 ? true:false }
                        
                      /> 
                      <Label className="mt-1 form-text1" >
                        CFD's
                      </Label>
                      <Input className="mt-1 ml-3 form-text1" type="checkbox" id="tradingInstrument3"   
                        onChange = {e=>this.updateSocilaDataWithTradingInstrument(e, 2)}
                        checked = {this.state.socialAccountInfo?.tradingInstruments & 0x04 ? true:false }
                      />
                      <Label className="mt-1 form-text1" >Precious Metal</Label>

                    </div>
                  </FormGroup> 
                  <FormGroup className="mt-3">
                    <Label className="mb-1 form-text" for="website">What trading account do you want to apply as Social Trading master?</Label>
                    <Input type="text" name="TradingAccount" id="exampleText" 
                          onChange ={e=>this.updateSocialData({tradingAccountForSocial:e.target.value})} 
                          value ={this.state.socialAccountInfo?.tradingAccountForSocial}
                    />
                  </FormGroup>
                  <FormGroup className="mt-3 form-text">
                    <Label className="mb-1" for="website">What is your incentive fee percentage?</Label>
                    <Input type="number" name="Fee" id="exampleText" 
                          onChange={e=>this.updateSocialData({incentiveFeePercentage: e.target.value})} 
                          value = {this.state.socialAccountInfo.incentiveFeePercentage}
                    />
                  </FormGroup>
                </Form>
                <FormGroup className="mt-3">
                  <Button 
                    className={s.backgroundDark}
                    disabled= {this.state.socialAccountInfo.sStatus? true :false}
                    onClick = {e=>this.submit()}
                  >
                    Submit
                  </Button>  
                  <Button 
                    className= {
                      s.backgroundDark + " ml-3"
                    }
                    disabled= {this.state.socialAccountInfo.sStatus? true :false}
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