import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Hammer from 'rc-hammerjs';
import Facebook from '../../assets/socials/facebook.png'
import Twitter from '../../assets/socials/twitter.png'
import Youtube from '../../assets/socials/youtube.png'
import Accounts from '../../pages/accounts';
import AccountDetail from '../../pages/accounts/AccountDetail';
import Withdrawal from '../../pages/withdrawal';
import Deposit from '../../pages/deposit';
import DepositDetail from '../../pages/deposit_detail';
import PersonalInfo from '../../pages/personal-info';
import ChangeBackofficePass from '../../pages/change-backoffice-pass';
import VerifyProfile from '../../pages/verify-profile'; 
import BecomeIB from '../../pages/become-ib';

import Header from '../Header';
import Sidebar from '../Sidebar';
import { openSidebar, closeSidebar } from '../../actions/navigation';
import s from './Layout.module.scss';
import InternalTransfer from '../../pages/accounts/InternalTransfer';

class Layout extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarStatic: false,
    sidebarOpened: false,
  };
  constructor(props) {
    super(props);

    this.handleSwipe = this.handleSwipe.bind(this);
  }


  handleSwipe(e) {
    if ('ontouchstart' in window) {
      if (e.direction === 4 && !this.state.chatOpen) {
        this.props.dispatch(openSidebar());
        return;
      }

      if (e.direction === 2 && this.props.sidebarOpened) {
        console.log("close sidebar");
        this.props.dispatch(closeSidebar());
        return;
      }

      this.setState({ chatOpen: e.direction === 2 });
    }
  }

  render() {
    return (
      <div
        className={[
          s.root,
          'sidebar-' + this.props.sidebarPosition,
          'sidebar-' + this.props.sidebarVisibility,
          this.props.themeColor === "dark" ? s.backgroundDark: s.backgroundLight,
        ].join(' ')}
        onClick={e => {this.props.sidebarOpened && this.props.dispatch(closeSidebar())}}
      >
        <div className={s.wrap}>
          <Header />
          {/* <Chat chatOpen={this.state.chatOpen} /> */}
          {/* <Helper /> */}
          <Sidebar />
          <Hammer onSwipe={this.handleSwipe}>
            <main className={s.content}>
              {/* <BreadcrumbHistory url={this.props.location.pathname} /> */}
              <TransitionGroup>
                <CSSTransition
                  key={this.props.location.key}
                  classNames="fade"
                  timeout={200}
                >
                  <Switch>
                    <Route path="/app/profile" exact render={() => <Redirect to="/app/profile/personal-info" />} />
                    <Route path="/app/profile/personal-info" exact component={PersonalInfo} />
                    <Route path="/app/profile/change-backoffice-pass" exact component={ChangeBackofficePass} />
                    <Route path="/app/profile/verify" exact component={VerifyProfile} />
                    <Route path="/app/accounts" exact component={Accounts} />
                    <Route path="/app/account-detail/:id/:systemUuid/:tradingAccountUuid" exact component={AccountDetail} />
                    <Route path="/app/internal-transfer" exact component={InternalTransfer} />
                    <Route path="/app/withdraw" exact component={Withdrawal} />
                    <Route path="/app/deposit" exact component={Deposit} />
                    <Route path="/app/deposit_detail/:currency" exact component={DepositDetail} />
                    <Route path="/app/refer" exact component={BecomeIB} />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
              {/* <footer className={s.contentFooter} >
                <a href="#" className='m-1'><img className="social-link" src={Facebook} /></a>
                <a href="#" className='m-1'><img className="social-link" src={Twitter} /></a>
                <a href="#" className='m-1'><img className="social-link" src={Youtube} /></a>
                
                { new Date().getFullYear() } &copy; Exxo - Made by <a href="#" rel="noopener noreferrer" target="_blank">CRTLN</a>.
              </footer> */}
            </main>
          </Hammer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarPosition: store.navigation.sidebarPosition,
    sidebarVisibility: store.navigation.sidebarVisibility,
    themeColor: store.navigation.themeColor,
  };
}

export default connect(mapStateToProps)(Layout);
