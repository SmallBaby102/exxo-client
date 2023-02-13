/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Progress, Table, Label, Input, Button } from "reactstrap";
import { connect } from "react-redux";
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';
import s from "./Dashboard.module.scss";
import moment from "moment";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import DriverL1 from "../../assets/verify/driving_license/driving-license-ex-01.png";
import DriverL2 from "../../assets/verify/driving_license/driving-license-ex-02.png";
import DriverL3 from "../../assets/verify/driving_license/driving-license-ex-03.png";
import DriverL4 from "../../assets/verify/driving_license/driving-license-ex-04.png";
import IdCard1 from "../../assets/verify/id_card/identity-card-ex-01.png";
import IdCard2 from "../../assets/verify/id_card/identity-card-ex-02.png";
import IdCard3 from "../../assets/verify/id_card/identity-card-ex-03.png";
import IdCard4 from "../../assets/verify/id_card/identity-card-ex-04.png";
import Passport1 from "../../assets/verify/passport/passport-ex-01.png";
import Passport2 from "../../assets/verify/passport/passport-ex-02.png";
import Passport3 from "../../assets/verify/passport/passport-ex-03.png";
import Passport4 from "../../assets/verify/passport/passport-ex-04.png";
import Resident1 from "../../assets/verify/resident/residency-card-ex-01.png";
import Resident2 from "../../assets/verify/resident/residency-card-ex-02.png";
import Resident3 from "../../assets/verify/resident/residency-card-ex-03.png";
import Resident4 from "../../assets/verify/resident/residency-card-ex-04.png";
import DriverFrontImgSample from "../../assets/verify/sample/driving_license/driving-lisence-front.png";
import DriverBackImgSample from "../../assets/verify/sample//driving_license/driving-lisence-back.png";
import IdCardFrontImgSample from "../../assets/verify/sample/id_card/identity-card-front.png";
import IdCardBackImgSample from "../../assets/verify/sample//id_card/identity-card-back.png";
import PassportImgSample from "../../assets/verify/sample/passport/passport.png";
import ResidentFrontImgSample from "../../assets/verify/sample/resident/residency-card-front.png";
import ResidentBackImgSample from "../../assets/verify/sample//resident/residency-card-back.png";
import { IconButton } from "@mui/material";
import { setVerifyStatus } from "../../actions/user";
import axios from "axios";
import { toast } from "react-toastify";
const steps = [
  'Identity',
  'Address',
  'Confirmation',
];

