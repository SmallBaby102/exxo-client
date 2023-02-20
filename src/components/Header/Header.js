import { connect } from "react-redux";
import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Input,
  UncontrolledAlert,
  Dropdown,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  ButtonGroup,
  Button,
  Form,
  FormGroup,
} from "reactstrap";
import s from "./Header.module.scss";
import "animate.css";
import { withRouter } from "react-router-dom";
import { AiOutlineLogin } from "react-icons/ai";
import { withTranslation } from 'react-i18next';

import PowerIcon from "../Icons/HeaderIcons/PowerIcon";
import SettingsIcon from "../Icons/HeaderIcons/SettingsIcon";
import BurgerIcon from "../Icons/HeaderIcons/BurgerIcon";
import SearchIcon from "../Icons/HeaderIcons/SearchIcon";


import { logoutUser } from "../../actions/user";
import {
  openSidebar,
  closeSidebar,
  changeSidebarPosition,
  changeSidebarVisibility,
  changeThemeColor
} from "../../actions/navigation";



import EnglishFlag from '../../assets/flags/english.png';
import VietnamFlag from '../../assets/flags/vn.png';

class Header extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebarPosition: PropTypes.string.isRequired,
    themeColor: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleSettingsDropdown = this.toggleSettingsDropdown.bind(this);
    this.toggleSettingsLang = this.toggleSettingsLang.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleSearchOpen = this.toggleSearchOpen.bind(this);

    this.state = {
      visible: true,
      settingsOpen: false,
      settingsLangOpen: false,
      searchFocused: false,
      searchOpen: false,
      telegramLink: "",
      lang: "en",
      languages: { 
        en: EnglishFlag,
        vn: VietnamFlag,
      }
    };
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  doLogout() {
    this.props.dispatch(logoutUser());
    this.props.history.push("/login");
  }


  toggleSettingsDropdown() {
    this.setState({
      settingsOpen: !this.state.settingsOpen,
    });
  }
  toggleSettingsLang() {
    this.setState({
      settingsLangOpen: !this.state.settingsLangOpen,
    });
  }

  toggleSearchOpen() {
    this.setState({
      searchOpen: !this.state.searchOpen,
    });
  }

  toggleSidebar() {
    this.props.isSidebarOpened
      ? this.props.dispatch(closeSidebar())
      : this.props.dispatch(openSidebar());
  }

  moveSidebar(position) {
    this.props.dispatch(changeSidebarPosition(position));
  }
  changeThemeColor(color) {
    this.props.dispatch(changeThemeColor(color));
  }

  toggleVisibilitySidebar(visibility) {
    this.props.dispatch(changeSidebarVisibility(visibility));
  }
  handleChange = (nextLanguage) => { 
    this.setState({lang: nextLanguage});
    this.props.i18n.changeLanguage(nextLanguage);
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
    const { t } = this.props;
    const { telegramLink } = this.state;
    const { themeColor } = this.props;
    return (
      <Navbar className={`d-print-none `}>
        <div className={s.burger}>
          <NavLink
              onClick={this.toggleSidebar}
              className={`d-md-none ${s.navItem} text-white`}
              href="#"
            >
              <BurgerIcon className={themeColor === "dark"? s.headerIcon: s.headerIconLight} />
            </NavLink>
        </div>
        <div className={`d-print-none ${s.root}`}>

          <Nav className="ml-md-0">
            {/* <NavItem className={`${s.divider} d-none d-sm-block`} /> */}
            <Dropdown
              className="d-none d-sm-block"
              nav
              isOpen={this.state.settingsOpen}
              toggle={this.toggleSettingsDropdown}
            >
              <DropdownToggle nav className={`${s.navItem} text-white`}>
                <SettingsIcon addId='header-settings' className={themeColor === "dark"? s.headerIcon: s.headerIconLight} />
              </DropdownToggle>
              <DropdownMenu className={`${s.dropdownMenu} ${s.settings}`}>
                <h6>Theme mode</h6>
                <ButtonGroup size="sm">
                  <Button
                    color="primary"
                    onClick={() => this.changeThemeColor("light")}
                    className={
                      this.props.themeColor === "light" ? "active" : ""
                    }
                  >
                    Light
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => this.changeThemeColor("dark")}
                    className={
                      this.props.themeColor === "dark" ? "active" : ""
                    }
                  >
                    Dark
                  </Button>
                </ButtonGroup>
              </DropdownMenu>
            </Dropdown>
            {/* <Dropdown
              className="d-none d-sm-block"
              nav
              isOpen={this.state.settingsLangOpen}
              toggle={this.toggleSettingsLang}
            >
              <DropdownToggle nav className={`${s.navItem} text-white`}>
                <img src={this.state.languages[lang]} alt="" className="language-flag" />
              </DropdownToggle>
              <DropdownMenu className={`${s.dropdownMenu} ${s.settingsLang}`}>
                <ul className="language-list">
                    <DropdownItem
                      tag="a"
                      href="#dropdownitem"
                      onClick={(ev) => {
                        ev.preventDefault();
                        this.handleChange("vn");
                      }}
                      className="language-item"
                    >
                      <img src={VietnamFlag} alt="" className="language-flag" />
                    </DropdownItem>
                    <DropdownItem
                      tag="a"
                      href="#dropdownitem"
                      onClick={(ev) => {
                        ev.preventDefault();
                        this.handleChange("en");
                      }}
                      className="language-item"
                    >
                      <img src={EnglishFlag} alt="" className="language-flag" />
                    </DropdownItem>
                  
                </ul>
              </DropdownMenu>
            </Dropdown> */}
            <NavItem>
              <NavLink
                className={`${s.navItem} text-white`}
                href={telegramLink}
                target="_blank"
              >
                  <img style={{ width: "20px", height:"20px"}} src="https://seeklogo.com/images/T/telegram-logo-E89B56AD97-seeklogo.com.png"></img>                                
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                onClick={this.doLogout}
                className={`${s.navItem} text-white`}
                href="#"
              >
                {
                  this.props.isAuthenticated ? 
                  <PowerIcon className={themeColor === "dark"? s.headerIcon: s.headerIconLight} /> :
                  <AiOutlineLogin className={themeColor === "dark"? s.headerIcon: s.headerIconLight} />
                }
                
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </Navbar>
    );
  }
}

function mapStateToProps(store) {
  return {
    isSidebarOpened: store.navigation.sidebarOpened,
    sidebarVisibility: store.navigation.sidebarVisibility,
    sidebarPosition: store.navigation.sidebarPosition,
    themeColor: store.navigation.themeColor,
    isAuthenticated: store.auth.isAuthenticated,
  };
}
export default withTranslation()(withRouter((connect(mapStateToProps)(Header))));
