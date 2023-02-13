import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Alert, Button, FormGroup, Label, InputGroup, InputGroupAddon, Input, InputGroupText, Row, Col, Toast } from 'reactstrap';
import Widget from '../../components/Widget';
import { loginUser, setAccount, setTradingAccounts, setOfferNames } from '../../actions/user';
import { setChecking } from '../../actions/navigation'
import axios from 'axios';
import { toast } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";
import Helper from '../../utils/Helper'
class ResetLink extends React.Component {
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
            email: "",
            options: {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
              },
              
            errorMessage: null
        };
        this.changeEmail = this.changeEmail.bind(this);
        this.resetPassword = this.resetPassword.bind(this);

    }
    changeEmail(event) {
        this.setState({ email: event.target.value });
    }
    resetPassword() {
        axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/reset-link`, { email: this.state.email })
        .then( async res => {
            toast.success("We have sent the link to your email.");
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
        const {
            onFacebookAuth,
            onAppleAuth,
          } = this.props
      
        return (
            <div className="auth-page">
                <a href="https://exxomarkets.com"><span class="login-logo"></span></a>
                <div className='auth-header'>
                    <div class="link-to-homepage-container">
                        <a href="https://exxomarkets.com/" target="_blank">
                            Please click here to go to our homepage          
                        </a>
                    </div>
                </div>
                <Container>
                    <Widget className="widget-auth mx-auto login-body" title={<h4 className="mt-0">Enter your account's email address to reset your password.</h4>}>

                            <FormGroup className="mt">
                                <InputGroup className="input-group-no-border">
                                    
                                    <Input id="email" className="input-transparent pl-3" style={{padding: "0 0 0 10px" }} value={this.state.email} onChange={this.changeEmail} type="email"
                                            name="email" placeholder="Email"/>
                                    <InputGroupAddon addonType="prepend"  onClick = {e => this.resetPassword(e)}>
                                        <InputGroupText>
                                            <i className="la la-send text-white"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormGroup>
                    </Widget>
                </Container>
                <footer className="auth-footer" style={{ position: "absolute"}}>
                    <div class="text-center">
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
        isFetching: state.auth.isFetching,
        isAuthenticated: state.auth.isAuthenticated,
        errorMessage: state.auth.errorMessage,
    };
}
 
export default connect(mapStateToProps)(ResetLink);