class Dashboard extends React.Component {
  static propTypes = {
      dispatch: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      step : 0,
      docType : "driver_license",   // passport, driver_license, id_card,  resident
      img1: DriverL1,
      img2: DriverL2,
      img3: DriverL3,
      img4: DriverL4,
      frontImg: DriverFrontImgSample,
      backImg:  DriverBackImgSample,
      frontFile: null,
      backFile: null,
      dob: null,
      expDate: null,
      name: "",
      country: "",
      postalCode: "",
      city: "",
      address: "",
      frontImgSelected: false,
      backImgSelected: false,
      check1: false,
      check2: false
    };
  }
  setDocType = type => {
    this.setState({ docType: type });
    if(type === "driver_license"){
      this.setState({ 
        img1: DriverL1,  
        img2: DriverL2,
        img3: DriverL3,
        img4: DriverL4, 
        frontImg: DriverFrontImgSample,
        backImg:  DriverBackImgSample,
      });
    }
    if(type === "id_card"){
      this.setState({ 
        img1: IdCard1,  
        img2: IdCard2,
        img3: IdCard3,
        img4: IdCard4, 
        frontImg: IdCardFrontImgSample,
        backImg:  IdCardBackImgSample,
      });
    }
    if(type === "passport"){
      this.setState({ 
        img1: Passport1,  
        img2: Passport2,
        img3: Passport3,
        img4: Passport4, 
        frontImg: PassportImgSample,
        backImg:  null,
      });
    }
    if(type === "resident"){
      this.setState({ 
        img1: Resident1,  
        img2: Resident2,
        img3: Resident3,
        img4: Resident4, 
        frontImg: ResidentFrontImgSample,
        backImg:  ResidentBackImgSample,
      });
    }
  }
  next = next => {
    if(next === 1){
      if(this.state.name === "" || this.state.dob === null){
        toast.warning("Please input your name and birthday!");
        return;
      }
      if(this.state.docType === "passport"){
        if (this.state.frontImgSelected === false) {
          toast.warning("Please select a passport image!");
          return;
        }
      } else {
        if (this.state.frontImgSelected === false || this.state.backImgSelected === false) {
          toast.warning("Please select images!");
          return;
        }
      }
    } else if(next ===2 ){
      if(this.state.country === "" || this.state.postalCode === null || this.state.address === null || this.state.city === null){
        toast.warning("Please input all fields!");
        return;
      }
    }
    this.setState({ step: next});
  } 
  finish = () => {
    if (!this.state.check1 || !this.state.check2) {
      toast.warning("You must agree with terms and policies!");
      return;
    }
    const headers = {
      "Content-type": "multipart/form-data",
    };

    let formData = new FormData();
    formData.append("email", this.props.account?.email)
    formData.append("name", this.state.name)
    formData.append("dob", moment(this.state.dob).format('YYYY-MM-DD'))
    formData.append("expDate", this.state.expDate)
    formData.append("country", this.state.country)
    formData.append("postalCode", this.state.postalCode)
    formData.append("city", this.state.city)
    formData.append("address", this.state.address)
    formData.append("frontImg", this.state.frontFile)
    formData.append("backImg", this.state.backFile)
    formData.append("docType", this.state.docType)

    axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/verifyProfile`, formData, { headers })
    .then( account_info => {

    })
    this.props.history.push("/app/profile");
  }
 
  render() {
  const { step, img1, img2, img3, img4, frontImg, backImg, docType, dob, expDate, name, country, city, postalCode, address } = this.state;
  const { themeColor } = this.props;

    return (
      <div className={s.root}>
        <div className="form-content">
            <Box sx={{ width: '100%' }}>
              <Stepper activeStep={step} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box> 
            {
               step === 0 &&
              <div>
                  <h5 className={`page-title-${themeColor} mt-3`}>
                      Please verify your profile by uploading ID document and Proof of address
                  </h5>
                  <Row>
                      <Col md={6}>
                            <div className="mt-2">
                              <Label>Full name *</Label>
                              <Input className="input-content" value={name} onChange={e => this.setState({ name: e.target.value})} ></Input>
                            </div>
                            <div className="mt-3">
                              <Label>Date of birth *</Label>
                              <div  className={s.mui_control} >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DatePicker
                                    disableFuture
                                    openTo="year"
                                    views={['year', 'month', 'day']}
                                    value={dob}
                                    format="YYYY-MM-DD"
                                    inputFormat="YYYY-MM-DD"
                                    onChange={(newValue) => {
                                      this.setState({ dob: newValue.toLocaleString() });
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
                            <strong>Please attach your verification documents</strong>
                            <label className="my-2">Document type *</label>
                            <Row> 
                                <Col md={6}>
                                    <Button className={`${s.btn_doc} btn-light ${docType === "driver_license" && "active"}`} onClick={e => this.setDocType("driver_license")} >Driver's license</Button>
                                    <Button className={`${s.btn_doc} btn-light ${docType === "id_card" && "active"}`} onClick={e => this.setDocType("id_card")} >National ID Card</Button>
                                </Col>
                                <Col md={6}>
                                    <Button className={`${s.btn_doc} btn-light ${docType === "passport" && "active"}`} onClick={e => this.setDocType("passport")} >Passport</Button>
                                    <Button className={`${s.btn_doc} btn-light ${docType === "resident" && "active"}`} onClick={e => this.setDocType("resident")} >Proof of Address(Utility Bill or Bank statement)</Button>
                                </Col>
                            </Row>
                            <Row> 
                                  {
                                    frontImg && <Col xs={6}>
                                          <div className="example-item-image mt-3">
                                            <img className={s.img_responsive} src={ frontImg } alt=""/>  
                                          </div>
                                          <div className = "upload-btn mt-2" style={{ position: "relative"}}>
                                                  <input
                                                      type="file"
                                                      id="front-img"
                                                      accept=".jpg, .jpeg, .png" 
                                                      onChange={e => { this.setState({ frontImgSelected: true, frontFile: e.target.files[0], frontImg: URL.createObjectURL(e.target.files[0]) });}}
                                                      name="front-img"
                                                      style={{ width: "100%", height: "35px", opacity: 0, position: "absolute"}}
                                                  />
                                                  <label htmlFor="front-img" style={{ width: "100%"}}>
                                                    <Button color="primary" className="text-white" style={{ height: "35px", width: "100%"}}>
                                                        Upload Front Image
                                                    </Button>
                                                  </label>
                                          </div>
                                      </Col>
                                    
                                  }
                                  {
                                    backImg && 
                                    <Col xs={6}>
                                        <div className="example-item-image  mt-3">
                                          <img className={s.img_responsive} src={ backImg } alt=""/>  </div>
                                          <div className = "upload-btn mt-2" style={{ position: "relative"}}>
                                                  <input
                                                      type="file"
                                                      id="back-img"
                                                      accept=".jpg, .jpeg, .png" 
                                                      onChange={e => {this.setState({ backImgSelected: true,  backFile: e.target.files[0], backImg: URL.createObjectURL(e.target.files[0]) });}}
                                                      name="back-img"
                                                      style={{ width: "100%", height: "35px", opacity: 0, position: "absolute"}}
                                                  />
                                                  <label htmlFor="back-img" style={{ width: "100%"}}>
                                                    <Button color="primary" className="text-white" style={{ height: "35px", width: "100%"}}>
                                                        Upload Back Image
                                                    </Button>
                                                  </label>
                                          </div>
                                      </Col>
                                    }
                            </Row>
                            <div className="mt-3">
                              <Label>Expiration date</Label>
                              <div >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DatePicker
                                    openTo="year"
                                    views={['year', 'month', 'day']}
                                    value={expDate}
                                    onChange={(newValue) => {
                                      this.setState({ expDate: newValue });
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
                      </Col>
                      <Col md={6}>
                          <h6 className={`page-title-${themeColor} mt-3`}>
                            Tips on how your photo upload should look:
                          </h6>
                          <Row>
                                <Col xs={6}>
                                  <div className = "example-item-image">
                                    <img className={s.img_responsive} src={ img1 } alt=""/>  </div>
                                  <div className = "upload-btn">
                                    Must show all four corners  </div>
                                </Col>
                                <Col xs={6}>
                                  <div className = "example-item-image">
                                    <img className={s.img_responsive} src={ img2 } alt=""/>  </div>
                                  <div className = "example-item-text">
                                    Must not be covered in any way  </div>
                                </Col>
                                <Col xs={6}>
                                  <div className = "example-item-image">
                                    <img className={s.img_responsive} src={img3} alt=""/>  </div>
                                  <div className = "example-item-text">
                                    Must not be blurry  </div>
                                </Col>
                                <Col xs={6}>
                                  <div className = "example-item-image">
                                    <img className={s.img_responsive} src={img4} alt=""/>  </div>
                                  <div className = "example-item-text">
                                    Must upload both sides  </div>
                                </Col>
                          </Row>
                          <div className="" style={{ position: "absolute", bottom: "70px", right: "50px"}}>
                              <Button className={`btn-success`} onClick={e => this.next(1)} >Next</Button>
                                    
                          </div>
                      </Col>
                  </Row>
              </div>
            }
            {
               step === 1 &&
              <div>
                  <h5 className={`page-title-${themeColor} mt-3`}>
                      Please provide your address information
                  </h5>
                  <p>Please provide your current residential address details. To make the verification process as easy and as straight forward as possible we ask only these details: the country where you live, your city, your street address and your postal code. Just fill out these fields and click the Next button to proceed further.</p>
                  <Row>
                      <Col md={6}>
                            <div className="mt-2">
                              <Label>Country *</Label>
                              <Input className="input-content" value={country} onChange={e => this.setState({ country: e.target.value})}></Input>
                            </div>
                            <div className="mt-2">
                              <Label>Postal code *</Label>
                              <Input className="input-content" value={postalCode} onChange={e => this.setState({ postalCode: e.target.value})}></Input>
                            </div>
                            <div className="mt-2">
                              <Label>City *</Label>
                              <Input className="input-content" value={city} onChange={e => this.setState({ city: e.target.value})}></Input>
                            </div>
                            <div className="mt-2">
                              <Label>Address *</Label>
                              <Input className="input-content" value={address} onChange={e => this.setState({ address: e.target.value})}></Input>
                            </div>
                          
                      </Col>
                      <Col md={12} className="d-flex justify-content-between mt-3" >
                           <div className="" style={{  bottom: "70px", right: "50px"}}>
                                <Button className={`btn-gray`} onClick={e => this.next(0)} >Previous</Button>
                            </div>
                           <div className="" style={{  bottom: "70px", right: "50px"}}>
                                <Button className={`btn-success`} onClick={e => this.next(2)} >Next</Button>       
                            </div>
                      </Col>
                   
                  </Row>
              </div>
            }
            {
               step === 2 &&
              <div>
                  <h5 className={`page-title-${themeColor} mt-3`}>
                      Please verify your identity
                  </h5>
                  <Row>
                       <Col md={12}>
                          <Label >
                            <Input type="checkbox" style={{ width: "15px"}} onChange={e => this.setState({ check1: e.target.checked})}>  </Input> I declare and confirm my acceptance of the Client Agreement (including the Risk Disclosure Statement), that I have read, understood and fully agree to the Terms and Conditions outlined above.
                         </Label>
                         <Label >
                            <Input type="checkbox" style={{ width: "15px"}} onChange={e => this.setState({ check2: e.target.checked})}> </Input> I declare that I act in my own name as specified above and not on behalf of a third party in respect of all matters related to this client relationship. Accordingly all funds to be deposited and traded on the account with Exxomarkets are my own funds.
                         </Label> 
                      </Col>
                      <Col md={12} className="d-flex justify-content-between mt-3" >
                           <div className="" style={{  bottom: "70px", right: "50px"}}>
                                <Button className={`btn-gray`} onClick={e => this.next(0)} >Previous</Button>
                            </div>
                           <div className="" style={{  bottom: "70px", right: "50px"}}>
                                <Button className={`btn-success`} onClick={e => this.finish()} >Finish</Button>       
                            </div>
                      </Col>
                   
                  </Row>
              </div>
            }
            
          
         </div>
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
export default connect(mapStateToProps)(Dashboard);
