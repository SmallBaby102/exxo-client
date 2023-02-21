import React, { lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router,Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { NavLink } from 'reactstrap';
import axios from "axios";
/* eslint-disable */
import ErrorPage from '../pages/error';
/* eslint-enable */
import '../styles/theme.scss';
import Login from '../pages/login';
import Register from '../pages/register';
import VerifyEmail from '../pages/login/VerifyEmail';
import ResetLink from '../pages/login/ResetLink';
import ResetPassword from '../pages/login/ResetPassword';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import MSGIcon from '@mui/icons-material/Telegram';


const PrivateRoute = lazy(() =>  import('./PrivateRoute'));
const LayoutComponent = lazy(() => import('../components/Layout'));

// https://seeklogo.com/images/T/telegram-logo-E89B56AD97-seeklogo.com.png


const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      telegramLink: "",

    };
  }
  componentDidMount() {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/other/setting`)
    .then(res => {
      this.setState({ telegramLink: res.data.sysSetting.telegram });
    })
    .catch(err => {

    })
  }

  render() {
    const { telegramLink } = this.state;
    return (
        <div>
           <ToastContainer
                autoClose={5000}
                hideProgressBar
                closeButton={<CloseButton/>}
            />
            <Suspense fallback={<div></div>}>
                <Router>
                    <Switch>
                        <Route path="/" exact render={() => <Redirect to="/login"/>}/>
                        <PrivateRoute path="/app" dispatch={this.props.dispatch} location={ this.props.location }  component={LayoutComponent}/>
                        <Route path="/register" exact component={Register}/>
                        <Route path="/login" exact component={Login}/>
                        <Route path="/verify-email" exact component={VerifyEmail}/>
                        <Route path="/remind-link" exact component={ResetLink}/>
                        <Route path="/reset-password" exact component={ResetPassword}/>
                        <Route path="/error" exact component={ErrorPage}/>
                        <Route component={ErrorPage}/>
                        <Redirect from="*" to="/app/profile"/>
                    </Switch>
                </Router>
            </Suspense>
            <Box sx={{ position: "absolute", bottom: 16, right:16 }}>
              <NavLink
                href={telegramLink}
                target="_blank"
              >
                <Fab color="primary" aria-label="add">
                  <MSGIcon />
                </Fab>
              </NavLink>
            </Box>
        </div>

    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(App);
