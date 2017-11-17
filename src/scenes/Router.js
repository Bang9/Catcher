import React, {Component} from "react";
import {Alert, BackHandler, Image, Platform, StatusBar, StyleSheet,
    TouchableOpacity, AsyncStorage ,View, Text, AppState,} from "react-native";

//modules
import {Actions, Reducer, Router, Scene, Drawer} from "react-native-router-flux";

//scenes
import Login from "./Login";
import Get from "./Get";
import MenuDrawer from './MenuDrawer';
import Guide from './Guide';

//services
import API from "../services/API"

//images
import MenuIcon from '../images/menu.png';

//global states
global.appState = AppState.currentState

/*
 Scene props = {
 tabBarStyle: ViewPropTypes.style,
 tabBarSelectedItemStyle: ViewPropTypes.style,
 tabBarIconContainerStyle: ViewPropTypes.style,
 tabBarShadowStyle: ViewPropTypes.style,
 tabSceneStyle: ViewPropTypes.style,
 tabStyle: ViewPropTypes.style,
 tabTitleStyle: Text.propTypes.style,
 tabSelectedTitleStyle: Text.propTypes.style,
 tabTitle: PropTypes.string,
 };
 */
class App extends Component {
    constructor(props){
        super(props)
        this.state={
            onLoading : true,
            authState : false,
            backPressedTime:0
        }
    }

    componentWillMount(){

        API.getAuth()
            .then( (data) => {
                if(data.result){
                    console.log("GET AUTH:",data)
                    this.setState({authState:true, onLoading:false})
                } else{
                    console.log('NO AUTH:',data)
                    this.setState({authState:false, onLoading:false})
                }
            })
    }

    componentDidMount(prevProps,prevState){
        AppState.addEventListener('change', (state)=>this.handleAppStateChange(state));
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', (state)=>this.handleAppStateChange(state));
    }

    handleAppStateChange(nextAppState){
        if (global.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
        }
        global.appState = nextAppState;
    }

    render(){
        if(this.state.onLoading){
            return(<View/>)
        }
        return(
            <Router
                navigationBarStyle={styles.navBar}
                titleStyle={styles.title}
                createReducer={(params)=>this.reducerCreate(params)}
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
                            key="get"
                            component={Get}
                            title="Catcher"
                            initial={this.state.authState}
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
                            initial={!this.state.authState}
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
        if (Actions.currentScene === "_get" || Actions.currentScene === "_login") {
            if(Date.now() > this.state.backPressedTime+2000) {
                this.setState({backPressedTime: Date.now()})
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

    reducerCreate(params){
        const defaultReducer = Reducer(params);
        console.log("PARAM:",params);
        return (state, action) => {
            //console.log("ACTION:", action);
            if (action.scene)
                console.log("ACTION:", [action.scene.sceneKey, action.scene.type]);
            if (action.scene && action.scene.sceneKey === 'get' &&
                (action.scene.type === 'REACT_NATIVE_ROUTER_FLUX_PUSH' || action.scene.type === 'REACT_NATIVE_ROUTER_FLUX_REFRESH')) {
                console.log('catch back to main');
            }
            this.sceneKey = action.scene ? action.scene.sceneKey : '';
            return defaultReducer(state, action);
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