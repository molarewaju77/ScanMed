# How to Get Firebase Credentials

Go to: [Firebase Console](https://console.firebase.google.com/)

## 1. Create a Project
- Click **"Add project"** and follow the steps.
- Enable Google Analytics if you want (optional).

## 2. Get Frontend Keys (Web App Config)
1. In your project overview, click the **Web icon (`</>`)** to add an app.
2. Register the app (e.g., name it "ScanMed-Web").
3. You will see a code block with `firebaseConfig`.
4. Copy these values into your `Frontend/.env` file:
   - `apiKey` -> `VITE_FIREBASE_API_KEY`
   - `authDomain` -> `VITE_FIREBASE_AUTH_DOMAIN`
   - ...and so on.

## 3. Get VAPID Key (Frontend Push Access)
1. Go to **Project Settings** (Gear icon) -> **Cloud Messaging** tab.
2. Scroll to **Web configuration**.
3. Under **Web Push certificates**, click **Generate key pair**.
4. Copy this long string.
5. Paste it into `` as `VITE_FIREBASE_VAPID_KEY`.

## 4. Get Backend Key (Service Account)
1. Go to **Project Settings** -> **Service accounts** tab.
2. Click **Generate new private key**.
3. This will download a `.json` file.
4. Rename it to `serviceAccountKey.json`.
5. Move it to this folder: `backend/firebase/serviceAccountKey.json`.
