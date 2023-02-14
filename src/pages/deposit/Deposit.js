/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Progress, Table, Label, Input } from "reactstrap";
import axios from "axios";
import xml2js from "xml2js";
import { connect } from "react-redux";
import VerifyButton from "../../components/VerifyButton";

import s from "./Deposit.module.scss";
import { Link } from "react-router-dom";

class Deposit extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  const { themeColor, verifyStatus } = this.props;

    return (
      <div className={s.root}>
         <div className="form-content">
         {
            verifyStatus === "New" ? 
              <div>
                <VerifyButton title="Please verify your profile."></VerifyButton>
                <p className="mt-2">You can't fund your account right now your user profile hasn't been verified yet. Please click here to get verified now.</p>
              </div>
              : verifyStatus === "Pending" ?  <div className="col-md-12 text-center" style={{ color: "white", background:"blue", padding: "5px 10px", fontSize: "1.3rem" }}>Your verification is pending now.</div> 
              : verifyStatus === "Rejected" ? <VerifyButton title="Your profile has not verified. Please update your information."></VerifyButton>
              :
              <fieldset className="payment-buttons payment-buttons-crypto">
                <legend className={s.legend}>Methods for deposit</legend>
                <Row>
                    <div className={s.payment_block}>
                      <Link to="/app/deposit_detail/tether"  className={s.payment_option +" " + s.payment_option_tether}>
                      </Link>
                    </div>
                    <div className={s.payment_block}>
                      <Link to="/app/deposit_detail/stacoinex"  className={s.payment_option +" " + s.payment_option_stacoinex}>
                      </Link>
                    </div>
                    <div className={s.payment_block}>
                      <Link to="/app/deposit_detail/bank"  className={s.payment_option +" " + s.payment_option_bank}>
                      </Link>
                    </div>
                    <div className={s.payment_block}>
                      <Link to="/app/deposit_detail/payop"  className={s.payment_option +" " + s.payment_option_payop}>
                      </Link>
                    </div>
                    <div className={s.payment_block}>
                      <Link to="/app/deposit_detail/neteller"  className={s.payment_option +" " + s.payment_option_neteller}>
                      </Link>
                    </div>
                    <div className={s.payment_block}>
                      <Link to="/app/deposit_detail/skrill"  className={s.payment_option +" " + s.payment_option_skrill}>
                      </Link>
                    </div>
                    <div className={s.payment_block}>
                      <Link to="/app/deposit_detail/sticpay"  className={s.payment_option +" " + s.payment_option_sticpay}>
                      </Link>
                    </div>
                    <div className={s.payment_block}>
                      <Link to="/app/deposit_detail/xrp_ripple"  className={s.payment_option +" " + s.payment_option_xrp_ripple}>
                      </Link>
                    </div>
                
                </Row>
                <div className="payment-buttons-crypto-text col-lg-4 col-md-12">
                  <ul className="collapse" id="deposit-crypto-list">
                        <li>
                        No conversion fee if the crypto funds are deposited directly into a fiat account (USD, EUR etc).    </li>
                      <li>
                      Bonus can be withdrawn as real funds once you’ve traded*.  </li>
                    <li>
                      Secure and anonymous transactions on the blockchain.  </li>
                  </ul>
                </div>
              </fieldset>
          }
            
          </div>
      </div>
    );
  }
}
function mapStateToProps(store) {
  return {
    themeColor: store.navigation.themeColor,
    verifyStatus: store.auth.account?.verification_status
  };
}
export default connect(mapStateToProps)(Deposit);