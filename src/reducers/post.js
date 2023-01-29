import { SET_NEWS } from '../actions/post';

export default function post(state = {
    news: [],
}, action) {
    switch (action.type) {
        case SET_NEWS:
            return Object.assign({}, state, {
                news: action.payload,
            });
        default:
            return state; 
    }
}
