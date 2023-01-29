import {
     LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS, VERIFY_STATUS, SET_ACCOUNT, SET_TRADING_ACCOUNT, SET_OFFER
} from '../actions/user';

export default function auth(state = {
    isFetching: false,
    username: "",
    isAuthenticated: false,
    account: null,
    tradingAccounts: null,
    offerNames: null,
    verifyStatus: "Pending",
}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: true,
                username: action.payload,
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                errorMessage: action.payload,
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isAuthenticated: false,
            });
        case VERIFY_STATUS:
            return Object.assign({}, state, {
                verifyStatus: action.payload,
            });
        case SET_ACCOUNT:
            return Object.assign({}, state, {
                account: action.payload,
            });
        case SET_TRADING_ACCOUNT:
            return Object.assign({}, state, {
                tradingAccounts: action.payload,
            });
        case SET_OFFER:
            return Object.assign({}, state, {
                offerNames: action.payload,
            });
        default:
            return state;
    }
}
