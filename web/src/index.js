import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import App from './pages/App';
import registerServiceWorker from './services/registerServiceWorker';
import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDCiZ3bcSplClhvDBtQleH0gAgY9fOg97c",
    authDomain: "catch-7e353.firebaseapp.com",
    databaseURL: "https://catch-7e353.firebaseio.com",
    projectId: "catch-7e353",
    storageBucket: "catch-7e353.appspot.com",
    messagingSenderId: "216812482275"
};
firebase.initializeApp(config);
registerServiceWorker();

ReactDOM.render(<App />, document.getElementById('root'));