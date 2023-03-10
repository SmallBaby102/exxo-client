import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Alert, Button, FormGroup, Label, InputGroup, InputGroupAddon, Input, InputGroupText, Row, Col } from 'reactstrap';
import Widget from '../../components/Widget';
import { loginUser, setAccount, setTradingAccounts, setOfferNames } from '../../actions/user';
import { setChecking } from '../../actions/navigation'
import axios from 'axios';
import { toast } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";
import Helper from '../../utils/Helper'

class Login extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };

    static isAuthenticated(token) {
        if (token) return true;
    }

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
            email: '',
            password: '',
            errorMessage: null
        };

        this.doLogin = this.doLogin.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    changeEmail(event) {
        this.setState({ email: event.target.value });
    }

    changePassword(event) {
        this.setState({ password: event.target.value });
    }

    doLogin(e) {
        e.preventDefault();
        if(this.state.email === "" || this.state.password === "" ){
            this.setState({ errorMessage: "Please fill all fields!"});
            return;
        }
        if (this.state.loading) return;
        this.setState({ loading: true });
        this.props.dispatch(setChecking(true));
        axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/signin`, { email: this.state.email, password: this.state.password })
        .then( async res => {
            if (!res.data.isEmailVerified) {
                this.props.history.push("/verify-email");
                return;
            }
            localStorage.setItem("authenticated", res.data.accessToken);
            localStorage.setItem("account", JSON.stringify(res.data));

            this.props.dispatch(setAccount(res.data));

            axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccounts`, { params: { clientUuid: res.data?.accountUuid, partnerId: res.data?.partnerId }})
            .then( async res => {
                this.props.dispatch(setTradingAccounts(res.data));
                axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/offers`, { params: { email: this.state.email, partnerId: res.data?.partnerId }})
                .then( async res => {
                    this.setState({ offers: res.data})
                    let temp = [];
                    for (const iterator of res.data) {
                        temp.push({ value: iterator.name, label: iterator.name })
                    }
                    this.props.dispatch(setOfferNames(temp));
                    console.log(res);
                    this.props.dispatch(setChecking(false));
                    this.props.dispatch(loginUser({ email: this.state.email, password: this.state.password }));
        
                  
                
                })
                .catch(e => {
                    console.log(e);
                })
            })
            .catch(e => {
                console.log(e);
            })
           
            console.log("user infomation for redict after login", res.data);
            if (res.data.verification_status === "Approved") {
                this.props.history.push("/app/accounts");
            } else {
                this.props.history.push("/app/profile");
            }
            this.setState({ loading: false });  
        })
        .catch(err => {
            toast.error(err.response.data.message)
            this.setState({ loading: false });
        })
        
    }

    signUp() {
        this.props.history.push('/register');
    }

    onGoogleAuth = (values) => {
        console.log("google auth", values)
    }

    render() {
        const {
            onFacebookAuth,
            onAppleAuth,
          } = this.props
      
        return (
            <div className="auth-page">
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
                            <Alert className="alert-sm widget-middle-overflow rounded-2 text-center mb-2" style={{backgroundColor: "rgba(196,65,98,0.3)", maxWidth: "450px", border: "2px solid #c44162", margin: "auto"}}>
                                {this.state.errorMessage}
                            </Alert>
                        </Container>
                    )
                }
                <Container>
                    <Widget className="widget-auth mx-auto login-body" title={<h4 className="mt-0"><strong>Sign In</strong> to Client Portal</h4>}>
                    
                        <form onSubmit={this.doLogin}>
                            <FormGroup className="mt">
                                <InputGroup className="input-group-no-border">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="la la-user text-white"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input id="email" className="input-transparent pl-3" style={{padding: "0 0 0 10px" }} value={this.state.email} onChange={this.changeEmail} type="email"
                                            name="email" placeholder="Email"/>
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup className="input-group-no-border mt-3">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="la la-lock text-white"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input id="password" className="input-transparent pl-3" value={this.state.password} style={{padding: "0 0 0 10px" }}
                                           onChange={this.changePassword} type="password"
                                            name="password" placeholder="Password"/>
                                </InputGroup>
                            </FormGroup>
                            <div className="bg-widget auth-widget-footer">
                                <Row>
                                    <Col md={6}>
                                        <Button type="submit" className="auth-btn"
                                                size="sm" >
                                            {this.state.loading ? 'Loading...' : 'Sign In'}
                                        </Button>
                                    </Col>
                                    <Col md={6} className="text-center">
                                        <a className="mt-4 btn btn-link btn-block remind-link" href="/remind-link">
                                            Forgotten password?
                                        </a>
                                    </Col>
                                </Row>
                                <div className="login-or">OR</div>
                                <Link className="mb-4 btn btn-default btn-block" to="register">Create a new Profile</Link>                              
                            </div>
                        </form>
                    </Widget>
                </Container> 
                <footer className="auth-footer">
                    <div className="text-center">
                            ?? 2020 <a href="https://exxomarkets.com/" target="blank">Exxo Markets LLC</a><br/>
                            All Rights Reserved      
                    </div>
                </footer>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isFetching: state.auth.isFetching,
        isAuthenticated: state.auth.isAuthenticated,
        errorMessage: state.auth.errorMessage,
    };
}
 
export default connect(mapStateToProps)(Login);

