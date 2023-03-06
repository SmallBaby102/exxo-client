export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const VERIFY_STATUS = 'VERIFY_STATUS';
export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_TRADING_ACCOUNT = 'SET_TRADING_ACCOUNT';
export const SET_OFFER = 'SET_OFFER';
export const SOCIAL_TRADING_APPLIED = 'SOCIAL_TRADING_APPLIED';

export function receiveLogin(payload) {
    return {
        type: LOGIN_SUCCESS,
        payload
    };
}
export function setVerifyStatus(payload) {
    return {
        type: VERIFY_STATUS,
        payload
    };
}
export function setAccount(payload) {
    return {
        type: SET_ACCOUNT,
        payload
    };
}
export function setTradingAccounts(payload) {
    return {
        type: SET_TRADING_ACCOUNT,
        payload
    };
}
export function setOfferNames(payload) {
    return {
        type: SET_OFFER,
        payload
    };
}

function loginError(payload) {
    return {
        type: LOGIN_FAILURE,
        payload,
    };
}

function requestLogout() {
    return {
        type: LOGOUT_REQUEST,
    };
}

export function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
    };
}

// Logs the user out
export function logoutUser() {
    return (dispatch) => {

        dispatch(requestLogout());
        localStorage.removeItem('authenticated');
        dispatch(receiveLogout());
    };
}

export function loginUser(creds) {
    return (dispatch) => {
        dispatch(receiveLogin(creds.email));
    }
}
