/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Spinner, Table, Label, Input, Button } from "reactstrap";
import { connect } from "react-redux";
import { Snackbar } from "@mui/material";
import { AiOutlineCopy } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { setAccount } from '../../actions/user';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userUuid: "",
      name: "",
      parentTradingAccountUuid: "",
      ibStatus: "New",
      inviteLink: "http://localhost:3000/register",

    };
  }

 componentDidMount() {
  const account = this.props.account;
  this.setState({ accountUuid: account?.accountUuid ,name: account?.fullname, ibStatus: account?.ibStatus, parentTradingAccountUuid: account?.parentTradingAccountUuid, inviteLink: account?.IBLink })
 }

  handleCopy = (e) => {
    this.setState({ open: true})
    navigator.clipboard.writeText(this.state.inviteLink);
  }

  requestIB( e ) {
    const data ={
      accountUuid: this.state.accountUuid,
    }
    this.setState({ loading: true});
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/request-ib`, { data })
    .then(res => {      
      if ( res.data.status === 0 ) {
        toast.warning(res.data.message);
        return; 
      }

      toast.success(res.data.message);
      this.props.dispatch(setAccount(res.data.account));
      this.setState({ ibStatus: "Pending"});
      this.setState({ loading: false});      
    })
    .catch(e => {
      toast.error(e.response.data.message);   
      this.setState({ loading: false});      
    });
  }

  cancelIB(e) {
    const data ={
      accountUuid: this.state.accountUuid,
    }
    this.setState({ loading: true});
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/cancel-ib`, { data })
    .then(res => {
      toast.success(res.data.message);
      this.props.dispatch(setAccount(res.data.account));
      this.setState({ ibStatus: "New"});
      this.setState({ loading: false});
    })
    .catch(e => {
      toast.error(e.response.data.message);
      this.setState({ loading: false});      
    });
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
                        <div className="c_ib_alert_dv">Please send IB request. Once admin approve your IB request then you will get invite link. </div>
                        <Button className="input-content btn-info" onClick={(e)=>this.requestIB()} disabled={false} >Request Become IB</Button>
                      </div>
                    )} 
                    {
                      ibStatus === "Pending" && (
                        <div>
                          <div className="c_ib_alert_dv">Your IB request is pending for admin prroviement. You can cancel the request.</div>
                          <Button className="input-content btn-danger" onClick={(e)=>this.cancelIB()} disabled={false} >Cancel IB Request</Button>
                        </div>
                    )}
                    {
                      ibStatus === "Approved" && (
                        <div>
                          <div className="c_ib_alert_dv">You are already IB user. You can invite your friends using bellow invite link.</div>
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
                          <div className="c_ib_alert_dv">Your IB request was declined. You can send IB request again.</div>
                          <div className="c_ib_decline_dv">
                            At the moment we can't agree your IB request. <br />
                            But the function will be working soon. We are doing our best. <br />
                            Thank you for your understanding.
                          </div>
                          <Button className="input-content btn-info" onClick={(e)=>this.requestIB()} disabled={false} >Request Become IB</Button>
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
