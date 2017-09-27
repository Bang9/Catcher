package com.catcher;

import android.app.Service;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.IBinder;

public class VerifySMSRegister extends Service {
    public VerifySMSRegister() {
    }
    @Override
    public int onStartCommand(Intent intent, int flags, int startId){
//        onTaskRemoved(intent);
        VerifySMSReceiver receiver = new VerifySMSReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction("android.provider.Telephony.SMS_RECEIVED");
        //filter.addAction(android.telephony.TelephonyManager.ACTION_PHONE_STATE_CHANGED);

        registerReceiver(receiver,filter);
        //registerReceiver(receiver, new IntentFilter(Telephony.Sms.Intents.SMS_RECEIVED_ACTION));
        return START_STICKY;
    }
    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }


// only use this in kitkat
//    @Override
//    public void onTaskRemoved(Intent rootIntent){
//        Intent restartServiceIntent = new Intent(getApplicationContext(), this.getClass());
//        restartServiceIntent.setPackage(getPackageName());
//        startService(restartServiceIntent);
//        super.onTaskRemoved(rootIntent);
//    }


}
