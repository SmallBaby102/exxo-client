import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Progress, Alert} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {dismissAlert} from '../../actions/alerts';
import s from './Sidebar.module.scss';
import LinksGroup from './LinksGroup';

import {changeActiveSidebarItem, closeSidebar} from '../../actions/navigation';
import {logoutUser} from '../../actions/user';
import Logo from '../../assets/logo-6.png';
import { AiOutlineTool, AiOutlineLike, AiOutlineGroup, AiOutlineUser, AiOutlinePlusSquare } from 'react-icons/ai';
import { RiShareForwardLine } from "react-icons/ri";
class Sidebar extends React.Component {
    static propTypes = {
        sidebarStatic: PropTypes.bool,
        sidebarOpened: PropTypes.bool,
        dispatch: PropTypes.func.isRequired,
        activeItem: PropTypes.string,
        verifyStatus: PropTypes.string,
        location: PropTypes.shape({
            pathname: PropTypes.string,
        }).isRequired,
    };

    static defaultProps = {
        sidebarStatic: false,
        activeItem: '',
    };

    constructor(props) {
        super(props);

        this.doLogout = this.doLogout.bind(this);
    }

    componentDidMount() {
        this.element.addEventListener('transitionend', () => {
            if (this.props.sidebarOpened) {
                this.element.classList.add(s.sidebarOpen);
            }
        }, false);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sidebarOpened !== this.props.sidebarOpened) {
            if (nextProps.sidebarOpened) {
                this.element.style.height = `${this.element.scrollHeight}px`;
                this.element.style.transform = "translateX(-15px)";
                this.element.style.zIndex = 1;
                this.element.style.background = "#1B1E3F";
                this.element.style.transition = "1s";
            } else {
                this.element.classList.remove(s.sidebarOpen);
                this.element.style.transform = "translateX(-270px)";
                this.element.style.transition = "1s";
            }
        }
    }

    dismissAlert(id) {
        this.props.dispatch(dismissAlert(id));
    }

    doLogout() {
        this.props.dispatch(logoutUser());
    }

    render() {
        const { themeColor, sidebarOpened, verifyStatus } = this.props;
        console.log("vv", verifyStatus)
        return (
            <nav
                className={cx(s.root)}
                ref={(nav) => { this.element = nav; }}
            >
                
                <header className={this.props.themeColor === "dark" ? s.logo: s.logoLight }>
                    <a href = "/"><img src = {Logo} style = {{width: "100px"}} alt="logo"></img></a>
                </header>
                <ul className = {s.nav}>
                    <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="Profile"
                        isHeader
                        iconName={<AiOutlineUser className={themeColor === "dark"? s.menuIcon: s.menuIconLight}/>}
                        link="/app/profile"
                        index="profile"
                        childrenLinks={(verifyStatus !== "Approved" && verifyStatus !== "Pending"  )? [
                            {
                                header: 'Personal Information', link: '/app/profile/personal-info',
                            },
                            {
                                header: 'Change backoffice password', link: '/app/profile/change-backoffice-pass',
                            },
                            {
                                header: 'Change Email', link: '/app/profile/change-email',
                            },
                            {
                                header: 'Verify profile', link: '/app/profile/verify',
                            },
                            {
                                header: 'Mobile phone verification', link: '/app/profile/mobile-verify',
                            },
                            {
                                header: 'Security', link: '/app/profile/security',
                            },
                            {
                                header: 'Notifications', link: '/app/profile/notifications',
                            },
                            {
                                header: 'Pips+ Loyalty Programme', link: '/app/profile/pips',
                            },
                            {
                                header: 'Corporate account', link: '/app/profile/corporate-account',
                            },
                            {
                                header: 'Joint account', link: '/app/profile/joint-account',
                            },
                            {
                                header: 'Subscriptions', link: '/app/profile/subscriptions',
                            },
                        ] : 
                        [
                            {
                                header: 'Personal Information', link: '/app/profile/personal-info',
                            },
                            {
                                header: 'Change backoffice password', link: '/app/profile/change-backoffice-pass',
                            },
                            {
                                header: 'Change Email', link: '/app/profile/change-email',
                            },
                            {
                                header: 'Change home address', link: '/app/profile/change-home',
                            },
                            {
                                header: 'Security', link: '/app/profile/security',
                            },
                            {
                                header: 'Notifications', link: '/app/profile/notifications',
                            },
                            {
                                header: 'Pips+ Loyalty Programme', link: '/app/profile/pips',
                            },
                            {
                                header: 'Corporate account', link: '/app/profile/corporate-account',
                            },
                            {
                                header: 'Joint account', link: '/app/profile/joint-account',
                            },
                            {
                                header: 'Subscriptions', link: '/app/profile/subscriptions',
                            },
                        ]}
                    />
                      {
                        verifyStatus === "Approved" &&
                        <LinksGroup
                            onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                            activeItem={this.props.activeItem}
                            header="Accounts"
                            isHeader
                            iconName={<AiOutlineGroup className={themeColor === "dark"? s.menuIcon: s.menuIconLight}/>}
                            link="/app/accounts"
                            index="accounts"
                        />
                      }
                    <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="Deposit"
                        isHeader
                        iconName={<AiOutlinePlusSquare className={themeColor === "dark"? s.menuIcon: s.menuIconLight}/>}
                        link="/app/deposit"
                        index="deposit"
                    />
                    {
                        verifyStatus === "Approved" &&
                        <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="Withdrawal"
                        isHeader
                        iconName={<RiShareForwardLine className={themeColor === "dark"? s.menuIcon: s.menuIconLight}/>}
                        link="/app/withdraw"
                        index="withdrawal"
                        />
                    }
                 
                    <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="Services"
                        isHeader
                        iconName={<AiOutlineTool className={themeColor === "dark"? s.menuIcon: s.menuIconLight}/>}
                        link="/app/services"
                        index="services"
                        childrenLinks={[
                            {
                                header: 'VPS', link: '/app/services/vps',
                            },
                            {
                                header: 'Myfxbook Autotrade', link: '/app/services/autotrade',
                            },
                            {
                                header: 'ZuluTrade', link: '/app/services/zulutrade',
                            },
                            {
                                header: 'Web terminal MetaTrader 4', link: '/app/services/metatrader4',
                            },
                            {
                                header: 'Web terminal MetaTrader 5', link: '/app/services/metatrader5',
                            },
                            {
                                header: 'Open a MAM', link: '/app/services/mam',
                            },
                        ]}
                    />
                     <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="REFER AND EARN"
                        isHeader
                        iconName={<AiOutlineLike className={themeColor === "dark"? s.menuIcon: s.menuIconLight}/>}
                        link="/app/refer"
                        index="refer"
                    />
                    
                  
                </ul>
            </nav>
        );
    }
}

function mapStateToProps(store) {
    return {
        sidebarOpened: store.navigation.sidebarOpened,
        sidebarStatic: store.navigation.sidebarStatic,
        alertsList: store.alerts.alertsList,
        activeItem: store.navigation.activeItem,
        themeColor: store.navigation.themeColor,
        verifyStatus: store.auth.account?.verification_status,
    };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
