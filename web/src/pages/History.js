import React, { Component } from 'react';
import * as firebase from 'firebase';
import {
    Redirect
} from "react-router-dom";
import moment from 'moment';
import 'moment/locale/ko';
import catcherLogo from '../images/catcher-logo.png';
import defaultProfile from '../images/default-profile.jpg';
import '../stylesheets/History.css';

moment.locale('ko');

class History extends Component {
    constructor(props) {
        super(props);
        this.state     = {
            isAuthenticated: 'false',
            authType: '',
            pushToken: '',
            userConfig: {
                email: '',
                name: '',
                photoURL: '',
                uid: ''
            },
            verifyList: [],
        };
        this.auth       = firebase.auth();
        this.messaging = firebase.messaging();
        this.database  = firebase.database();
    }

    componentDidMount() {
        this.authListener();
        this.tokenRefreshListener();
    }

    componentWillUnmount() {
        this.authListener();
        this.tokenRefreshListener();
        this.database.ref().off();
    }

    initialMessaging(uid) {
        this.messaging.requestPermission()
            .then(() => {
                console.log('granted')
                return this.messaging.getToken()
            })
            .then((curToken) => {
                if (curToken) {
                    console.log('Get token successful :: ', curToken);
                    this.storeToken(curToken, uid);
                    this.setState({pushToken: curToken})
                } else {
                    console.log('Get token failed')
                }
            })
            .catch((err) => {
                console.log('Initial messaging failed :: ', err)
            })
    }

    tokenRefreshListener() {
        console.log('token listener')
        this.messaging.onTokenRefresh(() => {
            this.messaging.getToken()
                .then((refToken) => {
                    if (refToken) {
                        console.log('token was refreshed', refToken);
                        this.storeToken(refToken, this.auth.currentUser.uid);
                        this.setState({pushToken: refToken})
                    } else {
                        console.log('not exist token')
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }

    storeToken(token, uid) {
        const tokenRef = `users/${uid}/webPushToken`;
        this.database.ref(tokenRef).set(token);
    }

    authListener() {
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({isAuthenticated: true});
                this.getHistory(user.uid);
                this.initialMessaging(user.uid);
            } else {
                this.setState({isAuthenticated: false});
            }
        })
    }

    getHistory(uid) {
        const authRef    = `users/${uid}/authType`;
        const userRef    = `users/${uid}/userConfig`;
        const historyRef = `users/${uid}/verificationData`;

        this.database.ref(authRef).once('value', (snapshot) => {
            const authType = snapshot.val();
            this.setState({authType})
        });

        this.database.ref(userRef).once('value', (snapshot) => {
            const userConfig = snapshot.val();
            this.setState({userConfig})
        });

        this.database.ref(historyRef)
            .orderByChild('/time')
            .limitToLast(20)
            .on('value', (snapshot) => {
            const result = snapshot.val();
            if (result) {
                let verifyList = [];
                const keys     = Object.keys(result);
                keys.sort().reverse().every((key) => {
                    result[key].time = moment(parseInt(result[key].time));
                    return verifyList.push(result[key]);
                });
                this.setState({verifyList})
            }
        })
    }

    render() {
        const {isAuthenticated, authType, userConfig, verifyList} = this.state;
        const {history}                                           = this.props;
        return (
            <div>
                {
                    isAuthenticated ?
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div className="user-profile">
                                <img alt="profile" className="user-profile-img" src={defaultProfile}/>
                                <div className="user-config">
                                    <div>{`Login with ${authType.toUpperCase()}`}</div>
                                    <div>{`${userConfig.name} (${userConfig.email})`}</div>
                                </div>
                            </div>

                            <div className="logout-button" onClick={() => this._logoutByGoogle(history)}>
                                로그아웃
                            </div>
                            <div className="history-app-logo-wrapper">
                                <img alt="logo" className="history-app-logo" src={catcherLogo}/>
                            </div>
                            {
                                verifyList != null &&
                                verifyList.map((item, i) => {
                                    const {code, time} = item;
                                    return (
                                        <div className="history-item" key={i}>
                                            <div className="history-date">
                                                <div style={{
                                                    fontSize: 13,
                                                    color: '#9c9c9c'
                                                }}>{time.format('YYYY/MM/DD')}</div>
                                                <div style={{
                                                    fontSize: 15,
                                                    color: '#5e5e5e'
                                                }}>{time.format('HH:mm')}</div>
                                            </div>
                                            <div className="history-code">
                                                <div style={{fontSize: 13, color: '#9c9c9c'}}>인증번호</div>
                                                <div style={{fontSize: 19, color: '#7318c6', fontWeight:'bold'}}>{code}</div>
                                            </div>
                                            <div className="history-ago">
                                                <div style={{fontSize: 13, color: '#9c9c9c'}}>{time.fromNow()}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        :
                        <Redirect to="/"/>
                }
            </div>
        )
    }

    _logoutByGoogle(history) {
        console.log('google logout pushed button');
        this.auth.signOut()
            .then(() => {
                console.log('logout success, will be pushed root');
                history.push("/");
            })
            .catch((err) => alert('로그아웃 에러'))
    }
}

export default History