import {toast} from 'react-toastify';

export const SET_NEWS = 'SET_NEWS';

export function setNews(payload) {
    return {
        type: SET_NEWS,
        payload,
    };
}
