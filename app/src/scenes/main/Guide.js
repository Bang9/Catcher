
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
    Dimensions,
    TouchableOpacity
} from 'react-native';

import Swiper from 'react-native-swiper';
import {Actions} from 'react-native-router-flux';
import Theme from "../../commons/Theme";

const {width,height} = Dimensions.get('window')

export default class Get extends Component {
    constructor(){
        super();
        this.state={
        }
        this.upValue = new Animated.Value(0);
    }
    componentDidMount(){
        this.animate();
    }
    animate () {
        Animated.timing(
            this.upValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.bounce,
            }
        ).start()
    }
    render() {
        const moveUp = this.upValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 275, 550]
        })
        return (
            <View style={styles.container}>

                <View style={{flex:1,width:width, justifyContent:'flex-end'}}>
                    <Swiper
                        loop={false}
                        showsPagination={true}
                        dotStyle={{width:5,height:5}}
                        activeDotStyle={{width:7,height:7,backgroundColor:'#333'}}
                    >
                        <Slide
                            source={require('../../images/guide_1.png')}
                            text={"\n캐쳐는 여러분의 인증을\n더욱 쉽고 빠르게 도와줍니다."}
                        />
                        <Slide
                            source={require('../../images/guide_2.png')}
                            text={"\n메세지를 통해서\n인증번호가 도착하면"}
                        />
                        <Slide
                            source={require('../../images/guide_3.png')}
                            text={"스마트폰에서는 팝업 메시지로\n스마트폰이 멀리있어도\n웹으로 인증번호를 빠르고 쉽게 제공합니다"}
                            button={true}
                        />
                    </Swiper>
                </View>

                <Animated.View
                    style={{
                        position:'absolute',
                        bottom:moveUp,
                        flexDirection:'row'
                    }}
                >
                    <Image
                        resizeMode={"contain"}
                        style={{width:40,height:40, alignSelf:'center'}}
                        source={require('../../images/Catcher.png')}
                    />

                    <Text style={{fontSize:20,alignSelf:'center',color:'#9a34b9',fontWeight:'800'}}>CATCHER</Text>
                </Animated.View>

                <StatusBar
                    animated={true}
                    hidden={true}
                />
            </View>
        );
    }
}
class Slide extends Component{
    render(){
        return(
            <View style={styles.slide}>
                <View style={{flex:0.6, justifyContent:'flex-end'}}>
                    <Image
                        resizeMode={"contain"}
                        style={{width:200,height:200, alignSelf:'center', tintColor:'#3aa0ff'}}
                        source={this.props.source}
                    />
                </View>

                <View style={{flex:0.4,paddingTop:20}}>
                    <Text style={styles.text}>
                        {this.props.text}
                    </Text>
                </View>

                {
                    this.props.button &&
                    <TouchableOpacity
                        onPress={()=>Actions.pop()}
                        style={{position:'absolute',bottom:60,width:250,height:50,backgroundColor:Theme.blue, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{fontSize:15, color:'#fff', fontWeight:'700'}}>확 인</Text>
                    </TouchableOpacity>
                }
            </View>
        )
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
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text:{
        textAlign:'center',
        fontSize:14,
        color:'#444',
        lineHeight:28,
    }
});