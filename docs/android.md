# Android build (Capacitor)

This project contains helper scripts to wrap the Vite web app into an Android app using Capacitor.

## Prerequisites
- Node.js (18+ recommended) and npm
- Java JDK 11+
- Android SDK / Android Studio (for local builds)
- GitHub Actions runner for CI builds (optional)

## Quick local steps

1. Install dependencies:

   npm install

2. Generate icon PNGs (created from `public/assets/icon.svg`):

   npm run generate:icons

   This writes scaled icons to `public/assets/icons`.

3. Initialize Capacitor (only once):

   npm run cap:init

   If you want a different package id or app name, edit the script or rerun with your values.

4. Add Android platform (only once):

   npm run cap:add:android

5. Build and sync the web assets, then assemble a debug APK:

   npm run build
   npm run cap:sync
   cd android && ./gradlew assembleDebug

6. The APK will be under `android/app/build/outputs/apk/debug/` (or `release` for release builds).

## CI (example)
See `.github/workflows/android-build.yml` for an example GitHub Actions workflow that builds a release artifact.

## Notes
- If you need help publishing to Play Store, I can add Play Store metadata and signing automation.
- Building a release requires a signing key; I can add instructions to configure `keystore` and gradle signing.
