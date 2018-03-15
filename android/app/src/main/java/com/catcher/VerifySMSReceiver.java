package com.catcher;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VerifySMSReceiver extends BroadcastReceiver {

    static class VerificationData {
        public String code;
        public String time;
        public String sms;
        public VerificationData() {
            // Default constructor required for calls to DataSnapshot.getValue(User.class)
        }
        public VerificationData(String code, String time, String sms) {
            this.code = code;
            this.time = time;
            this.sms  = sms;
        }
    }

    	public static String getAuthNumber(String SMS){
    		System.out.println("FIND VERIFICATION WORDS");
    		Pattern pattern = Pattern.compile("\\d{4,8}");
    		Matcher matcher = pattern.matcher(SMS);
    		if(matcher.find()){
    			return matcher.group(0);
    		}
    		return null;
    	}

    @Override
    public void onReceive(Context context, Intent intent) {

        // SMS를 받았을 경우에만 반응하도록 if문을 삽입
        if (intent.getAction().equals(
                "android.provider.Telephony.SMS_RECEIVED")) {

            //SMS인증문자 변환
            StringBuilder sms = new StringBuilder();
            Bundle bundle = intent.getExtras();

            if (bundle != null) {
                // 번들에 포함된 문자 데이터를 객체 배열로 받아온다
                Object[] pdusObj = (Object[]) bundle.get("pdus");

                // SMS를 받아올 SmsMessage 배열을 만든다
                SmsMessage[] messages = new SmsMessage[pdusObj.length];
                for (int i = 0; i< pdusObj.length; i++) {
                    messages[i] = SmsMessage.createFromPdu((byte[]) pdusObj[i]);
                    // SmsMessage의 static메서드인 createFromPdu로 pdusObj의
                    // 데이터를 message에 담는다
                    // 이 때 pdusObj는 byte배열로 형변환을 해줘야 함
                }

                // SmsMessage배열에 담긴 데이터를 append메서드로 sms에 저장
                for (SmsMessage smsMessage : messages) {
                    // getMessageBody메서드는 문자 본문을 받아오는 메서드
                    sms.append(smsMessage.getMessageBody());
                }

                String smsBody = sms.toString().toLowerCase();

                //TODO pattern 이전에 verification 혹은 인증 이라는 문자 검사하고 문자열 4-6자리를 code로 반환
                String authNumber = null;
                String currentTime = null;
                String smsFull = smsBody;

                // smsBody에 대해서 인증문자인지 pattern 검사를 진행한다.
                Pattern patternKor = Pattern.compile("인증");
                Pattern patternEng = Pattern.compile("verification");
                Matcher matcherKor = patternKor.matcher(smsBody);
                Matcher matcherEng = patternEng.matcher(smsBody);

                //만약 인증문자라는게 확인되면 getAuthNumber 메소드를 통해서 인증번호를 가져온다.
         		if(matcherEng.find()){
         			authNumber = getAuthNumber(smsBody);
         		}else if(matcherKor.find()){
         			authNumber = getAuthNumber(smsBody);
         		}
                currentTime = Long.toString(System.currentTimeMillis());

                //firebase 인증이 되어있지 않거나 authNumber가 null이면 return
                FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
                if(user==null || authNumber==null) return;

                String uid = user.getUid();

                //Deprecated --- SHOW TOAST
                //Toast.makeText(context,"인증번호 : "+authNumber,Toast.LENGTH_LONG).show();

                //Start Popup Service
                Log.d("SMS RECEIVER","START RECEIVE");
                Intent serviceIntent = new Intent(context, VerifySMSPopupService.class);
                serviceIntent.putExtra(VerifySMSPopupService.AUTH_NUMBER, authNumber);
                context.startService(serviceIntent);

                //Start Push Service
                try {
                    FcmPushService pushService = new FcmPushService();
                    pushService.setPushInfo(uid,authNumber);
                    pushService.startPushService();
                }catch(Exception e){
                    Log.w("PUSH SERVICE ERROR :: ",e.getMessage());
                }

                //Regist VerificationData to Database
                FirebaseDatabase database = FirebaseDatabase.getInstance();
                DatabaseReference userRef = database.getReference().child("users").child(uid);
                VerificationData verifyData = new VerificationData(authNumber,currentTime,smsFull);
                Log.d("CODE REFERENCE", userRef.child("verificationData").toString());

                String key = userRef.child("verificationData").push().getKey();
                userRef.child("verificationData").child(key).setValue(verifyData);
                //codeRef.child("users").child("uid").child("verificationData").push(verifyData);
            }
        }
    }
}