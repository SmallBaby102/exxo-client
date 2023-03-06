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
import { AiOutlineLike, AiOutlineGroup, AiOutlineUser, AiOutlinePlusSquare, AiOutlineUserSwitch, AiOutlineTransaction } from 'react-icons/ai';
import { RiShareForwardLine, RiCustomerServiceLine } from "react-icons/ri";
class Sidebar extends React.Component {
    static propTypes = {
        sidebarStatic: PropTypes.bool,
        sidebarOpened: PropTypes.bool,
        dispatch: PropTypes.func.isRequired,
        activeItem: PropTypes.string,
        verifyStatus: PropTypes.string,
        ibStatus: PropTypes.string,
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
                this.element.style.transform = "translateX(0px)";
                this.element.style.zIndex = 1;
                this.element.style.background = "linear-gradient(#244985, #243b61)";
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
        const { themeColor, sidebarOpened, verifyStatus, ibStatus } = this.props;
        return (
            <nav
                className={cx(s.root)}
                ref={(nav) => { this.element = nav; }}
            >
                
                <header className={this.props.themeColor === "dark" ? s.logo: s.logoLight }>
                    <a href = {verifyStatus === "Approved"?"/app/accounts":"/app/profile"}>
                        <img src = {Logo} style = {{width: "100px"}} alt="logo"></img>
                    </a>
                </header>
                <ul className = {`c_sidebar_ul ${s.nav}`}>
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
                                header: 'Change Password', link: '/app/profile/change-backoffice-pass',
                            },
                            {
                                header: 'Verify profile', link: '/app/profile/verify',
                            },
                            // {
                            //     header: 'Mobile phone verification', link: '/app/profile/mobile-verify',
                            // },
                        ] : 
                        [
                            {
                                header: 'Personal Information', link: '/app/profile/personal-info',
                            },
                            {
                                header: 'Change Password', link: '/app/profile/change-backoffice-pass',
                            },
                        ]}
                    />
                      {
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
                        iconName={<RiCustomerServiceLine className={themeColor === "dark"? s.menuIcon: s.menuIconLight}/>}
                        link="/app/services"
                        index="services"
                        childrenLinks={ [
                            {
                                header: 'Iphone Trading Terminal', link: '/app/services/iphone-terminal',
                            },
                            {
                                header: 'Android Trading Terminal', link: '/app/services/android-terminal',
                            },
                            {
                                header: 'Register as Social Trading feed', link: '/app/services/register-social-trading',
                            },
                        ]} 
                    />
                    {
                     <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="REFER AND EARN"
                        isHeader
                        iconName={<AiOutlineLike className={themeColor === "dark"? s.menuIcon: s.menuIconLight}/>}
                        link="/app/refer"
                        index="refer"
                    />
                    }
                    {
                    ibStatus === "Approved" &&
                    <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="Your Referral List"
                        isHeader
                        iconName={<AiOutlineUserSwitch className={themeColor === "dark"? s.menuIcon: s.menuIconLight}/>}
                        link="/app/ib-clients"
                        index="ib-clients"
                    />
                    }
                    {
                    ibStatus === "Approved" &&
                    <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="IB Commission"
                        isHeader
                        iconName={<AiOutlineTransaction className={themeColor === "dark"? s.menuIcon: s.menuIconLight}/>}
                        link="/app/ib-commission"
                        index="ib-commission"
                    />
                    }
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
        ibStatus: store.auth.account?.ibStatus,
    };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
