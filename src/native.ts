import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

// Android back button: step back through the app's pages, leave the app from the first one.
if (Capacitor.isNativePlatform()) {
  App.addListener('backButton', ({ canGoBack }) => (canGoBack ? history.back() : App.exitApp()))
}
