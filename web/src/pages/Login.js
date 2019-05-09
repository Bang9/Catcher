import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'

import catcherLogo from '../images/catcher-logo.png';
import googleLogo from '../images/google-logo.png';
import facebookLogo from '../images/facebook-logo.png';

import '../stylesheets/Login.css';
import firebase from '../config/firebase';

class Login extends Component {
    constructor(){
        super();
        this.state={
            isAuthenticated:false,
            height:0
        }
        this.auth = firebase.auth();
    }
    componentDidMount(){
        this.authListener();
    }
    componentWillUnmount(){
        this.authListener();
    }

    authListener(){
        this.auth.onAuthStateChanged((user)=>{
            if(user){
                this.setState({
                    isAuthenticated:true
                })
            }else {
                this.setState({
                    isAuthenticated:false
                })
            }
        })
    }
    render(){
        const {isAuthenticated} = this.state;
        const {location} = this.props;
        return(
            <div>{
                isAuthenticated ?
                    <Redirect to='/history' />
                    :
                    location.pathname === "/" ?
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:window.innerHeight*.7}}>
                            <img alt="logo" src={catcherLogo} style={{height: 100, width: 100, margin: 30}}/>
                            < div className="login-form">
                                <button className="google-login" onClick={(ev) => this._loginByGoogle(ev)}>
                                    <div className="google-login-logo">
                                        <img alt={'google-logo'} src={googleLogo} height="20" width="20"/>
                                    </div>
                                    <div className="google-login-title">구글 로그인</div>
                                </button>

                                <button className="facebook-login" onClick={(ev) => {
                                    alert('준비중입니다.')
                                    //this._loginByGoogle(ev)
                                }
                                }>
                                    <div className="facebook-login-logo">
                                        <img alt={'facebook-logo'} src={facebookLogo} height="20" width="20"/>
                                    </div>
                                    <div className="facebook-login-title">페이스북 로그인</div>
                                </button>
                            </div>
                        </div>
                        :
                        null
            }
            </div>
        )
    }

    _loginByGoogle(ev){
        console.log('Google Login Submit');
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            let token = result.credential.accessToken;
            // The signed-in user info.
            let user = result.user;
            console.log(user,token)

        }).catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // The email of the user's account used.
            let email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            let credential = error.credential;

            console.log(errorCode,errorMessage,email,credential)
        });
        ev.preventDefault();
    }
}

export default Login