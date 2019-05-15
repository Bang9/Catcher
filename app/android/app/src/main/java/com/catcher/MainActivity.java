package com.catcher;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.widget.Toast;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    public static final int OVERLAY_PERMISSION_REQ_CODE = 1235;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Catcher";
    }

    @Override
    public void onCreate (Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Checking permissions on init
        checkPerms();
    }

    public void checkPerms() {
        // Checking if device version > 22 and we need to use new permission model
        if(Build.VERSION.SDK_INT> Build.VERSION_CODES.LOLLIPOP_MR1) {
            // Checking if we can draw window overlay
            if (!Settings.canDrawOverlays(this)) {
                // Requesting permission for window overlay(needed for all react-native apps)
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
                Toast.makeText(this, "인증번호 표시를 위해서 다른 앱 위에 표시 권한이 필요합니다.", Toast.LENGTH_LONG).show();
            }
        }
    }

    // Window overlay permission intent result
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
            checkPerms();
        }
    }
}
