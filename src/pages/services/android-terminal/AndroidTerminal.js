/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Button, Label, Input, Table, FormGroup, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { Card, CardBody, CardTitle, CardHeader, CardImg } from "reactstrap";

import axios from "axios";
import { connect } from "react-redux";
import ReactSelect from "react-select";
import s from "./AndroidTerminal.module.scss";
import "../../../styles/custom.css"

import { withRouter } from "react-router-dom";
import { setChecking } from '../../../actions/navigation'
import { toast } from "react-toastify";

const AndroidGuideTexts = [
  "1. In Chrome browser, Go to:", 
  "2. Touch to select “setting” button",
  "3. Choose “Install app” or “Add to home screen” , then “Install” or “Add”",
  "4. The Trading Terminal application will appear at your home screen at once."
]
const GuidTitle = "INSTALL TRADING TERMINAL ON ANDROID MOBILE PHONE";
const dirPath = "../../assets/phone_guide/"; 
const variant = "White";
class ImageItem extends React.Component {

  constructor(props){
    super(props);
  }
  render(){
    return (
    <div className="imageItem">
      <Card 
        style={{
          padding : '3rem',
          background: 'white'
        }}
      >
        <CardTitle tag="h3">
          {this.props.title}
          {this.props.children}
        </CardTitle>
        <CardBody 
        
          style = {{
            margin:"auto"
          }}
        >
          {this.props.path.map((_path)=>
            <CardImg 
              variant="top" 
              src={_path} 
              style={{
                maxWidth : "20rem",
                padding:'1rem'
              }}
            />
          )}
        </CardBody>
      </Card>
    </div> 
    )
  }
}

class AndroidTerminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    };

  }
  componentDidMount() {
    const { match } = this.props;
    let accounts = [];
    // this.props.dispatch(setChecking(true));
    this.setState({ 
        methods: [
         
        ],
        benificiaryName: this.props.account.fullname,
    })
   
  }
  render() {
    const { themeColor } = this.props;
    return (
      <div className={s.root}>
          <h3>{GuidTitle}</h3>
          <ImageItem title = {AndroidGuideTexts[0]} path ={[dirPath + "Android_1.png"]} >
              <a href='https://m-terminal.exxomarkets.com/'>https://m-terminal.exxomarkets.com/</a>
          </ImageItem>
          <ImageItem title = {AndroidGuideTexts[1]} path ={[dirPath + "Android_2.png"]} />
          <ImageItem title = {AndroidGuideTexts[2]} path ={[dirPath + "Android_3.png", dirPath + "Android_4.png"]} />
          <ImageItem title = {AndroidGuideTexts[3]} path ={[dirPath + "Android_5.png"]} />
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
export default withRouter(connect(mapStateToProps)(AndroidTerminal));