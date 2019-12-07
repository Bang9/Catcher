import React, { Component } from 'react';
import {Row,Modal} from 'react-materialize';
import '../stylesheets/App.css';
import {Link, Route, BrowserRouter as Router,Redirect} from 'react-router-dom'
import {Bounce} from 'react-activity';
import 'react-activity/dist/react-activity.css';
import firebase from 'firebase';
import logo from '../images/catcher-logo.png';
import Login from './Login';
import History from './History';
import Privacy from './Privacy';
import Service from './Service';

const $ = (query) => {
    return document.querySelector(query)
}

class App extends Component {
    constructor(props){
        super(props);
        this.state={
            isAuthenticated:false,
            isLoaded:true,
            notification:{
                title:'',
                body:'',
                icon:'',
                click_action:''
            }
        };
        this.messaging = firebase.messaging();
        this.auth = firebase.auth();
    }

    componentWillMount(){
        this.messageListener();
        setTimeout(()=>this.authListener(),1500)
    }

    componentDidMount(){
        console.log('MAIN::CURRENT USER::',firebase.auth().currentUser)
    }

    componentWillUnmount(){
        this.messageListener();
        this.authListener();
    }

    messageListener(){
        this.messaging.onMessage( (payload)=>{
                console.log('Get push message on foreground ::',payload);
                const {notification} = payload;
                this.setState({notification},()=>this.showModal())
            }
        )
    }

    authListener(){
        this.auth.onAuthStateChanged((user)=>{
            console.log('auth changed::',user)
            if(user){
                this.setState({
                    isAuthenticated:true,
                    isLoaded:false
                })
            }else {
                this.setState({
                    isAuthenticated:false,
                    isLoaded:false
                })
            }
        })
    }

    showModal(){
        $('#trigger').click()
    }

    render() {
        const {notification,isAuthenticated,isLoaded} = this.state;
        console.log("props",this.props)
        return (
            <Router>
                <div className="App-container">
                    <Row className="App">
                        <div className="App-header">
                            <a href="/"><h1 className="App-title">Catcher</h1></a>
                        </div>
                        <div className="App-body">
                            <div>
                                {
                                    isLoaded ?
                                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:window.innerHeight*.7}}>
                                            <Bounce color="#727981" size={30} speed={1} />
                                        </div>
                                        :
                                        <div>
                                            <Route path="/" component={Login}></Route>
                                            <Route path="/history" component={History}></Route>
                                            <Route path="/service" component={Service}></Route>
                                            <Route path="/privacy" component={Privacy}></Route>
                                        </div>
                                }

                            </div>

                            <Modal
                                modalOptions={{dismissible:false}}
                                bottomSheet
                                trigger={<div id='trigger'></div>}
                            >
                                <div style={{display:'flex',flexDirection:'row',justifyContent:'center', alignItems:'center',position:'absolute',top:'50%',left:'50%',transform:'translateX(-50%) translateY(-50%)',}}>
                                    <div style={{display:'flex',justifyContent:'center', alignItems:'center'}}>
                                        <img alt="logo" style={{width:70,height:70,marginRight:10}} src={logo} />
                                    </div>
                                    <div style={{display:'flex',flexDirection:'column',justifyContent:'center', alignItems:'center'}}>
                                        <div style={{fontWeight:'bold',fontSize:30}}>{notification.title}</div>
                                        <div style={{fontSize:14}}>{notification.body}</div>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                        <div className="App-footer">
                            <a href='https://play.google.com/store/apps/details?id=com.bang9dev.catcher&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1' style={{right:15, display:'flex', alignItems:'center',justifyContent:'center'}}>
                                <img alt='다운로드하기 Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' style={{width:'130px'}} />
                            </a>
                            <p style={{marginLeft:'10px',marginRight:'10px',fontSize:'13px'}}> | </p>
                            <Link to="/service" style={{color:'grey',fontSize:'13px'}}>이용약관</Link>
                            <p style={{marginLeft:'10px',marginRight:'10px',fontSize:'13px'}}> | </p>
                            <Link to="/privacy" style={{color:'grey',fontSize:'13px'}}>개인정보처리방침</Link>
                        </div>
                    </Row>
                </div>
            </Router>
        );
    }
}


export default App;
