import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import App from './pages/App';
import registerServiceWorker from './services/registerServiceWorker';
import * as firebase from 'firebase';

const config = {};
firebase.initializeApp(config);
registerServiceWorker();

ReactDOM.render(<App />, document.getElementById('root'));
