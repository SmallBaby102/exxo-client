/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Progress, Table, Label, Input, Button } from "reactstrap";
import { connect } from "react-redux";
import VerifyButton from "../../components/VerifyButton";
import s from "./Dashboard.module.scss";
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from "axios";
import { toast } from "react-toastify";
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dob: null,
      expDate: null,
      name: "",
      country: "",
      postalCode: "",
      city: "",
      address: "",
    };
  }
  updateProfile() {
    const account = this.props.account;
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/users/${account?._id}`, { data: this.state })
    .then(res => {
      toast.success("Updated your profile successfully!");
    })
    .catch(e => {
      toast.error(e.response.data.message);
      
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
  this.setState({ dob: account?.birthday,postalCode: account?.postalCode, name: account?.fullname, country: account?.country, city: account?.city, address: account?.address })
 }
  render() {
  const { themeColor, verifyStatus } = this.props;
  const { name, dob, country, city, postalCode, address } = this.state;
    return (
      <div className={s.root}>
        {
          verifyStatus === "New" ? <VerifyButton></VerifyButton> : verifyStatus === "Pending" ? <div style={{ color: "blue", padding: "5px 10px", fontSize: "1.3rem" }}>Your verification is pending now.</div> 
          : verifyStatus === "Rejected" ? <div style={{ color: "red", padding: "5px 10px", fontSize: "1.3rem" }}>Your profile has not verified. Please update your information.</div>: ""
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
                          <div  className={s.mui_control} >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                disableFuture
                                minDate={subtractYears(new Date(), 18)}
                                openTo="year"
                                views={['year', 'month', 'day']}
                                value={dob}
                                onChange={(newValue) => {
                                  this.setState({ dob: newValue });
                                }}
                                renderInput={(params) => <TextField {...params}  
                                sx={{
                                  '.MuiInputBase-input': { height: "35px", padding: "0px 0 0 10px", width: "100%" },
                                }}
                              />}
                              />
                            </LocalizationProvider>
                          </div>
                        </div>
                      <div className="mt-3">
                        <Label>Postal Code</Label>
                        <Input className="input-content" value={postalCode} onChange={e => this.setState({ postalCode: e.target.value})}></Input>
                      </div>
                      <div className="mt-3">
                        <Label>City</Label>
                        <Input className="input-content" value={city} onChange={e => this.setState({ city: e.target.value})}></Input>
                      </div>
                      <div className="mt-3">
                        <Label>Country</Label>
                        <Input className="input-content" value={country} onChange={e => this.setState({ country: e.target.value})}></Input>
                      </div>
                      <div className="mt-3">
                        <Label>Address</Label>
                        <Input className="input-content" value={address} onChange={e => this.setState({ address: e.target.value})}></Input>
                      </div>
                      <div className="mt-3">
                        <Label>Phone Mobile</Label>
                        <Input className="input-content"></Input>
                      </div>
                      <div className="mt-3">
                        <Label>Landline phone</Label>
                        <Input className="input-content"></Input>
                      </div>
                      <div className="mt-3">
                        { 
                          // verifyStatus === "Pending" ?  <Button className="input-content btn-info" disabled={true} >Submit</Button> :
                          <Button className="input-content btn-info" onClick={() => { this.updateProfile()}}>Submit</Button>
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
