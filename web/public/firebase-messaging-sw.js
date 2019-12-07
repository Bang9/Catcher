console.log('worker installed')
//import scripts
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

//firebase initializing
const config = { messagingSenderId: "216812482275" };

firebase.initializeApp(config);
const messaging = firebase.messaging();

// * How to fetch a notification
// function fetchNotification(){
//     var key = 'AAAAMnsH7uM:APA91bFhvxqJ--GGzc1-7CxgSVvMWvqRiUD5UzwGelDUuonxyk1loDY9BeC_yJzMYDMPurwmXuZDz243ldywZ_o1bVHEBo-NeHOQkxhXKrQYe5rUHMVYAG_pxy6A_huOV6Q_nZoMlRGA';
//     var to = `${webPushToken}`;
//     var notification = {
//         'title': `인증번호 ${verificationData.code}`,
//         'body': '캐쳐에서 인증번호가 도착했어요!',
//         'icon': 'catcher-logo.png',
//         'click_action': 'http://localhost:8081'
//     };
//
//     fetch('https://fcm.googleapis.com/fcm/send', {
//         'method': 'POST',
//         'headers': {
//             'Authorization': 'key=' + key,
//             'Content-Type': 'application/json'
//         },
//         'body': JSON.stringify({
//             'notification': notification,
//             'to': to
//         })
//     }).then(function(response) {
//         console.log(response);
//     }).catch(function(error) {
//         console.error(error);
//     })
// }


// * Handling message on foreground
// messaging.onMessage( (payload)=>{
//     console.log('[firebase-messaging-sw.js] Received foreground message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//         body: 'Background Message body.',
//         icon: '/firebase-logo.png'
//     };
//     return self.registration.showNotification(notificationTitle,
//         notificationOptions);
// })

// 1. When user logged in a website, save the token user database ref by users/uid/webAppPushToken = {---}
// 2. Cloud Functions will post the message when changed users/uid/verificationData
// 3. Get messages by the service worker
// * Handling message on background


// Web이 foreground 상태이면 onMessage 함수가 실행됩니다.
// onMessage 함수는 service worker가 아닌 Web에서 실행되어야 합니다.
// messaging.onMessage(function(payload){
//     console.log('hello');
//     console.log(payload)
// });

// Web이 background 상태이면 setBackgroundMessageHandler 함수가 실행됩니다.
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Catcher';
    const notificationOptions = {
        body: '캐쳐에서 푸시메세지!',
        icon: '/catcher-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});

console.log('worker install finished')