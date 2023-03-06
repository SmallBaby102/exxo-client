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
    
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/social-account`, { params: { email: this.props.account?.email }})
    .then( async res => {
        this.setState({ 
            ...this.state, 
            socialAccountInfo:{
              ...res.socialAccountInfo
            }
         });
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
    console.log("Social Account Applied with ", this.state.socialAccountInfo);
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccounts`, { params: { clientUuid: this.props.account?.accountUuid, socialAccountInfo: this.state.socialAccountInfo}})
    .then(result=>{
      toast.success("Your Social Account was successfully applied");      
    })
    .catch(e=>{
      toast.success("Some Eorros Happened"); 
      console.log("Error with social account application", e); 
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
                <p className="form-text">
                Please fill in the form below so we can find out a little bit more about you. We need to understand that a working relationship between us would be mutually beneficial.
                </p>
                <Form>
                  <FormGroup  className="mt-3">
                    <Label className="mb-1 form-text" for="website">Do you have a website?*</Label>
                    <div>
                    {
                      this.state.socialAccountInfo.hasWebsite? 
                      <FormGroup inline>
                        <Input  className= "ml-3 form-text1"  type="radio" id="website1" name="hasWebsite" onClick ={e=>this.updateSocialData({"hasWebsite":true})} checked /> <Label className="mr-5"> Yes </Label>
                        <Input className= "ml-3 form-text1"  type="radio" id="website2" name="hasWebsite" onClick ={e=>this.updateSocialData({"hasWebsite":false})} /><Label>No </Label> 
                      </FormGroup>
                      :
                      <FormGroup inline>
                        <Input className= "ml-3 form-text1" type="radio" id="website1" name="hasWebsite" onClick ={e=>this.updateSocialData({"hasWebsite":true})} /> <Label className="mr-5"> Yes </Label>
                        <Input className= "ml-3 form-text1" type="radio" id="website2" name="hasWebsite" onClick ={e=>this.updateSocialData({"hasWebsite":false})} checked/><Label>No </Label> 
                      </FormGroup>
                    } 
                    </div>
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label className = "mb-1 form-text" for="promoteContent">Do you share your trading performance on any social trading platform?</Label>
                    <div>
                      {
                        this.state.socialAccountInfo.shareTradingPerformance?
                          <FormGroup inline>
                            <Input className= "ml-3 form-text1" type="radio" id="website1" name="promoteContent" onClick ={e=>this.updateSocialData({"shareTradingPerformance":true})} checked/> <Label  className="" >Yes </Label>
                            <Input className= "ml-3 form-text1" type="radio" id="website2" name="promoteContent" onClick ={e=>this.updateSocialData({"shareTradingPerformance":false})} /><Label>No </Label> 
                          </FormGroup>
                        :
                          <FormGroup inline>
                            <Input className= "ml-3 form-text1" type="radio" id="website1" name="promoteContent" onClick ={e=>this.updateSocialData({"shareTradingPerformance":true})} /> <Label  className="mr-5" >Yes </Label>
                            <Input className= "ml-3 form-text1" type="radio" id="website2" name="promoteContent" onClick ={e=>this.updateSocialData({"shareTradingPerformance":false})} checked /><Label>No </Label> 
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
                          <FormGroup inline>
                            <Input className= "ml-3 form-text1" type="radio" id="website1" name="hasClientBase" onClick = {e=>this.updateSocialData({"hasClientBase":true})}/> <Label  className="ml-1 form-text1" >Yes </Label>
                            <Input className= "ml-3 form-text1" type="radio" id="website2" name="hasClientBase" onClick = {e=>this.updateSocialData({"hasClientBase":false})} /><Label className="ml-1 form-text1">No </Label> 
                          </FormGroup>
                        :
                          <FormGroup inline>
                            <Input className= "ml-3 form-text1" type="radio" id="website1" name="hasClientBase" onClick = {e=>this.updateSocialData({"hasClientBase":true})}/>   <Label className="ml-1 form-text1">Yes </Label>
                            <Input className= "ml-3 form-text1" type="radio" id="website2" name="hasClientBase" onClick = {e=>this.updateSocialData({"hasClientBase":false})} /> <Label className="ml-1 form-text1">No </Label> 
                          </FormGroup>
                      }
                    </div>
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label className = "mb-1 form-text flex p-1" for="website">What trading instrument are you interested in?*</Label>
                    <div>
                      <Input className="mt-1 ml-3 form-text1" type="checkbox" id="tradingInstrument1" inline 
                          onChange = {e=>this.updateSocilaDataWithTradingInstrument(e, 0)}
                          checked= {this.state.socialAccountInfo.tradingInstruments & 0x01 ? true: false }
                      />
                      <Label className="mt-1 form-text1" inline>
                        Currencies
                      </Label>
                      <Input className="mt-1 ml-3 form-text1" type="checkbox" id="tradingInstrument2" 
                        onChange = {e=>this.updateSocilaDataWithTradingInstrument(e, 1)}
                        checked= {this.state.socialAccountInfo.tradingInstruments & 0x02 ? true:false }
                        inline
                      /> 
                      <Label className="mt-1 form-text1" inline>
                        CFD's
                      </Label>
                      <Input className="mt-1 ml-3 form-text1" type="checkbox" id="tradingInstrument3"  inline 
                        onChange = {e=>this.updateSocilaDataWithTradingInstrument(e, 2)}
                        checked= {this.state.socialAccountInfo.tradingInstruments & 0x04 ? true:false }
                      />
                      <Label className="mt-1 form-text1" inline>Precious Metal</Label>

                    </div>
                  </FormGroup> 
                  <FormGroup className="mt-3">
                    <Label className="mb-1 form-text" for="website">What trading account do you want to apply as Social Trading master?</Label>
                    <Input type="text" name="TradingAccount" id="exampleText" onChange ={e=>this.updateSocialData({tradingAccountForSocial:e.targe.value})} />
                  </FormGroup>
                  <FormGroup className="mt-3 form-text">
                    <Label className="mb-1" for="website">What is your incentive fee percentage?</Label>
                    <Input type="number" name="TradingAccount" id="exampleText" onChange={e=>this.updateSocialData({incentiveFeePercentage: e.target.value})} />
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