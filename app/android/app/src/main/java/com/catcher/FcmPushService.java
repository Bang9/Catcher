package com.catcher;

import android.util.Log;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

/**
 * Created by Bang9 on 2018-03-15.
 */

public class FcmPushService{
    public final static String SERVER_KEY = "AAAAMnsH7uM:APA91bFhvxqJ--GGzc1-7CxgSVvMWvqRiUD5UzwGelDUuonxyk1loDY9BeC_yJzMYDMPurwmXuZDz243ldywZ_o1bVHEBo-NeHOQkxhXKrQYe5rUHMVYAG_pxy6A_huOV6Q_nZoMlRGA";
    public final static String API_URL = "https://fcm.googleapis.com/fcm/send";

    private String uid,authNumber;

    public FcmPushService(){}

    public FcmPushService(String uid,String authNumber) {
        this.uid = uid;
        this.authNumber = authNumber;
    }

    public void setPushInfo(String uid,String authNumber){
        this.uid = uid;
        this.authNumber = authNumber;
    }

    public void startPushService() throws Exception {
        if(this.uid==null || this.authNumber==null)
            throw new Exception("Error, push information not confirmed");

        FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference userRef = database.getReference().child("users").child(uid);
        Log.d("CODE REFERENCE", userRef.child("webPushToken").toString());

        //check user has web push token
        userRef.child("webPushToken")
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        final String pushToken = dataSnapshot.getValue(String.class);
                        Log.d("PUSH TOKEN","User push token :: "+pushToken);
                        if(pushToken != null){
                            new Thread() {
                                public void run(){
                                    sendPushNotification(pushToken);
                                }
                            }.start();
                        }
                    }
                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        Log.w("Get pushtoken error", databaseError.toException());
                    }
                });
    }

    public void sendPushNotification(String pushToken) {
        try {
            URL url = new URL(API_URL);
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();

            //set request header
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Authorization", "key=" + SERVER_KEY);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            //set payload
            JSONObject body = new JSONObject();
            JSONObject notification = new JSONObject();

            notification.put("title", "인증번호 " + this.authNumber);
            notification.put("body", "캐쳐에서 인증번호가 도착했어요!");
            notification.put("icon", "catcher-logo.png");
            notification.put("click_action", "https://catch-7e353.firebaseapp.com/");

            body.put("notification", notification);
            body.put("to", pushToken);

            Log.d("PAYLOAD","post payload : "+body.toString());

            //post request
            OutputStreamWriter wr = new OutputStreamWriter(connection.getOutputStream(), "UTF-8");
            wr.write(body.toString());
            wr.flush();

            Log.d("HTTP REQUEST CODE","request code :: "+connection.getResponseMessage());

            StringBuffer response = new StringBuffer();
            if(connection.getResponseCode() == 200){
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(connection.getInputStream())
                );
                String input;
                while((input = in.readLine()) != null) {
                    response.append(input);
                };
                in.close();
            }
            Log.d("RESPONSE","response : "+response.toString());
            connection.disconnect();
        }
        catch(Exception e){
            Log.w("URL EXCEPTION :: ","url exception"+e.toString());
        }
    }
}
