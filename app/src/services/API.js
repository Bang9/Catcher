import { AsyncStorage ,Alert,ToastAndroid } from 'react-native'
import firebase from "react-native-firebase";
import {GoogleSignin, statusCodes} from 'react-native-google-signin';

const GOOGLE_AUTH_CLIENT_ID = "216812482275-ipa1m8r6g1sjvo8tdvgh7uc0nvmfmslj.apps.googleusercontent.com";

class API {
    async login(callback){
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.configure({
                webClientId:GOOGLE_AUTH_CLIENT_ID,
                offlineAccess:false
            });

            const userInfo = await GoogleSignin.signIn();

            if(userInfo){
                const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
                await firebase.auth().signInWithCredential(credential);
                callback(true);
            }else{
                callback(false);
            }

        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            } else if (error.code === statusCodes.IN_PROGRESS) {
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                ToastAndroid.show('Play services not available', ToastAndroid.SHORT)
            } else {
                Alert.alert('에러','관리자에게 문의하세요\n에러코드 : '+error.code+'\n'+error.message)
            }
            callback(false);
        }
    }

    async logout(callback){
        try{
            await GoogleSignin.configure();
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            await firebase.auth().signOut();
            callback(true);
        }catch(err){
            callback(false);
        }
    }

    async leave(callback){
        try{
            await GoogleSignin.configure();
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            await firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).remove();
            await firebase.auth().currentUser.delete();
            callback(true);
        }catch(err){
            callback(false);
        }
    }



    getUid(){
        return firebase.auth().currentUser.uid;
    }

    async getDataOnce(ref){
        return await firebase.database().ref(ref).orderByKey().once('value', (snapshot)=>{
            return snapshot
        })
    }

    async getDataOn(ref,callback){
        return await firebase.database().ref(ref).on('value', (snapshot)=>callback(snapshot))
    }

    getDataOff(ref){
        return firebase.database().ref(ref).off();
    }

    getPushKey(child){
        return firebase.database().ref(child).push().key
    }

    writeData(ref,data){
        return firebase.database().ref(ref).set(data)
    }

    updateData(ref,data){
        return firebase.database().ref(ref).update(data)
    }

    removeData(ref,data){
        firebase.database().ref(ref+'/'+data).remove()
    }
}

export default new API();