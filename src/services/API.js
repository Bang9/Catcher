import { AsyncStorage ,Alert,ToastAndroid } from 'react-native'
import firebase from '../commons/Firebase'
import FBSDK from 'react-native-fbsdk';
import {GoogleSignin} from 'react-native-google-signin';
const {
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager,
} = FBSDK;

class API {
    //************ Auth API
    async getAuth(){
        // authState string - facebook/kakao/email/null
        // return obj - {result,authType}
        try {
            return await AsyncStorage.getItem('@Session:authType')
                .then((authState)=>{
                    if (authState != null)
                        return {
                            result: true,
                            authType: authState
                        }
                    else
                        return {
                            result: false,
                            authType: null,
                        }
                })
        }
        catch(err){
            console.log("Get auth failed:",err)
        }
    }

    login(type,callback,data){
        switch(type){
            case'facebook' :
                return this._fbAuth_Login(callback);

            case'google' :
                return this._gAuth_Login(callback);

            default :
                break;
        }
    }

    logout(type,callback){
        switch(type){
            case'facebook' :
                this._fbAuth_Logout();
                break;

            case'google' :
                this._gAuth_Logout();
                break;

            default :
                break;
        }
        callback();
    }

    setUserData(currentUser,authType){
        let userConfig = null;

        if(authType === 'facebook') {
            result = currentUser.providerData[0]
            userConfig = {
                name: result.displayName || 'none',
                email: result.email || 'none',
                photoURL: result.photoURL || 'none',
                uid: result.uid
            };
        }
        if(authType === 'google'){
            result = currentUser._user;
            userConfig = {
                name: result.displayName || 'none',
                email: result.email || 'none',
                photoURL: result.photoURL || 'none',
                uid: result.uid
            };
        }

        AsyncStorage.setItem('@Session:authType', authType);
        AsyncStorage.setItem('@Session:userConfig', JSON.stringify(userConfig));
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
                    webClientId:'216812482275-ipa1m8r6g1sjvo8tdvgh7uc0nvmfmslj.apps.googleusercontent.com',
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
        AsyncStorage.removeItem('@Session:authType')
        AsyncStorage.removeItem('@Session:userConfig')
    }

    _fbAuth_Login(callback){ // @callback param : isCancel(boolean)
        LoginManager
            .logInWithReadPermissions(['public_profile', 'email'])
            .then((result) => {
                if (result.isCancelled) {
                    return callback(result.isCancelled)
                    //return Promise.resolve('cancelled');
                }
                console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
                // get the access token
                return AccessToken.getCurrentAccessToken();
            })
            .then(data => {
                // create a new firebase credential with the token
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                // login with credential
                return firebase.auth().signInWithCredential(credential);
            })
            .then((currentUser) => {
                if (currentUser === 'cancelled') {
                    console.log('Login cancelled');
                } else {
                    // now signed in
                    callback(false);
                    return this.setUserData(currentUser,'facebook')
                    //console.warn(JSON.stringify(currentUser.toJSON()));
                }
            })
            .catch((error) => {
                callback(true)
                console.log(`Login fail with error: ${error}`);

                if(error.code=='auth/user-disabled')
                    return ToastAndroid.show('사용 불가능한 계정입니다', ToastAndroid.SHORT)

                return Alert.alert('에러','관리자에게 문의하세요\n에러코드 : '+error.code+'\n'+error.message)
            });

    }

    _fbAuth_Logout(){
        LoginManager.logOut();
        firebase.auth().signOut();
        AsyncStorage.removeItem('@Session:authType')
        AsyncStorage.removeItem('@Session:userConfig')
    }
    getUid(){
        if(firebase.auth().currentUser)
            return firebase.auth().currentUser.uid;
        else
            return null;
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