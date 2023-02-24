/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Spinner, Table, Label, Input, Button } from "reactstrap";
import { connect } from "react-redux";
import { Snackbar } from "@mui/material";
import { AiOutlineCopy } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { setAccount } from '../../actions/user';
import s from "./Dashboard.module.scss";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userUuid: "",
      name: "",
      parentTradingAccountUuid: "",
      ibStatus: "New",
      IBDeclineReason: "", 
      inviteLink: "http://localhost:3000/register",

    };
  }

 componentDidMount() {
  const account = this.props.account;
  this.setState({ accountUuid: account?.accountUuid ,name: account?.fullname, ibStatus: account?.ibStatus, parentTradingAccountUuid: account?.parentTradingAccountUuid, inviteLink: account?.IBLink , IBDeclineReason: account?.IBDeclineReason})
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

      localStorage.setItem("account", JSON.stringify(res.data.account));
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

      localStorage.setItem("account", JSON.stringify(res.data.account));
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
  const { name, parentTradingAccountUuid, ibStatus, inviteLink, IBDeclineReason } = this.state;
    return (
      <div>  
        <div className={s.refer_banner}>
          <div className={s.refe_earn_banner}>
            <h1 className="mt-2">Earn up to $250 per referral</h1>
            <h3 style={{ maxWidth: "380px"}}>Each referral will receive a one-time 15% Deposit Bonus</h3>
            <Row>
              <Col lg={12}>                      
              <div className="mt-3">
                { ibStatus === "New" && (
                  <div>
                    <div className="c_ib_alert_dv">Please send IB request. Once admin approve your IB request then you will get invite link. </div> <br />
                    <Button className="input-content btn-info" onClick={(e)=>this.requestIB()} disabled={false} >Request Become IB</Button>
                  </div>
                )} 
                {
                  ibStatus === "Pending" && (
                    <div>
                      <div className="c_ib_alert_dv">Your IB request is pending for admin prroviement. You can cancel the request.</div> <br />
                      <Button className="input-content btn-danger" onClick={(e)=>this.cancelIB()} disabled={false} >Cancel IB Request</Button>
                    </div>
                )}
                {
                  ibStatus === "Approved" && (
                    <div>
                      <div className="c_ib_alert_dv">You are already IB user. You can invite your friends using bellow invite link.</div>
                      <Row className="mt-2 c_ib_link_row">
                          <Col md={8} className={s.c_padd_right_0}>
                              <Input disabled value={ inviteLink }></Input>
                          </Col>
                          <Col md={1} className={s.c_padd_left_0}>
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
                      <div className="c_ib_decline_dv">{ IBDeclineReason }</div>
                      <Button className="input-content btn-info" onClick={(e)=>this.requestIB()} disabled={false} >Request Become IB</Button>
                    </div>
                )}
              </div>
            </Col>
            </Row>
          </div>
        </div> 
        <div className={`mt-2 ${s.c_ib_cnt_dv}`}>
          <h3>How it works:</h3>
          <div className="friend-list-how-container">
            <ol className="friend-list-how">
              <li>
                <p className="list-how-item-title">
                  Share your referral link      </p>
                <p className="list-how-item-text">
                  Copy the link above and share it with your friends and followers.      </p>
              </li>
              <li>
                <p className="list-how-item-title">
                  Sit tight      </p>
                <p className="list-how-item-text">
                  Wait for your clients to deposit; check their status in <a href="/refer/list">Your Referral List</a>.      </p>
              </li>
              <li>
                <p className="list-how-item-title">
                  Earn up to USD 250      </p>
                <p className="list-how-item-text">
                  You’ll get USD 25 for every USD 100 deposited.      </p>
              </li>
            </ol>
          </div>
          <h3 className="mt-3">Why refer someone to us?</h3>
          <ol className="friend-list-why mt-3">
            <li>
              <p className="friend-why-item-header">
                <img src="/images/why/coins.svg" alt="Refer a friend"/>    
              </p>
              <div className="friend-why-text-block">
                <p className="friend-why-item-title">
                  Financial motivation      </p>
                <p className="friend-why-item-text">
                  Potentially, you can earn up to USD 250 for every client you refer to us.      </p>
              </div>
            </li>

            <li>
              <p className="friend-why-item-header">
                <img src="/images/why/easy.svg" alt="Refer a friend"/>    </p>
              <div className="friend-why-text-block">
                <p className="friend-why-item-title">
                  Simplicity      </p>
                <p className="friend-why-item-text">
                  It is super simple to join our Refer and Earn programme. Just send our link and wait for them to open and fund their live accounts.      </p>
              </div>
            </li>

            <li>
              <p className="friend-why-item-header">
                <img src="/images/why/prize.svg" alt="Refer a friend"/>    </p>
              <div className="friend-why-text-block">
                <p className="friend-why-item-title">
                  Reputation      </p>
                <p className="friend-why-item-text">
                  We have put a lot of time and effort into building our reputation. You can be sure that none of your referrals will regret their decision to join us.      </p>
              </div>
            </li>

            <li>
              <p className="friend-why-item-header">
                <img src="/images/why/gift.svg" alt="Refer a friend"/>    </p>
              <div className="friend-why-text-block">
                <p className="friend-why-item-title">
                  Bonus      </p>
                <p className="friend-why-item-text">
                  Each referral will receive a one-time <strong>15% Deposit Bonus.</strong>        General <a target="_blank" href="https://en.myfxchoice.com/files/FXChoice_Bonus_Terms_EN.pdf">terms and conditions</a> of the bonus program apply.      </p>
              </div>
            </li>
          </ol>
          <Row>
            <Col lg={12}>                      
            <div className={`mt-3 ${s.c_ib_m_core_dv}`}>
              { ibStatus === "New" && (
                <div>
                  <div className="c_ib_alert_dv">Please send IB request. Once admin approve your IB request then you will get invite link. </div> <br />
                  <Button className="input-content btn-info" onClick={(e)=>this.requestIB()} disabled={false} >Request Become IB</Button>
                </div>
              )} 
              {
                ibStatus === "Pending" && (
                  <div>
                    <div className="c_ib_alert_dv">Your IB request is pending for admin prroviement. You can cancel the request.</div> <br />
                    <Button className="input-content btn-danger" onClick={(e)=>this.cancelIB()} disabled={false} >Cancel IB Request</Button>
                  </div>
              )}
              {
                ibStatus === "Approved" && (
                  <div>
                    <div className="c_ib_alert_dv">You are already IB user. You can invite your friends using bellow invite link.</div> <br />
                    <Row className="mt-2 c_ib_link_row">
                        <Col md={11} className={s.c_padd_right_0}>
                            <Input disabled value={ inviteLink }></Input>                            
                        </Col>
                        <Col md={1} className={s.c_padd_left_0}>
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
                    <div className="c_ib_alert_dv">Your IB request was declined. You can send IB request again.</div> <br />
                    <div className="c_ib_decline_dv">{ IBDeclineReason }</div>
                    <Button className="input-content btn-info" onClick={(e)=>this.requestIB()} disabled={false} >Request Become IB</Button>
                  </div>
              )}
            </div>
          </Col>
          </Row>
          <h3 className="mt-3">What will you earn?</h3>
          <div className="row what_will_earn_block">
            <div className="col-md-2 col-sm-4 col-xs-4 what_will_earn_img">
              <img src="/images/money.svg" alt="Refer a friend"/>  </div>

            <div className="col-md-10 col-sm-8 col-xs-8 what_will_earn_desc">
              <p>
                <span className="what_will_earn_tx1">
                  You can earn USD 25 for each USD 100 deposited by the referred clients once they reach the required volume of USD 200,000 turnover (1 full lot).      </span>
                <br/>
                The maximum reward for one referred client is USD 250, once they reach the required volume of USD 2,000,000 (10 full lots).    </p>
              <p className="what_will_earn_tx2">
                <span className="what_will_earn_imp1">Important:</span>
                The reward is applicable to first deposits made by new clients only, and the minimum deposit is USD 100 or equivalent in another currency.    </p>
            </div>
          </div>
          <p className="text-center mt-3">
            <Link to="/app/ib-clients"  className="btn btn-xlg btn-info">
                Your Referral List
            </Link>
          </p>
          <div className="row friend_contact_us">
            <h3 className="mt-3">
              Still have some questions?      <a target="_blank" href="#">Contact us</a> now.    </h3>
          </div>
          <hr/>
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
