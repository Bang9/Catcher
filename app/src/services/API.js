import { AsyncStorage ,Alert,ToastAndroid } from 'react-native'
import firebase from '../commons/Firebase'
import {GoogleSignin} from 'react-native-google-signin';

const GOOGLE_AUTH_CLIENT_ID = "216812482275-ipa1m8r6g1sjvo8tdvgh7uc0nvmfmslj.apps.googleusercontent.com";

class API {
    login(type,callback,data){
        switch(type){
            case'google' :
                return this._gAuth_Login(callback);

            default :
                break;
        }
    }

    logout(type,callback){
        switch(type){
            case'google' :
                this._gAuth_Logout();
                break;

            default :
                break;
        }
        callback();
    }

    setUserData(currentUser,authType){
        console.log('SET USER DATA START::',currentUser);
        let userConfig,result;

        if(authType === 'google'){
            result = currentUser._user;
            userConfig = {
                name: result.displayName || 'none',
                email: result.email || 'none',
                photoURL: result.photoURL || 'none',
                uid: result.uid
            };
        }


        console.log("SET USER CONFIG");
        return firebase.database().ref(`users/${result.uid}`).update({
            authType: authType,
            userConfig: userConfig
        })
    }

    _gAuth_Login(callback){
        GoogleSignin.hasPlayServices({autoResolve:true})
            .then( (res)=>{
                console.log('GOOGLE HAS PLAY SERVICES',res)
                return GoogleSignin.configure({
                    webClientId:GOOGLE_AUTH_CLIENT_ID,
                    offlineAccess:false
                })
            })
            .then( (res)=>{
                console.log('GOOGLE CONFIGURE',res)
                return GoogleSignin.signIn()
            })
            .then( (result)=>{
                console.log("GOOGLE RESULT",result)
                if(result){
                    // create a new firebase credential with the token
                    const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken,result.accessToken);
                    console.log("CREDENTIAL",credential)
                    // login with credential
                    return firebase.auth().signInWithCredential(credential);
                }
            })
            .then((currentUser) => {
                console.log('GOOGLE FIREBASE LOGGED IN')
                if (currentUser === 'cancelled') {
                    console.log('Login cancelled');
                } else {
                    // now signed in
                    callback(false);
                    return this.setUserData(currentUser,'google')
                    //console.warn(JSON.stringify(currentUser.toJSON()));
                }
            })
            .catch( (error)=>{
                callback(true)
                console.log(`Login fail with error: ${error}`);

                if(error.code=='auth/user-disabled')
                    return ToastAndroid.show('사용 불가능한 계정입니다', ToastAndroid.SHORT)

                if(error.code=='auth/account-exists-with-different-credential') {
                    this._gAuth_Logout();
                    return ToastAndroid.show('이미 해당 이메일로 다른계정이 존재합니다.', ToastAndroid.SHORT)
                }

                return Alert.alert('에러','관리자에게 문의하세요\n에러코드 : '+error.code+'\n'+error.message)
            })
    }

    _gAuth_Logout(callback){
        GoogleSignin.signOut();
        firebase.auth().signOut();
    }


    //************ Database API
    async getDataOnce(ref){
        return await firebase.database().ref(ref).orderByKey().once('value', (snapshot)=>{
            return snapshot
        })
    }

    async getDataOn(ref,callback){
        return await firebase.database().ref(ref).on('value', (snapshot)=>callback(snapshot))
    }

    getDataOff(ref,callback){
        return firebase.database().ref(ref).off('value',(snapshot)=>callback(snapshot));
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