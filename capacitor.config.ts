import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mypersoneight.docuformat',
  appName: 'DocuFormat',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
