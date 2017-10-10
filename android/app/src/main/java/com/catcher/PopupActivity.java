package com.catcher;

import android.app.Activity;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Bundle;
import android.os.Handler;
import android.text.TextUtils;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class PopupActivity extends Activity {

    public static final String AUTH_NUMBER = "auth_number";
    String auth_number;
    TextView tv_sms_popup;
    Button btn_copy;
    private WindowManager windowManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d("ACTIVITY CREATE","START");

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        int width = (int) (windowManager.getDefaultDisplay().getWidth()*0.9);
        requestWindowFeature(Window.FEATURE_NO_TITLE);

//        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
//                width,
//                WindowManager.LayoutParams.MATCH_PARENT,
//                WindowManager.LayoutParams.TYPE_SYSTEM_OVERLAY,
//                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE| WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL|WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH,
//                PixelFormat.TRANSLUCENT);
//        getWindow().setAttributes(params);

        getWindow().setLayout(width,WindowManager.LayoutParams.MATCH_PARENT);
        getWindow().setType(WindowManager.LayoutParams.TYPE_PHONE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH,WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH);
        getWindow().setFormat(PixelFormat.TRANSLUCENT);
        setContentView(R.layout.sms_popup);

        tv_sms_popup = (TextView)findViewById(R.id.tv_sms_popup);
        btn_copy = (Button)findViewById(R.id.btn_copy);

        Log.d("SERVICE","START SERVICE");
        Log.d("SERVICE INTENT",getIntent().toString());

        setExtra(getIntent());

        if (!TextUtils.isEmpty(auth_number)) {
            tv_sms_popup.setText("인증번호 "+auth_number);
            btn_copy.setOnTouchListener(new Button.OnTouchListener(){
                @Override
                public boolean onTouch(View view, MotionEvent ev){
                    switch(ev.getAction()){
                        case MotionEvent.ACTION_DOWN:
                            Log.d("TOAST","PRESS");
                            Toast.makeText(PopupActivity.this, "눌림버튼", Toast.LENGTH_SHORT).show();
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
                //finish();
            }
        },5000);

    }

    public void setExtra(Intent intent){
        if(intent == null){
            finish();
            return;
        }
        auth_number = intent.getStringExtra(AUTH_NUMBER);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }
}
