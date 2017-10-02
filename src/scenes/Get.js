/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    Easing,
    StatusBar
} from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import API from '../services/API';

export default class Get extends Component {
    constructor(){
        super();
        this.state={
            code:null,
        }
        this.spinValue = new Animated.Value(0);
    }
    componentDidMount(){
        console.log('DID MOUNT');
        SmsListener.addListener(message => {
            console.log('GET MESSAGE');
            let verificationCodeRegex = /([\d]{6})/
            if (verificationCodeRegex.test(message.body)) {
                let verificationCode = message.body.match(verificationCodeRegex)[1]
                let verificationData = {
                    code : verificationCode,
                    time : Date.now()
                }
                this.setState({code:verificationCode},()=>console.log('SET STATE'));
                let ref = `users/${API.getUid()}/verificationData`
                API.writeData(ref,verficationData);
            }
            console.info(message)
        })

        this.spin();
    }
    spin () {
        if(this.state.code!=null) return;
        this.spinValue.setValue(0);
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear
            }
        ).start(() => this.spin())
    }

    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        return (
            <View style={styles.container}>
                {
                    this.state.code ?
                        <View style={{alignItems:'center'}}>
                            <Text style={{fontSize: 20}}>인증번호</Text>
                            <Text style={{fontSize:40, color:'#a339c5'}}>{this.state.code}</Text>
                        </View>
                        :
                        <View style={{alignItems:'center'}}>
                            <Animated.Image
                                resizeMode={Image.resizeMode.contain}
                                style={{
                                    transform: [{rotate: spin}],
                                    width:60,height:60,
                                    alignSelf:'center'
                                }}
                                source={require('../images/Catcher.png')}
                            />
                        <Text>대기중</Text>
                        </View>
                }

                <StatusBar
                    animated={true}
                    backgroundColor="#6217B1"
                    barStyle="light-content"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

