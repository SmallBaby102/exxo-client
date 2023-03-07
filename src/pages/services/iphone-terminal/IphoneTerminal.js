/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Button, Label, Input, Table, FormGroup, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { Card, CardBody, CardTitle, CardHeader, CardImg } from "reactstrap";

import axios from "axios";
import { connect } from "react-redux";
import ReactSelect from "react-select";
import s from "./IphoneTerminal.module.scss";
import "../../../styles/custom.css"

import { withRouter } from "react-router-dom";
import { setChecking } from '../../../actions/navigation'
import { toast } from "react-toastify";

const AndroidGuideTexts = [
    "1.	In Safari browser, Go to: https://m-terminal.exxomarkets.com/" ,
    "2.	Touch to select “Share” button",
    "3.	Choose “ Add to Home Screen” , then “Add”",
    "4.	The Trading Terminal application will appear at your home screen at once."
]
const GuidTitle = "INSTALL TRADING TERMINAL ON IPHONE";
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
        <CardTitle tag="h2">
          {this.props.title}
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

class IphoneTerminal extends React.Component {
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
          <h2>{GuidTitle}</h2>
          <ImageItem title = {AndroidGuideTexts[0]} path ={[dirPath + "Iphone_1.png"]} />
          <ImageItem title = {AndroidGuideTexts[1]} path ={[dirPath + "Iphone_2.png"]} />
          <ImageItem title = {AndroidGuideTexts[2]} path ={[dirPath + "Iphone_3.png", dirPath + "Iphone_4.png"]} />
          <ImageItem title = {AndroidGuideTexts[3]} path ={[dirPath + "Iphone_5.png"]} />
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
export default withRouter(connect(mapStateToProps)(IphoneTerminal));