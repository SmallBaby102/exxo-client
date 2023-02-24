import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import  axios from 'axios';
import { Container, Alert, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap';
import Select from "react-select";
import Widget from '../../components/Widget';
import { registerUser, registerError } from '../../actions/register';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import 'font-awesome/css/font-awesome.min.css'; 
import {
    FACEBOOK_APP_ID,
    APPLE_CLIENT_ID,
    GOOGLE_CLIENT_ID,
  } from "../../config/constants";
import { setAccount } from '../../actions/user';
import { setChecking } from '../../actions/navigation';
let country_code_json = {"+1":"United States(+1)", "+93":"Afghanistan(+93)","+355":"Albania(+355)","+213":"Algeria(+213)","+376":"Andorra(+376)","+244":"Angola(+244)","+268":"Antigua and Barbuda(+268)","+54":"Argentina(+54)","+374":"Armenia(+374)","+63":"Philippines(+63)","+43":"Austria(+43)","+994":"Azerbaijan(+994)","+242":"Congo(+242)","+973":"Bahrain(+973)","+880":"Bangladesh(+880)","+246":"Barbados(+246)","+375":"Belarus(+375)","+32":"Belgium(+32)","+501":"Belize(+501)","+229":"Benin(+229)","+975":"Bhutan(+975)","+591":"Bolivia(+591)","+387":"Bosnia and Herzegovina(+387)","+55":"Brazil(+55)","+673":"Brunei(+673)","+359":"Bulgaria(+359)","+226":"Burkina Faso(+226)","+257":"Burundi(+257)","+238":"Cabo Verde(+238)","+855":"Cambodia(+855)","+237":"Cameroon(+237)","+1_ca":"Canada(+1)","+236":"Central African Republic(+236)","+235":"Chad(+235)","+56":"Chile(+56)","+86":"China(+86)","+57":"Colombia(+57)","+269":"Comoros(+269)","+506":"Costa Rica(+506)","+225":"Cote d'Ivoire(+225)","+385":"Croatia(+385)","+53":"Cuba(+53)","+357":"Cyprus(+357)","+420":"Czech Republic(+420)","+45":"Denmark(+45)","+253":"Djibouti(+253)","+767":"Dominica(+767)","+809":"Dominican Republic(+809)","+670":"East Timor(+670)","+20":"Egypt(+20)","+503":"El Salvador(+503)","+240":"Equatorial Guinea(+240)","+291":"Eritrea(+291)","+372":"Estonia(+372)","+679":"Fiji(+679)","+358":"Finland(+358)","+33":"France(+33)","+241":"Gabon(+241)","+220":"Gambia(+220)","+995":"Georgia(+995)","+49":"Germany(+49)","+233":"Ghana(+233)","+30":"Greece(+30)","+473":"Grenada(+473)","+502":"Guatemala(+502)","+224":"Guinea(+224)","+245":"Guinea-Bissau(+245)","+592":"Guyana(+592)","+509":"Haiti(+509)","+504":"Honduras(+504)","+36":"Hungary(+36)","+354":"Iceland(+354)","+91":"India(+91)","+62":"Indonesia(+62)","+964":"Iraq(+964)","+353":"Ireland(+353)","+972":"Israel(+972)","+39":"Italy(+39)","+876":"Jamaica(+876)","+81":"Japan(+81)","+962":"Jordan(+962)","+7_kaz":"Kazakhstan(+7)","+254":"Kenya(+254)","+686":"Kiribati(+686)","+82":"South Korea(+82)","+383":"Kosovo(+383)","+965":"Kuwait(+965)","+996":"Kyrgyzstan(+996)","+856":"Laos(+856)","+371":"Latvia(+371)","+961":"Lebanon(+961)","+266":"Lesotho(+266)","+231":"Liberia(+231)","+218":"Libya(+218)","+423":"Liechtenstein(+423)","+370":"Lithuania(+370)","+352":"Luxembourg(+352)","+389":"Macedonia(+389)","+261":"Madagascar(+261)","+265":"Malawi(+265)","+960":"Maldives(+960)","+223":"Mali(+223)","+356":"Malta(+356)","+692":"Marshall Islands(+692)","+222":"Mauritania(+222)","+230":"Mauritius(+230)","+52":"Mexico(+52)","+691":"Federated States of Micronesia(+691)","+373":"Moldova(+373)","+377":"Monaco(+377)","+976":"Mongolia","+382":"Montenegro(+382)","+258":"Mozambique(+258)","+95":"Myanmar(+95)","+264":"Namibia(+264)","+674":"Nauru(+674)","+977":"Nepal(+977)","+31":"Netherlands(+31)","+64":"New Zealand(+64)","+505":"Nicaragua(+505)","+227":"Niger(+227)","+234":"Nigeria(+234)","+47":"Norway(+47)","+968":"Oman(+968)","+680":"Palau(+680)","+507":"Panama(+507)","+675":"Papua New Guinea(+675)","+595":"Paraguay(+595)","+51":"Peru(+51)","+48":"Poland(+48)","+351":"Portugal(+351)","*974":"Qatar(+974)","+40":"Romania(+40)","+7":"Russia(+7)","+250":"Rwanda(+250)","+869":"Saint Kitts and Nevis(+869)","+758":"Saint Lucia(+758)","+784":"Saint Vincent and the Grenadines(+784)","+685":"Samoa(+685)","+378":"San Marino(+378)","+239":"Sao Tome and Principe(+239)","+966":"Saudi Arabia(+966)","+221":"Senegal(+221)","+248":"Seychelles(+248)","+232":"Sierra Leone(+232)","+65":"Singapore(+65)","+421":"Slovakia(+421)","+386":"Slovenia(+386)","+677":"Solomon Islands(+677)","+252":"Somalia(+252)","+27":"South Africa(+27)","+34":"Spain(+34)","+249":"Sudan(+249)","+211":"South Sudan(+211)","+597":"Suriname(+597)","+268_swa":"Swaziland(+268)","+46":"Sweden(+46)","+41":"Switzerland(+41)","+886":"Taiwan(+886)","+992":"Tajikistan(+992)","+255":"Tanzania(+255)","+66":"Thailand(+66)","+228":"Togo(+228)","+676":"Tonga(+676)","+90":"Turkey(+90)","+993":"Turkmenistan(+993)","+688":"Tuvalu(+688)","+256":"Uganda(+256)","+380":"Ukraine(+380)","+971":"United Arab Emirates(+971)","+44":"United Kingdom(+44)","+598":"Uruguay(+598)","+998":"Uzbekistan(+998)","+678":"Vanuatu(+678)","+379":"Vatican City(+379)","+58":"Venezuela(+58)","+84":"Vietnam(+84)","+260":"Zambia(+260)"};
  let country_code_arr = [];
  for (const key in country_code_json) {
    if (Object.hasOwnProperty.call(country_code_json, key)) {
      const element = country_code_json[key];
      country_code_arr.push({value: key, label: element});
    }
  }
  
class Register extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            options: {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
              },
            fullname: '',
            email: '',
            countryCode: '',
            code: '',
            password: '',
            phone: '',
            step: 1,
            errorMessage: null,
            read_notice: ''
        };

        this.next = this.next.bind(this);
        this.next2 = this.next2.bind(this);
        this.doRegister = this.doRegister.bind(this);
        this.changeName = this.changeName.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.changePhone = this.changePhone.bind(this);
        this.changeCountryCode = this.changeCountryCode.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.isPasswordValid = this.isPasswordValid.bind(this);
    }
    next() {
        if(this.state.fullname === "" || this.state.email === "" || this.state.password === "" ){
            this.setState({ errorMessage: "Please fill all fields!"});
            return;
        }
        if(this.state.read_notice === "" ){
            this.setState({ errorMessage: "You must accept Data Protection Notice!"});
            return;
        }
        this.setState({ errorMessage: null });
        
        axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/checkDuplicateUsernameOrEmail`, { email: this.state.email } )
        .then(res => {
                this.setState({step: 2});
                this.setState({ errorMessage: null });
        })
        .catch(e => {
            console.log(e.response);
            this.setState({ errorMessage: e.response.data.message});
        })
    }
    next2() {
        this.setState({ errorMessage: null });
        this.setState({step: 3});
    }
    changeEmail(event) {
        this.setState({ email: event.target.value });
    }
    changeName(event) {
        this.setState({ fullname: event.target.value });
    }

    changePassword(event) {
        this.setState({ password: event.target.value });
    }

    changePhone(event) {
        this.setState({ phone: event.target.value});
    }
    changeCountryCode(event) {
        this.setState({ countryCode: event.label});
        this.setState({ code: event.value});
    }

    checkPassword() {
        if (!this.isPasswordValid()) {
            if (!this.state.password) {
                this.props.dispatch(registerError("Password field is empty"));
            } else {
                this.props.dispatch(registerError("Passwords are not equal"));
            }
            // setTimeout(() => {
            //     this.props.dispatch(registerError());
            // }, 4 * 1000)
        }
    }

    isPasswordValid() {
       return this.state.password && this.state.password === this.state.confirmPassword;
    }

    doRegister(e) {
        if (this.state.loading) return;
        this.setState({ loading: true });
        const queryParams = new URLSearchParams(window.location.search);
        const ibid = queryParams.get("ibid")?queryParams.get("ibid"):'';
        const ibuuid = queryParams.get("ibuuid")?queryParams.get("ibuuid"):'';
        axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/signup`, { email: this.state.email,countryCode: this.state.countryCode,  password: this.state.password, phone: this.state.phone, fullname: this.state.fullname, ibid: ibid, ibuuid:ibuuid })
        .then( async res => {
            this.props.dispatch(setChecking(false));
            this.setState({ loading: false });
            this.props.dispatch(registerUser({
                creds: {
                    email: this.state.email,
                    password: this.state.password
                },
                history: this.props.history
            }));
            this.props.history.push("/verify-email");
        })
        .catch(err => {
            this.props.dispatch(setChecking(false));

            console.log(err);
            toast.warn(err.response.data.message, this.state.options)
            this.setState({ loading: false });
        })
     }

    render() {
        const {
            onFacebookAuth,
            onAppleAuth,
            onGoogleAuth,
          } = this.props
        const { step } = this.state;
        return (
            <div className="auth-page register-page">
                 <a href="https://client.exxomarkets.com"><span className="login-logo"></span></a>
                <div className='auth-header'>
                    <div className="link-to-homepage-container">
                    <a href="https://exxomarkets.com" target="_blank">
                        Please click here to go to our homepage          </a>
                    </div>
                </div>
                {
                    this.state.errorMessage && (
                        <Container>
                            <Alert className="alert-sm widget-middle-overflow rounded-2 text-center mb-2" style={{backgroundColor: "rgba(196,65,98,0.3)", border: "2px solid #c44162", margin: "0"}}>
                                {this.state.errorMessage}
                            </Alert>
                        </Container>
                    )
                }
                <Container>
                    <Widget className="mx-auto login-body" title={<h3 className="mt-0">Registration</h3>}>
                        <ul className="anchor steps_3">
                            <li className="wizard-step-1"><a className={ step !== 1 ? "done selected" : "selected" }><span className="stepDesc">Personal Data</span></a></li>
                            <li className="wizard-step-2"><a className={ step === 3 ? "done" : step === 2 ? "selected" : "disabled"}><span className="stepDesc">Telephone confirmation</span></a></li>
                            <li className="wizard-step-3"><a className={ step ===3 ? "selected" : "disabled"}><span className="stepDesc">Registration complete</span></a></li>
                        </ul>
                        {
                            step === 1 &&
                            <form className="register-form w-50 m-auto">
                               
                                <FormGroup className="mt-4">
                                    <InputGroup className="input-group-no-border">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="la la-user text-white"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input id="name" className="input-transparent pl-3" value={ this.state.fullname }
                                            onChange={this.changeName} type="text"
                                            style={{padding: "0 0 0 10px" }} 
                                            required name="name" placeholder="Full Name"/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="mt-2">
                                    <InputGroup className="input-group-no-border">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="la la-envelope text-white"></i>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input id="email" className="input-transparent pl-3" value={this.state.email}
                                            onChange={this.changeEmail} type="email"
                                            style={{padding: "0 0 0 10px" }} 
                                            required name="email" placeholder="Email"/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <InputGroup className="input-group-no-border mt-2">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="la la-lock text-white"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input id="password" className="input-transparent pl-3" value={this.state.password}
                                            onChange={this.changePassword} type="password" style={{padding: "0 0 0 10px" }} 
                                            required name="password" placeholder="Password"/>
                                    </InputGroup>
                                </FormGroup>
                                <div className="fs-12 mt-4" style={{ whiteSpace: "nowrap"}}>
                                    <input type="checkbox" className='form-check-input' checked={this.state.read_notice} onChange={e => this.setState({read_notice: e.target.checked})}></input>
                                    I have read, understood and accepted the <a target="_blank" href="https://exxomarkets.com/data-protection-notice" className='btn btn-link btn-block remind-link'><strong>Term and Conditions of Trading</strong></a>.</div>
                                <div className=" auth-widget-footer">
                                    <Button type="button" onClick={this.next} className="next-btn"
                                            size="sm" style={{color: '#fff'}}>Next</Button>
                                    <p className="widget-auth-info mt-4">
                                        Already have the account? Login now!
                                    </p>
                                    <Link className="mb-4 btn btn-default w-100" to="login">Enter the account</Link>
                                </div>
                            </form>
                        }
                        {
                            step === 2 && 
                            <form className="register-form w-50 m-auto">
                                <FormGroup className="mt-4">
                                    <InputGroup className="input-group-no-border">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="la la-globe text-white"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <div className="input-transparent pl-3"  style={{ flex: 1 }}>
                                            <Select
                                                options={country_code_arr} 
                                                className="react-select-container" 
                                                classNamePrefix="react-select"
                                                value={{ value: this.state.countryCode, label: this.state.countryCode }}
                                                onChange={e => this.changeCountryCode(e)}
                                                styles={{
                                                    control: (baseStyles, state) => ({
                                                      ...baseStyles,
                                                      borderColor: 'grey',
                                                      backgroundColor: "white",
                                                      opacity: .8
                                                      
                                                    }),
                                                    option: (base) => ({
                                                        ...base,
                                                        color: 'black',
                                                      }),
                                                  }}
                                            />
                                        </div>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="mt-2">
                                    <InputGroup className="input-group-no-border">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="la la-phone text-white"></i>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input id="phone" className="input-transparent pl-3" value={this.state.phone}
                                            onChange={this.changePhone} type="text"
                                            style={{padding: "0 0 0 10px" }} 
                                            required name="phone" placeholder=""/>
                                    </InputGroup>
                                </FormGroup>
                                <div className=" auth-widget-footer">
                                    <Button type="button" className="next-btn"
                                            size="sm" style={{color: '#fff'}} onClick={this.next2}>Next</Button>
                                    <p className="widget-auth-info mt-4">
                                        Already have the account? Login now!
                                    </p>
                                    <Link className="mb-4 btn btn-default w-100" to="login">Enter the account</Link>
                                </div>
                            </form>
                        }
                        {
                            step === 3 && 
                            <form className="register-form w-50 m-auto">
                                <div className='' style={{ marginTop: "80px"}}>
                                    Congratulation! <br/><br/>
                                    Thanks for choosing us as your broker. 
                                </div>
                                <div className=" auth-widget-footer">
                                    <Button type="button" className="next-btn" onClick={this.doRegister} 
                                            size="sm" style={{color: '#fff'}}>{this.state.loading ? 'Loading...' : 'Complete'}</Button>
                                </div>
                            </form>
                        }
                       
                    </Widget>
                </Container>
                <footer className="auth-footer">
                    <div className="text-center">
                            © 2020 <a href="https://exxomarkets.com/" target="blank">Exxo Markets LLC</a><br/>
                            All Rights Reserved      
                    </div>
                </footer>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isFetching: state.register.isFetching,
        errorMessage: state.register.errorMessage,
    };
}

export default connect(mapStateToProps)(Register);

