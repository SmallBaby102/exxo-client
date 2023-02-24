/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Spinner, Table, Label, Input, Button } from "reactstrap";
import { connect } from "react-redux";
import VerifyButton from "../../components/VerifyButton";
import s from "./Dashboard.module.scss";
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from "axios";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { AiOutlineCopy } from "react-icons/ai";
import { Snackbar } from "@mui/material";
import { toast } from "react-toastify";
import { setAccount } from "../../actions/user";
import { Link } from "react-router-dom";
import { width } from "@mui/system";
const countries = Country.getAllCountries();

const updatedCountries = countries.map((country) => ({
  label: country.name,
  value: country.isoCode,
  ...country
}));

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      address: "",

    };
    this.handleCopy = this.handleCopy.bind(this);

  }
  updatedStates = (countryId) =>
    State
      .getStatesOfCountry(countryId)
      .map((state) => ({ ...state, label: state.name, value: state.isoCode }));
  updatedCities = (countryId, stateId) =>
    City
      .getCitiesOfState(countryId, stateId)
      .map((city) => ({ ...city, label: city.name, value: city.name,  }));

  updateProfile() {
    const account = this.props.account;
    const data ={
      ...this.state,
      country: this.state.country?.name,
      state: this.state.state?.name,
      city: this.state.city?.name,
    }
    this.setState({ loading: true});
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/users/${account?._id}`, { data })
    .then(res => {
      toast.success("Updated your profile successfully!");
      localStorage.setItem("account", JSON.stringify({...account, ...res.data}));
      this.props.dispatch(setAccount({...account, ...res.data}));
      this.setState({ loading: false});
    })
    .catch(e => {
      toast.error(e.response.data.message);
      this.setState({ loading: false});      
    })
  }
  
  subtractYears(date, years) {
    // 👇 make copy with "Date" constructor
    const dateCopy = new Date(date);
  
    dateCopy.setFullYear(date.getFullYear() - years);
  
    return dateCopy;
  }
  handleCopy = (e) => {
    this.setState({ open: true})
    navigator.clipboard.writeText(this.state.address);
  }
 componentDidMount() {
  const account = this.props.account;
  this.setState({ postalCode: account?.postalCode, name: account?.fullname, address: account?.address, phone: account?.phone, landline_phone: account?.landline_phone })
  const country = countries.find(item => item.name === account?.country);
  const state = this.updatedStates(country?.isoCode).find(item => item.name === account?.state);
  const city = this.updatedCities(country?.isoCode, state?.isoCode).find(item => item.name === account?.city);
  this.setState({ country: { ...country, label: country?.name,  value: country?.isoCode},  state: { ...state , label: state?.name,  value: state?.isoCode}, city: { ...city, label: city?.name, value: city?.name} })
  if(account?.birthday){
    this.setState({ dob: account?.birthday })
  }
 }
 
  render() {
  const { themeColor, verifyStatus } = this.props;
  const { name, dob, country, state, city, postalCode, address, phone, landline_phone } = this.state;
    return (
      <div className={s.root}>
          <div className={s.refer_banner}>
              <div className={s.refe_earn_banner}>

                <h1 className="mt-2">Earn up to $250 per referral</h1>
                <h3 style={{ maxWidth: "380px"}}>Each referral will receive a one-time 15% Deposit Bonus</h3>
                <Row className="mt-4">
                    <Col md={5}>
                        <Input style={{ background: "pink"}} disabled value={ address }></Input>
                    </Col>
                    <Col md={2}>
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
          </div>
          <div className="mt-2">
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
              <div className="copy_link_block">
                <div className="share-block">
                    <p className="share-block-title">Share your referral link:</p>
                    <div className="refer-and-earn-program-container">
                      <div className="refer-and-earn-program-row">
                        <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=my.myfxchoice.com%2Fregistration%2F%3Frefer%3D614772"><span className="share-button fa facebook"></span></a>  <a target="_blank" href="https://twitter.com/intent/tweet?url=my.myfxchoice.com%2Fregistration%2F%3Frefer%3D614772&amp;text=Open+a+live+account+with+%40FXChoicesocial+and+receive+a+15%25+welcome+bonus%21"><span className="share-button fa twitter"></span></a>  
                        <a target="_blank" href="https://api.whatsapp.com/send?phone=&amp;text=Open+a+live+account+with+FXChoice+and+receive+a+15%25+welcome+bonus%21+Use+this+link+my.myfxchoice.com%2Fregistration%2F%3Frefer%3D614772"><span className="share-button fa whatsapp"></span></a><a target="_blank" href="https://telegram.me/share/url?url=my.myfxchoice.com%2Fregistration%2F%3Frefer%3D614772&amp;text=Open+a+live+account+with+FXChoice+and+receive+a+15%25+welcome+bonus%21"><span className="share-button fa telegram"></span></a><a href="mailto:?body=Open a live account with FXChoice and receive a 15% welcome bonus!%0D%0Ahttps://my.myfxchoice.com/registration/?refer=614772"><span className="share-button fa email"></span></a><a href="#"><span data-title="Open a live account with FXChoice and receive a 15% welcome bonus!" data-text="Open a live account with FXChoice and receive a 15% welcome bonus!" data-url="https://my.myfxchoice.com/registration/?refer=614772" className="share-button fa share"></span></a>    </div>
                      <div className="refer-and-earn-program-row">
                        <Row className="mt-4">
                          <Col md={8}>
                              <Input  disabled value={ address }></Input>
                          </Col>
                          <Col md={2}>
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
                    </div>
                </div>  
              </div>
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
                <Link to="/refer/list"  className="btn btn-xlg btn-info">
                    Your Referral List
                </Link>
              </p>
              <div className="row friend_contact_us">
                <h3 className="mt-3">
                  Still have some questions?      <a target="_blank" href="https://www.livehelpnow.net/lhn/TicketsVisitor.aspx?lhnid=6766">Contact us</a> now.    </h3>
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
