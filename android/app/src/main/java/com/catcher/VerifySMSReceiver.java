package com.catcher;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VerifySMSReceiver extends BroadcastReceiver {
    class VerificationData {
        public String code;
        public String time;
        public VerificationData() {
            // Default constructor required for calls to DataSnapshot.getValue(User.class)
        }
        public VerificationData(String code, String time) {
            this.code = code;
            this.time = time;
        }
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
                    messages[i] =
                            SmsMessage.createFromPdu((byte[]) pdusObj[i]);
                    // SmsMessage의 static메서드인 createFromPdu로 pdusObj의
                    // 데이터를 message에 담는다
                    // 이 때 pdusObj는 byte배열로 형변환을 해줘야 함
                }

                // SmsMessage배열에 담긴 데이터를 append메서드로 sms에 저장
                for (SmsMessage smsMessage : messages) {
                    // getMessageBody메서드는 문자 본문을 받아오는 메서드
                    sms.append(smsMessage.getMessageBody());
                }

                String smsBody = sms.toString();

                Pattern pattern = Pattern.compile("\\d{6}");
                Matcher matcher = pattern.matcher(smsBody);

                String authNumber = null;
                String currentTime = null;

                if (matcher.find()) {
                    authNumber = matcher.group(0);
                    currentTime = Long.toString(System.currentTimeMillis());
                }

                //firebase 인증이 되어있지 않거나 authNumber가 null이면 return
                FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
                if(user==null || authNumber==null) return;

                String uid = user.getUid();

                //SHOW TOAST
                Toast.makeText(context,"인증번호 : "+authNumber,Toast.LENGTH_LONG).show();
                //SHOW Local noti

                //데이터베이스에 등록
                //FirebaseApp firebase = FirebaseApp.initializeApp(context);
                FirebaseDatabase database = FirebaseDatabase.getInstance();
                DatabaseReference codeRef = database.getReference();
                VerificationData data = new VerificationData(authNumber,currentTime);
                codeRef.child("users").child(uid).child("verificationData").setValue(data);
            }
        }
    }
}