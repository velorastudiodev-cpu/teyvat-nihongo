package dev.velorastudio.teyvatnihongo;

import android.view.View;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        // no Android 12+ "stretch" when pulling past the top or bottom: the page stays put
        if (getBridge() != null) getBridge().getWebView().setOverScrollMode(View.OVER_SCROLL_NEVER);
    }
}
