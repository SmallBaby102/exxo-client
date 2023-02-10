import React, { lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router,Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
/* eslint-disable */
import ErrorPage from '../pages/error';
/* eslint-enable */
import '../styles/theme.scss';
import Login from '../pages/login';
import Register from '../pages/register';
import VerifyEmail from '../pages/login/VerifyEmail';
import ResetLink from '../pages/login/ResetLink';
import ResetPassword from '../pages/login/ResetPassword';
const PrivateRoute = lazy(() =>  import('./PrivateRoute'));
const LayoutComponent = lazy(() => import('../components/Layout'));

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

class App extends React.PureComponent {
  render() {
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
        </div>

    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(App);
