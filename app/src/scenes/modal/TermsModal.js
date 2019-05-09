import React, {Component} from "react";
import {View, Linking, TouchableOpacity, Text, Dimensions, CheckBox} from "react-native";

import Modal from "react-native-modal";
import {Actions} from "react-native-router-flux";
import Theme from "../../commons/Theme";

const {width,height} = Dimensions.get('window');

export default class TermsModal extends Component {
    static defaultProps = {
        text:"",
        action:()=>{}
    };

    constructor(props) {
        super(props);
        this.state = {
            isVisible:true,
            agree:false,
        }
    }

    componentDidMount = () => {
    };

    componentWillUnmount = () => {
    };

    render() {
        return (
            <View>
                <Modal
                    useNativeDriver={true}
                    animationIn={"fadeIn"}
                    animationOut={"fadeOut"}
                    onBackdropPress={this._hideModal}
                    onBackButtonPress={this._hideModal}
                    onModalHide={Actions.pop}
                    isVisible={this.state.isVisible}
                >
                    <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
                        <View
                            style={{
                                paddingVertical:5,
                                backgroundColor:Theme.white,
                                width:width*.8,
                                height:height*.6,
                                borderRadius:width*.05,
                                justifyContent:"center",
                                alignItems:"center"
                            }}
                        >

                            <View style={{flex:2, justifyContent:"center"}}>
                                <Text style={{color:Theme.black, fontSize:17, textAlign:"center", fontWeight:"bold"}}>
                                    서비스 이용 동의
                                </Text>
                            </View>
                            <View style={{flex:2, alignItems:"center",justifyContent:"center", padding:20}}>
                                <Text style={{color:Theme.black, fontSize:14, lineHeight:19, textAlign:"center"}}>
                                    캐쳐는 웹 및 앱을 통한 본인인증 내역 확인 서비스, 본인인증 SMS를 웹과 연동한 푸시 메세지 연동 서비스를 제공하고자{"\n"}
                                    사용자가 수신하는 SMS에 '인증' 및 'verification' 내용이 포함된 문자 메세지 내용을 수집합니다.{"\n"}{"\n"}
                                    수집된 정보는 안전하게 저장되며, 본인을 제외한 그 누구에게도 공개되지 않습니다.
                                </Text>
                            </View>
                            <View style={{flex:2, justifyContent:"center", flexDirection:"row", alignItems:"center"}}>
                                <CheckBox value={this.state.agree} onValueChange={(value)=>{this.setState({agree:value})}}/>
                                <Text onPress={()=>Linking.openURL("https://catch-7e353.firebaseapp.com/service")}
                                      style={{color:Theme.black, fontSize:14, lineHeight:19, textAlign:"center", borderBottomWidth:0.5}}>
                                    이용약관 및 개인정보 처리방침
                                </Text>
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"flex-end",width:width*.7}}>
                                <TouchableOpacity
                                    onPress={this._cancel}
                                    style={{
                                        padding:10,margin:5,
                                        justifyContent:"center",
                                        alignItems:"center",
                                    }}
                                >
                                    <Text style={{color:Theme.red,fontWeight:"bold"}}>
                                        취소
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={this._agree}
                                    style={{
                                        padding:10,margin:5,
                                        justifyContent:"center",
                                        alignItems:"center"
                                    }}
                                >
                                    <Text style={{color:this.state.agree ? Theme.black : Theme.grey }}>
                                        동의합니다
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    _agree = () => {
        if(!this.state.agree){
            return;
        }

        this.props.callback(true);
        this._hideModal();
    };

    _cancel = () => {
        this.props.callback(false);
        this._hideModal();
    };

    _hideModal = () => {
        this.setState({
            isVisible:false
        })
    }
}