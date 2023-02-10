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
class ResetPassword extends React.Component {
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
            password: "",
            options: {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
              },
              
            errorMessage: null
        };
        this.changePassword = this.changePassword.bind(this);
        this.resetPassword = this.resetPassword.bind(this);

    }
    changePassword(event) {
        this.setState({ password: event.target.value });
    }
    resetPassword(e) {
        e.preventDefault();
        if(this.state.password === "" ){
            toast.warning("Please enter a new password.");
            return;
        }
        if (this.state.loading) return;
        this.setState({ loading: true });
        axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/reset-password`, { password: this.state.password})
        .then( async res => {
            this.setState({ loading: false });
            this.props.history.push("/login");
        })
        .catch(err => {
            this.setState({ loading: false });
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
                    <Widget className="widget-auth mx-auto login-body" title={<h4 className="mt-0"><strong>Sign In</strong> to Client Portal</h4>}>
                        <form onSubmit={this.resetPassword}>
                            <FormGroup className="mt">
                                <InputGroup className="input-group-no-border mt-3">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="la la-lock text-white"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input id="password" className="input-transparent pl-3" value={this.state.password} style={{padding: "0 0 0 10px" }}
                                        onChange={this.changePassword} type="password"
                                        name="password" placeholder="Enter a new Password"/>
                                    {/* <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="la la-eye text-white"/>
                                            </InputGroupText>
                                        </InputGroupAddon> */}
                                </InputGroup>
                            </FormGroup>
                            <div className="bg-widget auth-widget-footer mb-2 mt-3">
                                <Row>
                                    <Col md={12}>
                                        <Button type="submit" className="auth-btn"
                                                size="sm" >
                                            {this.state.loading ? 'Submitting...' : 'Submit'}
                                        </Button>
                                    </Col>
                                </Row>
                              
                            </div>
                        </form>
                    </Widget>
                </Container>
                <footer className="auth-footer" style={{ position: "absolute"}}>
                    <div class="text-center">
                            © 2022 <a href="https://exxomarkets.com/" target="blank">Exxo Choice Limited</a><br/>
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
 
export default connect(mapStateToProps)(ResetPassword);

