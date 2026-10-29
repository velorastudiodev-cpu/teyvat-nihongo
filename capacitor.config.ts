import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'dev.velorastudio.teyvatnihongo',
  appName: 'Teyvat Nihongo',
  webDir: 'dist',
  android: {
    // Chrome DevTools (chrome://inspect) can attach to debug builds only
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SystemBars: { insetsHandling: 'css' },
  },
}

export default config
