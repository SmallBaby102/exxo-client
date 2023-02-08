import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { BrowserRouter as Router,Switch, Route, useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import jwt_decode from 'jwt-decode';
import { setNews } from '../actions/post'
import '../styles/theme.scss';

import api from '../utils/api'
import { setChecking } from '../actions/navigation';
import { logoutUser, setAccount } from '../actions/user';
const PrivateRoute = ({dispatch, component, ...rest }) => {
    const checking = useSelector(state => state.navigation.checking);
    const account = useSelector(state => state.auth.account);
    const location = useLocation();
    const history = useHistory();
    useEffect(() => {
      const token = localStorage.getItem('authenticated');

      if( !token || typeof token === "boolean" ) {
        history.push("/login");
        return;
      }
      try {
        const decoded = jwt_decode(token);
        console.log("token decode", decoded)
        if ( decoded.exp < Date.now() / 1000 ) {
            dispatch(logoutUser());
            history.push("/login");
            return;
        } else {
          if(!account){
              const temp =  JSON.parse(localStorage.getItem("account"));
              console.log("account", temp)
              dispatch(setAccount(temp));
          }
        }
      }
      catch(err) {
            history.push("/login");
      }
     

    }, [ location.pathname ])
    return ( // eslint-disable-line
              <LoadingOverlay active={checking} spinner>
                  <Route {...rest} render={props => (React.createElement(component, props))}/>
              </LoadingOverlay>
          );
};

export default PrivateRoute;
