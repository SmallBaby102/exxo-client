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

import { toast } from "react-toastify";
import { setAccount } from "../../actions/user";
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
      dob: "",
      expDate: null,
      name: "",
      postalCode: "",
      phone: "",
      landline_phone : "", 
      country: "",
      state: null,
      city: "",      
      address: "",

    };
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
        {
          verifyStatus === "New" ? <VerifyButton title="Please verify your profile."></VerifyButton> : verifyStatus === "Pending" ? <div className="col-md-12 text-center" style={{ color: "white", background:"#244985", padding: "5px 10px", fontSize: "1.3rem" }}>Your verification is pending now.</div> 
          : verifyStatus === "Rejected" ? <div style={{ color: "red", padding: "5px 10px", fontSize: "1.3rem" }}><VerifyButton title="Your profile has not verified. Please update your information."></VerifyButton></div>: ""
        }
        
        <div className="form-content">
            <h4 className={`page-title-${themeColor}`}>
              Personal Information
            </h4>
            <Row>
                <Col lg={6} style={{ marginLeft: "10px" }}>
                      <div className="mt-2">
                        <Label>Full name *</Label>
                        <Input className="input-content" value={name} onChange={e => this.setState({ name: e.target.value})}></Input>
                      </div>
                      <div className="mt-3">
                          <Label>Date of birth *</Label>
                          <div  className={s.mui_control} style={{background:"#f4f4f5" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                disableFuture
                                maxDate={this.subtractYears(new Date(), 18)}
                                openTo="year"
                                views={['year', 'month', 'day']}
                                value={dob}
                                onChange={(newValue) => {
                                  this.setState({ dob: newValue });
                                }}
                                renderInput={(params) => <TextField {...params}  
                                sx={{
                                  '.MuiInputBase-input': { height: "35px", padding: "0px 0 0 10px", width: "100%", },
                                }}
                              />}
                              />
                            </LocalizationProvider>
                          </div>
                        </div>
                      <div className="mt-3">
                        <Label>Postal Code</Label>
                        <Input className="input-content" type="number" value={postalCode} onChange={e => this.setState({ postalCode: e.target.value})}></Input>
                      </div>
                      <div className="mt-3">
                        <Select
                          id="country"
                          name="country"
                          label="country"
                          options={updatedCountries}
                          value={country}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              borderColor: 'grey',
                              backgroundColor: "#f4f4f5",
                              opacity: .8
                              
                            }),
                              option: (base) => ({
                                  ...base,
                                  color: 'black',
                                }),
                          }}
                          onChange={(value) => {
                            
                            this.setState({ country: value, state: null, city: null });
                          }}
                        />
                      </div>
                      <div className="mt-3">
                        <Select
                          id="state"
                          name="state"
                          options={this.updatedStates(country ? country.isoCode : null)}
                          value={state}
                          onChange={(value) => {
                            this.setState({ state: value, city: null });
                          }}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              borderColor: 'grey',
                              backgroundColor: "#f4f4f5",
                              opacity: .8
                              
                            }),
                              option: (base) => ({
                                  ...base,
                                  color: 'black',
                                }),
                          }}
                        />
                      </div>
                      <div className="mt-3">
                        <Select
                          id="city"
                          name="city"
                          options={this.updatedCities(country? country.isoCode : null, state ? state.isoCode : null)}
                          value={city}
                          onChange={(value) => {
                              this.setState({city: value })
                            }
                          }
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              borderColor: 'grey',
                              backgroundColor: "#f4f4f5",
                              opacity: .8
                              
                            }),
                              option: (base) => ({
                                  ...base,
                                  color: 'black',
                                }),
                          }}
                        />
                      </div>
                      <div className="mt-3">
                        <Label>Address</Label>
                        <Input className="input-content" value={address} onChange={e => this.setState({ address: e.target.value})}></Input>
                      </div>
                      <div className="mt-3">
                        <Label>Phone Mobile</Label>
                        <Input className="input-content" value={phone} onChange={e => this.setState({ phone: e.target.value})}></Input>
                      </div>
                      <div className="mt-3">
                        <Label>Landline phone</Label>
                        <Input className="input-content" value={landline_phone} onChange={e => this.setState({ landline_phone: e.target.value})}></Input>
                      </div>
                      <div className="mt-3">
                        { 
                          verifyStatus === "Pending" ?  <Button className="input-content btn-info" disabled={true} >Submit</Button> :
                          <Button className="input-content btn-info" onClick={() => { this.updateProfile()}}>{this.state.loading ? <Spinner size="sm" color="light"></Spinner> :"Submit"}</Button>
                        }
                        
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
