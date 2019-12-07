const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
admin.initializeApp(functions.config().firebase);

/*
 * Cloud functions
 *
 * @pushService
 *  Ref - users/{uid}/verificationData
 *  Ref - users/{uid}/webPushToken
 *
 */


//verificationData에 새로운 값이 들어오면 함수 트리거
//webPushToken확인하고, 없으면 return
exports.pushService = functions.database.ref('/users/{uid}/verificationData').onWrite(
    (event)=>{
        const snapshot = event.data;
        const uid = snapshot.ref.parent.key;
        const db = admin.database();
        const pushTokenRef = `/users/${uid}/webPushToken`;
        const verifyList = snapshot.val();

        db.ref(pushTokenRef).once('value',function(snapshot){
            const token = snapshot.val()
            if(token){
                return pushStart(token,verifyList);
            }else{
                return;
            }
        })
    }
)
function pushStart(token,verifyList){
    console.log('TOKEN',token);
    console.log('VERFIY LIST',verifyList);
    const keys = Object.keys(verifyList);
    const recent = verifyList[keys.sort()[keys.length-1]];
    const key = 'AAAAMnsH7uM:APA91bFhvxqJ--GGzc1-7CxgSVvMWvqRiUD5UzwGelDUuonxyk1loDY9BeC_yJzMYDMPurwmXuZDz243ldywZ_o1bVHEBo-NeHOQkxhXKrQYe5rUHMVYAG_pxy6A_huOV6Q_nZoMlRGA';
    const to = `${token}`;
    const notification = {
        'title': `인증번호 ${recent.code}`,
        'body': '캐쳐에서 인증번호가 도착했어요!',
        'icon': 'catcher-logo.png',
        'click_action': 'http://www.catcher.cf'
    };

    fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
            'Authorization': 'key=' + key,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
            'notification': notification,
            'to': to
        })
    }).then(function(response) {
        console.log(response);
    }).catch(function(error) {
        console.error(error);
    })
}