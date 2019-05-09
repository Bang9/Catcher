import React,{Component} from 'react';
import { StyleSheet, Text, View, ViewPropTypes,Image, TouchableNativeFeedback, Dimensions, } from 'react-native';

import { Actions } from 'react-native-router-flux';
import PropTypes from "prop-types";

import API from '../services/API';
import firebase from '../commons/Firebase'
const {width,height} = Dimensions.get('window');


class MenuDrawer extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        sceneStyle: ViewPropTypes.style,
        title: PropTypes.string,
    }

    static contextTypes = {
        drawer: PropTypes.object,
    }

    constructor(){
        super();
        this.state={
            authType:null,
            userConfig:{
                photoURL:null,
                name:null,
                email:null,
                uid:null,
            }
        }
        this.initState=this.state;
    }

    componentDidMount(){
        console.log('drawer did mounted')
        this.unsubscribe = firebase.auth().onAuthStateChanged( (user)=>{
                console.log('auth changed',user)
                if(user){
                    let ref = `users/${user.uid}/`
                    API.getDataOnce(ref + 'userConfig')
                        .then(data => this.setState({userConfig: data.val()}))
                    API.getDataOnce(ref + 'authType')
                        .then(data => this.setState({authType: data.val()}))
                }
            })
    }

    componentWillUnmount(){
        console.log('drawer did unmounted')
        this.unsubscribe();
    }

    render() {
        const profile_photo = {uri:this.state.userConfig.photoURL}
        const logged_in = (
            <View style={styles.profileContainer}>
                <Image
                    style={styles.profilePhoto}
                    source={profile_photo}
                />
                <View style={styles.profileUserConfig}>
                    <Text style={{fontSize:10}}>{"Login with "+this.state.authType}</Text>
                    <Text style={{fontSize:15,color:'#555'}}>{this.state.userConfig.name}</Text>
                </View>
            </View>
        )
        const logged_out = (
            <View style={styles.profileContainer}>
                <View style={styles.profileUserConfig}>
                    <Text style={{fontSize:15,color:'#cb7cfc'}}>로그인 해주세요</Text>
                </View>
            </View>
        )
        const profile_view = this.state.authType!=null ? logged_in : logged_out

        return (
            <View style={styles.container}>
                {profile_view}
                <Spliter style={{marginTop:20}}/>

                <TouchableNativeFeedback
                    onPress={()=>Actions.guide()}>
                    <View style={{width:width*.8,height:50,justifyContent:'center',alignItems:'center'}}>
                        <Text>How to use</Text>
                    </View>
                </TouchableNativeFeedback>
                <Spliter/>

                <TouchableNativeFeedback
                    onPress={()=>{null}}>
                    <View style={{width:width*.8,height:50,justifyContent:'center',alignItems:'center'}}>
                        <Text>설정</Text>
                    </View>
                </TouchableNativeFeedback>
                <Spliter/>
                {
                    this.state.authType!=null &&
                    <View>
                        <TouchableNativeFeedback
                            onPress={
                                ()=>API.logout(this.state.authType, ()=>{
                                    Actions.login()
                                    this.setState({authType:null})
                                })
                            }
                        >
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