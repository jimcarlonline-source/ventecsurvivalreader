# VEN-TEC PIP-READER

A survival-themed offline ebook reader for Android, styled like a Fallout-era
terminal (Pip-Boy amber/green phosphor, scanlines, CRT glow). Ships with a
built-in **survival databank** and lets the operator import their own `.txt`
field manuals.

Built as a Cordova web app so it can target **old Android (4.1 / API 16 and up)**,
and wired to build the installable **APK automatically on GitHub Actions** — no
Android Studio needed on your machine.

---

## What's inside

```
ventec-survival-reader/
├─ www/                     the actual app (this is the whole UI)
│  ├─ index.html            shell: boot screen, archive, reader, config, info
│  ├─ css/style.css         legacy-safe CRT/terminal styling
│  └─ js/
│     ├─ library.js         the 6 bundled survival protocols
│     └─ app.js             app logic (ES5, works on old WebView)
├─ config.xml              Cordova app config (id, minSdk 16, target 28)
├─ package.json
├─ .github/workflows/
│  └─ build-apk.yml         GitHub Actions -> builds + uploads the APK
├─ .gitignore
└─ README.md
```

The app is **fully offline**. Settings and imported books are stored locally
on the device.

---

## Fastest path: build the APK on GitHub (recommended)

You don't need Android tooling installed. GitHub does the build for you.

1. **Create a new repo** on GitHub (e.g. `ventec-pip-reader`).
2. **Upload this whole folder** to it. Either:
   - drag the files into the GitHub web uploader, or
   - from a terminal:
     ```bash
     cd ventec-survival-reader
     git init
     git add .
     git commit -m "VEN-TEC Pip-Reader v1.0"
     git branch -M main
     git remote add origin https://github.com/<you>/ventec-pip-reader.git
     git push -u origin main
     ```
3. The push triggers the **"Build VEN-TEC APK"** workflow automatically.
   (Or run it by hand: repo → **Actions** tab → *Build VEN-TEC APK* → *Run workflow*.)
4. When it finishes (green check), open the run → scroll to **Artifacts** →
   download **`ventec-pip-reader-debug`**. Inside is `app-debug.apk`.

That `.apk` is your installable app.

---

## Install it on the phone

1. Copy `app-debug.apk` to the Android device (USB, email, cloud, etc.).
2. On the device, allow installs from unknown sources:
   - Android 4.x: **Settings → Security → Unknown sources → ON**
   - Newer Android: you'll be prompted per-app when you open the APK.
3. Tap the APK in a file manager and install. Launch **VEN-TEC Pip-Reader**.

It's a debug-signed APK, which is fine for sideloading to your own devices.
(For the Play Store you'd need a release build signed with your own keystore.)

---

## Android version support

- **Default: Android 4.1+ (API 16).** This uses `cordova-android 8.1.0`, the
  newest Cordova that still supports minSdk 16, so it's the most reliable build
  that still reaches "Android 4."
- **Want true Android 4.0 (API 14/15)?** Change the engine in `config.xml` to
  `cordova-android 5.2.2`, set `android-minSdkVersion` to `14`, and in the
  workflow install `build-tools;25.0.3` + `platforms;android-25` and Java 8.
  Heads-up: the 5.x toolchain is much finickier on modern CI (dead jcenter
  mirrors, old Gradle), so only drop this low if you truly need 4.0 devices.
- The UI is deliberately written in **ES5 + legacy CSS** (no CSS variables, no
  modern flexbox, `-webkit-` gradients) so it renders correctly on the old
  stock WebView shipped with Android 4.x.

---

## Preview without building

The whole app is just `www/`. To see it right now, open `www/index.html` in any
browser (Chrome desktop, or drop it on an Android device's browser). Everything
except the APK packaging works there, including import and settings.

---

## Customizing

- **Brand colors / phosphor:** edit the amber `#ffb642` and green `#46ff8c`
  values in `www/css/style.css`. The Config screen in-app also toggles amber vs
  green live.
- **Add / edit survival content:** edit `www/js/library.js`. Each book is an
  object; a line starting with `## ` becomes a section heading in the reader.
- **App name / ID:** edit `<name>` and `id=` in `config.xml`.
- **Launcher icon:** drop a 512×512 PNG at `res/icon.png` and un-comment the
  `<icon>` lines in `config.xml`.

---

## Build locally instead (optional)

If you'd rather build on your own machine:

```bash
npm install -g cordova@10.0.0
cd ventec-survival-reader
cordova platform add android@8.1.0
cordova build android
# APK lands in platforms/android/app/build/outputs/apk/debug/
```

Requires JDK 8 and an Android SDK with `platforms;android-28` and
`build-tools;28.0.3`.

---

## Note on the survival content

The bundled protocols (water, fire, shelter, first aid, food, navigation) are
**general field reference**, not a substitute for professional training or
emergency services. In a real emergency, get qualified help wherever it's
available.

_(c) VEN-TEC Industries — "Knowledge outlasts the bomb."_
