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
    StatusBar,
    ScrollView,
    Dimensions
} from 'react-native';
import firebase from '../commons/Firebase';
import API from '../services/API';
import moment from 'moment';
import ko from 'moment/locale/ko';

moment.locale('ko');

const {width, height} = Dimensions.get('window');
export default class Main extends Component {
    constructor() {
        super();
        this.state     = {
            verifyList: [],
        }
        this.spinValue = new Animated.Value(0);
    }

    componentDidMount() {
        console.log('DID MOUNT');
        this.onHistory();
        this.spin();
    }

    componentWillUnmount() {
        API.getDataOff()
    }

    spin() {
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

    onHistory() {
        const uid        = API.getUid();
        const historyRef = `users/${uid}/verificationData`;

        firebase.database().ref(historyRef).orderByChild('/time').limitToLast(20).on('value', (snapshot) => {
            const result = snapshot.val();
            if (result) {
                let verifyList = [];
                const keys     = Object.keys(result);
                keys.sort().reverse().some((key) => {
                    result[key].time = moment(parseInt(result[key].time));
                    verifyList.push(result[key])
                });
                this.setState({verifyList})
            }
        })
        /*        API.getDataOn(historyRef, (snapshot)=>{
         const result = snapshot.val();
         if(result){
         const keys = Object.keys(result);
         let verifyList = [];
         keys.some( (key)=>{ verifyList.push(result[key])} );
         console.log(verifyList)
         this.setState({verifyList})
         }
         })*/

    }

    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })

        const {verifyList} = this.state;
        return (
            <View style={styles.container}>
                {
                    <View style={{alignItems: 'center'}}>
                        <View style={{marginVertical: 5,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Animated.Image
                                resizeMode={Image.resizeMode.contain}
                                style={{
                                    transform: [{rotate: spin}],
                                    width: 30, height: 30,
                                    alignSelf: 'center'
                                }}
                                source={require('../images/Catcher.png')}
                            />
                            <Text>인증 히스토리</Text>
                        </View>
                        <ScrollView style={{flex: 1}}>
                            {
                                verifyList != null &&
                                verifyList.map((item, i) => {
                                    const {code, time} = item;
                                    return (
                                        <View key={i} style={styles.historyContainer}>
                                            <View style={{alignItems: 'flex-start', position: 'absolute', left: 15}}>
                                                <Text style={{
                                                    fontSize: 11,
                                                    lineHeight: 14,
                                                    color: '#9c9c9c'
                                                }}>{time.format('YYYY/MM/DD')}</Text>
                                                <Text style={{
                                                    fontSize: 14,
                                                    lineHeight: 14,
                                                    color: '#5e5e5e'
                                                }}>{time.format('HH:mm')}</Text>
                                            </View>
                                            <View style={{flex: 1, alignItems: 'center'}}>
                                                <Text
                                                    style={{fontSize: 10, lineHeight: 12, color: '#9c9c9c'}}>인증번호</Text>
                                                <Text style={{
                                                    fontSize: 18,
                                                    lineHeight: 19,
                                                    color: '#7318c6'
                                                }}>{code}</Text>
                                            </View>
                                            <View style={{alignItems: 'flex-end', position: 'absolute', right: 15}}>
                                                <Text style={{fontSize: 11, color: '#9c9c9c'}}>{time.fromNow()}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
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
    historyContainer: {
        flexDirection: 'row',
        marginBottom: 6,
        paddingVertical: 20,
        width: width,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7'
    }
});

