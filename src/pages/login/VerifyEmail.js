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
class VerifyEmail extends React.Component {
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
          
            errorMessage: null
        };

    }


    render() {
        const {
            onFacebookAuth,
            onAppleAuth,
          } = this.props
      
        return (
            <div className="auth-page">
                <a href="https://my.myfxchoice.com"><span class="login-logo"></span></a>
                <div className='auth-header'>
                    <div class="link-to-homepage-container">
                        <a href="https://en.myfxchoice.com/" target="_blank">
                            Please click here to go to our homepage          
                        </a>
                    </div>
                </div>
                <Container>
                    <Widget className="widget-auth mx-auto login-body" title={<h4 className="mt-0"><strong>
                        Please check your mail box.</strong></h4>}>
                    </Widget>
                </Container>
                <footer className="auth-footer" style={{ position: "absolute"}}>
                    <div class="text-center">
                            © 2022 <a href="https://en.myfxchoice.com/" target="blank">Exxo Choice Limited</a><br/>
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
 
export default connect(mapStateToProps)(VerifyEmail);

