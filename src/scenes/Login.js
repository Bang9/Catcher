import React, {Component} from "react";
import {Dimensions, Image, StyleSheet, TextInput, View, Text, Alert, ScrollView,StatusBar} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import {Actions} from 'react-native-router-flux'
import API from '../services/API'
import Button from "../components/Button";
import Icon from 'react-native-vector-icons/Ionicons'
const {width,height} = Dimensions.get('window');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginType: 'none',
            showSpinner: false,
        }
    }
    render() {

        const loginView=(
            <View style={styles.loginContainer}>
                <Button
                    title="페이스북 로그인"
                    icon = {<Icon name="logo-facebook" style={{fontSize:25,color:'#3B5998'}}/>}
                    color={'#fff'}
                    titleStyle={{color:'#3B5998'}}
                    buttonStyle={{margin:10,width: width * .8,borderColor:'#3e80c2',borderWidth:0.5,borderRadius:0,height:50, elevation:1.5}}
                    onClick={() =>{this.login_social('facebook')}}
                />

                <Button
                    title="구글 로그인"
                    icon = {<Image source={{uri:'https://developers.google.com/identity/images/g-logo.png'}} style={{width:20,height:20,}}/>}
                    color={'#fff'}
                    titleStyle={{color:'#444'}}
                    buttonStyle={{margin:10,width: width * .8,borderColor:'#c8c8c8',borderWidth:0.5,borderRadius:0,height:50, elevation:1.5}}
                    onClick={() =>{this.login_social('google')}}
                />
            </View>
        )

        return (
            <ScrollView
                style={{backgroundColor:'#fff'}}>

                <StatusBar
                    animated={true}
                    backgroundColor="#6217B1"
                    barStyle="light-content"
                />

                <View style={{marginTop:150}}>
                <Image
                    resizeMode={Image.resizeMode.contain}
                    style={{width:120,height:120, alignSelf:'center'}}
                    source={require('../images/Catcher.png')}
                />
                {loginView}
                </View>
                <Spinner visible={this.state.showSpinner}/>
            </ScrollView>
        )
    }

    login_callback(isCancel){
        if(isCancel)
            return this.setState({showSpinner:false})
        else
            return this.setState({showSpinner:false},()=>Actions.get())
    }

    login_social(type){
        this.setState({loginType:type,showSpinner:true});
        API.login(type, (isCancel)=>this.login_callback(isCancel))
    }
}

const styles = StyleSheet.create({
    logoContainer : {
        marginTop:80,
        alignItems:'center',
        justifyContent:'center',
    },
    loginContainer : {
        paddingVertical:40,
        justifyContent:'center',
        alignItems:'center',
    },
    inputContainer : {
        paddingLeft:35,
        width:width*.8,
        right:10,
    },
    iconStyle : {
        width: 20,
        height: 20,
        alignSelf: 'center',
        left: 15
    },
    inputBox:{
        flexDirection: 'row',
        borderWidth:1,
        borderColor:'#bfbfbf',
        borderRadius:30,
        margin:5
    }

})

export default Login;