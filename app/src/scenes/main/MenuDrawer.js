import React,{Component} from 'react';
import { StyleSheet, Text, View, ViewPropTypes,Image, TouchableNativeFeedback, Dimensions,Alert, Linking } from 'react-native';

import { Actions } from 'react-native-router-flux';
import PropTypes from "prop-types";

import API from '../../services/API';
import firebase from "react-native-firebase";
const {width,height} = Dimensions.get('window');


class MenuDrawer extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        sceneStyle: ViewPropTypes.style,
        title: PropTypes.string,
    };

    static contextTypes = {
        drawer: PropTypes.object,
    };

    constructor(){
        super();
    }

    renderProfile = () => {
        console.log(firebase.auth().currentUser)
        return(
            <View style={styles.profileContainer}>
                <Image
                    style={styles.profilePhoto}
                    source={{uri:firebase.auth().currentUser ? firebase.auth().currentUser.providerData[0].photoURL : ""}}
                />
                <View style={styles.profileUserConfig}>
                    <Text style={{fontSize:15,color:'#555'}}>{firebase.auth().currentUser ? firebase.auth().currentUser.displayName : "로그인 해주세요"}</Text>
                </View>
            </View>
        )
    };

    render() {
        return (
            <View style={styles.container}>
                {
                    this.renderProfile()
                }

                <Spliter style={{marginTop:20}}/>

                <TouchableNativeFeedback
                    onPress={()=>Actions.guide()}>
                    <View style={{width:width*.8,height:50,justifyContent:'center',alignItems:'center'}}>
                        <Text>How to use</Text>
                    </View>
                </TouchableNativeFeedback>

                <Spliter/>

                <TouchableNativeFeedback
                    onPress={()=>Linking.openURL("https://catch-7e353.firebaseapp.com/")}>
                    <View style={{width:width*.8,height:50,justifyContent:'center',alignItems:'center'}}>
                        <Text>캐쳐 웹사이트</Text>
                    </View>
                </TouchableNativeFeedback>

                <Spliter/>

                <TouchableNativeFeedback
                    onPress={this.leave}>
                    <View style={{width:width*.8,height:50,justifyContent:'center',alignItems:'center'}}>
                        <Text>탈퇴하기</Text>
                    </View>
                </TouchableNativeFeedback>

                <Spliter/>

                {
                    firebase.auth().currentUser &&
                    <View>
                        <TouchableNativeFeedback onPress={this.logout}>
                            <View style={{width:width*.8,height:50,justifyContent:'center',alignItems:'center'}}>
                                <Text>로그아웃</Text>
                            </View>
                        </TouchableNativeFeedback>
                        <Spliter/>
                    </View>
                }
            </View >
        );
    }

    leave = () => {
        Alert.alert("알림","정말 탈퇴하시겠어요?\n모든 민감한 정보는 즉시 안전하게 삭제됩니다.",
            [
                {
                    text: '취소',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: '탈퇴하기',
                    onPress: ()=>API.leave((success)=>{
                        if(success){
                            Actions.login();
                        }else{
                            alert("탈퇴 실패")
                        }
                    })
                },
            ]
        )
    };

    logout = () => {
        Alert.alert("알림","로그아웃 하시겠어요?",
            [
                {
                    text: '취소',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: '로그아웃',
                    onPress: ()=>API.logout((success)=>{
                        if(success){
                            Actions.login();
                        }else{
                            alert("로그아웃 실패")
                        }
                    })
                },
            ]
        )
    }
}
class Spliter extends Component{
    render(){
        return(
            <View style={[{width:width*.8,height:1,backgroundColor:'#eee'},this.props.style]}/>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginVertical:15,
    },
    profileContainer:{
        flexDirection:'row',
        marginTop:15,
        marginBottom:5,
        height:70,
        //backgroundColor:'#f9f9f9'
    },
    profilePhoto:{
        width:50,
        height:50,
        borderRadius:50,
        alignSelf:'center',
        borderWidth:0.5,
        borderColor:'#ccc'
    },
    profileUserConfig:{
        paddingHorizontal:20,
        alignSelf:'center'
    },
    profileButtonWrapper:{
        justifyContent:'center',
        alignItems:'center',
        height:80,
        width:60
    },
    profileButton:{
        width:25,
        height:25,
        tintColor:'#bbb',
    }
});

export default MenuDrawer;