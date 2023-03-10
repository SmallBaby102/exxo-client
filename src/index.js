import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

import * as serviceWorker from './serviceWorker';
import App from './components/App';
import reducers from './reducers';

import "./styles/custom.css"
import posthog from 'posthog-js'

posthog.init('phc_tPpLYM0nd6raQ0TjlpeWU56DVMmCn4L0uHC9eAKxY2m', { api_host: 'https://app.posthog.com' });

const store = createStore(
  reducers,
  applyMiddleware(ReduxThunk)
);

ReactDOM.render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
