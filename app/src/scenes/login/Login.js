import React, {Component} from "react";
import {Dimensions, Image, StyleSheet, TextInput, View, Text, Alert, ScrollView,StatusBar} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import {Actions} from 'react-native-router-flux'
import API from '../../services/API'
import Button from "../../components/Button";
import Theme from "../../commons/Theme";
const {width,height} = Dimensions.get('window');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSpinner: false,
        }
    }
    render() {
        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>

                <StatusBar
                    animated={true}
                    backgroundColor={Theme.purple}
                    barStyle="light-content"
                />

                <View style={{flex:1, justifyContent:"flex-end"}}>
                    <Image
                        resizeMode={"contain"}
                        style={{width:120,height:120, alignSelf:'center'}}
                        source={require('../../images/Catcher.png')}
                    />
                </View>
                <View style={{flex:1, justifyContent:"flex-start"}}>
                    {this.renderLoginButton()}
                </View>
                <Spinner visible={this.state.showSpinner}/>
            </View>
        )
    }


    renderLoginButton = () => {
        return(
            <View style={styles.loginContainer}>
                <Button
                    title="구글 로그인"
                    icon = {<Image source={{uri:'https://developers.google.com/identity/images/g-logo.png'}} style={{width:20,height:20}}/>}
                    color={'#fff'}
                    titleStyle={{color:'#444'}}
                    buttonStyle={{margin:10,width: width * .8,borderColor:'#c8c8c8',borderWidth:0.5,borderRadius:0,height:50, elevation:1.5}}
                    onClick={this.login}
                />
            </View>
        )
    };

    login = () => {
        Actions.termsModal({callback:(agree)=>{
                if(agree){
                    this.setState({showSpinner:true});

                    API.login((success)=>{
                        if(success){
                            this.setState({showSpinner:false},Actions.main)
                        } else {
                            this.setState({showSpinner:false})
                        }
                    })
                } else {
                    return;
                }
            }}
        );
    };
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