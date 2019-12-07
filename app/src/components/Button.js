import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableNativeFeedback,
    Alert,
} from 'react-native'

import PropTypes from "prop-types";

class Button extends Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

    static defaultProps = {
        title : "Button",
        color : "#bfbfbf",
        onClick : null,
        icon : null,
    }

    static propTypes = {
        title : PropTypes.string,
        color : PropTypes.string,
        onClick : PropTypes.func,
        icon : PropTypes.object,
    };

    render(){
        return(
            <TouchableNativeFeedback
                delayPressIn={0}
                background={TouchableNativeFeedback.SelectableBackground()}
                onPress={this.props.onClick}
            >
                <View style={[styles.buttonStyle,this.props.buttonStyle,{backgroundColor:this.props.color,flexDirection:'row'}]}>
                    {
                        this.props.icon &&
                        <View style={{flex:0.3,alignItems:'flex-start', width:50, alignItems:'center', borderRightWidth:1, borderColor:this.props.buttonStyle.borderColor}}>
                            { this.props.icon }
                        </View>
                    }
                    <View style={{flex:1, alignItems:'center'}}>
                        <Text style={[styles.fontStyle,this.props.titleStyle]}>{this.props.title}</Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

export default Button;

const styles = StyleSheet.create({
    buttonStyle:{
        width:250,
        height:40,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
    },
    fontStyle:{
        color:'white',
        paddingHorizontal:5,
    }
})