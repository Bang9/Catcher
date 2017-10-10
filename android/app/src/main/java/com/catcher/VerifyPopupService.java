package com.catcher;

import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Handler;
import android.os.IBinder;
import android.text.TextUtils;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import butterknife.InjectView;

public class VerifyPopupService extends Service {

    public VerifyPopupService() {    }

    public static final String AUTH_NUMBER = "auth_number";

    protected View rootView;
    WindowManager.LayoutParams params;
    private WindowManager windowManager;

    @InjectView(R.id.tv_sms_popup)
    TextView tv_sms_popup;
    Button btn_copy;

    String auth_number;

    public void onCreate(){
        super.onCreate();
        Log.d("SERVICE","CREATE SERVICE");
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        Display display = windowManager.getDefaultDisplay();

        int width = (int) (display.getWidth() * 0.9); //Display 사이즈의 90%

        params = new WindowManager.LayoutParams(
                width,
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT);
        params.gravity= Gravity.CENTER | Gravity.BOTTOM;
        params.y=230;

        LayoutInflater layoutInflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);
        rootView = layoutInflater.inflate(R.layout.sms_popup, null);
        tv_sms_popup = (TextView)rootView.findViewById(R.id.tv_sms_popup);
        btn_copy = (Button)rootView.findViewById(R.id.btn_copy);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId){
        Log.d("SERVICE","START SERVICE");

        setExtra(intent);

        windowManager.addView(rootView, params);

        Log.d("AUTH NUMBER IN SERIVCE",auth_number);
        if (!TextUtils.isEmpty(auth_number)) {
            tv_sms_popup.setText("인증번호 "+auth_number);
            btn_copy.setOnTouchListener(new Button.OnTouchListener(){
                @Override
                public boolean onTouch(View view, MotionEvent ev){
                    switch(ev.getAction()){
                        case MotionEvent.ACTION_DOWN:
                            Log.d("TOAST","PRESS");
                            Toast.makeText(VerifyPopupService.this, "눌림버튼", Toast.LENGTH_SHORT).show();
                            return true;
                    }
                    return false;
                }
            });
        }

        //5초후 액티비티 종료
        Handler mHandler = new Handler();
        mHandler.postDelayed(new Runnable(){
            @Override
            public void run(){
                removePopup();
            }
        },6500);

        return START_NOT_STICKY;
    }

    public void setExtra(Intent intent){
        if(intent == null){
            removePopup();
            return;
        }
        auth_number = intent.getStringExtra(AUTH_NUMBER);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        removePopup();
    }

    public void removePopup() {
        if (rootView != null && windowManager != null) windowManager.removeView(rootView);
    }

//    @OnClick(btn_copy)
//    public void copyToClipboard() {
//        return;
//    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }
}
