/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Spinner, Table, Label, Input, Button } from "reactstrap";
import { connect } from "react-redux";
import { Snackbar } from "@mui/material";
import { AiOutlineCopy } from "react-icons/ai";
import VerifyButton from "../../components/VerifyButton";
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from "axios";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

import { toast } from "react-toastify";
import { setAccount } from "../../actions/user";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: "",
      parentTradingAccountUuid: "",
      ibStatus: "Declined",
      inviteLink: "http://localhost:3000/app",

    };
  }

 componentDidMount() {
  const account = this.props.account;
  this.setState({ name: account?.fullname })
 }

 handleCopy = (e) => {
  this.setState({ open: true})
  navigator.clipboard.writeText(this.state.address);
}
 
  render() {
  const { themeColor, verifyStatus } = this.props;
  const { name, parentTradingAccountUuid, ibStatus, inviteLink } = this.state;
    return (
      <div>        
        <div className="form-content">
            <h2 className={`page-title-${themeColor}`}>
              <strong>Become IB</strong>
            </h2>
            <Row>
                <Col lg={12}>                      
                  <div className="mt-3">
                    { ibStatus === "New" && (
                      <div>
                        <h6><i>Please send IB request. Once admin approve your IB request then you will get invite link. </i></h6>
                        <Button className="input-content btn-info" disabled={false} >Request Become IB</Button>
                      </div>
                    )} 
                    {
                      ibStatus === "Pending" && (
                        <div>
                          <h6><i>Your IB request is pending for admin prroviement. You can cancel the request.</i></h6>
                          <Button className="input-content btn-danger" disabled={false} >Cancel IB Request</Button>
                        </div>
                    )}
                    {
                      ibStatus === "Approved" && (
                        <div>
                          <h6><i>You are already IB user. You can invite your friends using bellow invite link.</i></h6>
                          <Row className="mt-2">
                              <Col md={1} className="d-flex align-items-center">
                                  <Label><strong >IB Link: </strong></Label>
                              </Col>
                              <Col md={8}>
                                  <Input disabled value={ inviteLink }></Input>
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
                        </div>
                    )}
                    {
                      ibStatus === "Declined" && (
                        <div>
                          <h6><i>Your IB request was declined. You can send IB request again.</i></h6>
                          <div className="c_ib_decline_dv">
                            At the moment we can't agree your IB request. <br />
                            But the function will be working soon. We are doing our best. <br />
                            Thank you for your understanding.
                          </div>
                          <Button className="input-content btn-info" disabled={false} >Request Become IB</Button>
                        </div>
                    )}
                  </div>
                </Col>
            </Row>
           
        </div>
      </div>
    );
  }
}
function mapStateToProps(store) {
  return {
    themeColor: store.navigation.themeColor,
    news: store.post.news,
    verifyStatus: store.auth.account?.verification_status,
    account: store.auth.account,
  };
}
export default connect(mapStateToProps)(Dashboard);
