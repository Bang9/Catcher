import React, {Component} from "react";
import {ActivityIndicator, BackHandler, Image, Platform, StatusBar, StyleSheet,
    TouchableOpacity, AsyncStorage ,View, Text, AppState, ToastAndroid} from "react-native";

//modules
import {Actions, Reducer, Router, Scene, Drawer} from "react-native-router-flux";
import {auth} from "react-native-firebase";
//scenes
import Login from "./Login";
import Main from "./Main";
import MenuDrawer from './MenuDrawer';
import Guide from './Guide';

//services
import API from "../services/API"

//images
import MenuIcon from '../images/menu.png';
import Theme from "../commons/Theme";

//global states
global.appState = AppState.currentState

class App extends Component {
    constructor(props){
        super(props);
        this.state={
            loading : true,
            authenticated : false,
        };
        this.backPressedTime=0
    }

    componentWillMount(){

    }

    componentDidMount(prevProps,prevState){
        auth().onAuthStateChanged((user)=>{
            if(user){
                this.setState({
                    loading: false,
                    authenticated: true
                })
            }else{
                this.setState({
                    loading: false,
                    authenticated: false
                })
            }
        })
    }



    render(){
        const {loading, authenticated} = this.state;

        if(loading){
            return(<ActivityIndicator size={"large"} style={{flex:1}} color={Theme.purple}/>)
        }

        return(
            <Router
                navigationBarStyle={styles.navBar}
                titleStyle={styles.title}
                backAndroidHandler={()=>this.onBackHandler()} >

                <Scene key="root">
                    <Scene
                        key="drawer"
                        drawer
                        contentComponent={MenuDrawer}
                        hideNavBar
                        drawerPosition="right"
                    >
                        {/* Main */}
                        <Scene
                            key="main"
                            component={Main}
                            title="Catcher"
                            initial={authenticated}
                            renderRightButton={()=>{
                                return (
                                    <TouchableOpacity onPress={()=>Actions.drawerOpen()}>
                                        <Image style={{right:10,width:30,height:30,tintColor:'#fff'}} source={require('../images/menu.png')}/>
                                    </TouchableOpacity>
                                )}}
                            renderLeftButton={()=>null}
                        />

                        {/* Sign */}
                        <Scene
                            key="login"
                            component={Login}
                            hideNavBar={true}
                            sceneStyle ={{marginTop:0}}
                            initial={!authenticated}
                        />
                    </Scene>

                    {/* Guide */}
                    <Scene
                        key="guide"
                        component={Guide}
                        hideNavBar={true}
                        title="Catcher"
                    />
                </Scene>

            </Router>
        )
    }

    onBackHandler() {
        console.log('BackHandler:this.sceneKey:' + Actions.currentScene);
        if (Actions.currentScene === "main" || Actions.currentScene === "login") {
            if(Date.now() > this.backPressedTime+2000) {
                this.backPressedTime = Date.now();
                ToastAndroid.show('뒤로 버튼을 한번 더 누르면 종료됩니다.', ToastAndroid.SHORT);
                return true; //remain in app
            }else{
                return BackHandler.exitApp()
            }
        } else {
            try {
                Actions.pop();
                return true;
            } catch (e) {
                console.log('onBackHandler:pop failed -maybe at root?');
                return false;
            }
        }
    }
}

const styles = StyleSheet.create({
    navBar:{
        backgroundColor : '#7318c6',
        borderBottomColor:'#ffffff00',

    },
    scene: {
        flex :1,
        marginTop : (Platform.OS === 'ios') ? 64 : 54,
        backgroundColor:'#fff'
    },
    title: {
        fontSize: 17,
        fontWeight: "600",
        color:'white',
        alignSelf:'center'
    }
});

export default App;

console.ignoredYellowBox = ['setting a timer'];