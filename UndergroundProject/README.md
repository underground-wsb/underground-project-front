# Operating system

This guide is for linux installation, adjust it if its installed via WSL or Windows

For WSL it should work mostly as here described

# Prerequisities

I suggest you to install prerequisities from backend project first

## Install Android Studio

Go to the official Android Studio download page:
https://developer.android.com/studio

Download the version for your operating system (Windows, macOS, or Linux).

Install using the on-screen prompts. On first launch, Android Studio will guide you through a setup wizard that installs the latest Android SDK, the Android SDK Platform-Tools, and the Android SDK Build-Tools.

## Install java

```
sudo apt-get update
sudo apt-get install openjdk-17-jdk
```

## Add java environmental variables

```
export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
export PATH="$JAVA_HOME/bin:$PATH"
```

## Set ANDROID_HOME

```
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH"
```

# Setup

## Cloning repository

`git clone git@github.com:underground-wsb/underground-project-front.git`

## Installing necessary libraries

`cd UndergroundProject`

`npm install`

## Configuring android studio

Open Android Studio.

SDK Manager:

At the top of Android Studio, click Tools → SDK Manager.
Make sure you have at least one SDK Platform installed. We've got default, 15, SDK Build Tools 35 i hope.
SDK Tools tab:
Check that you have Android SDK Build-Tools, Android SDK Platform-Tools, and Android SDK Tools installed.

Now, configure environmental variables

```
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
```

```
export ANDROID_HOME="$HOME/Android/Sdk"
# OR
export ANDROID_SDK_ROOT="$HOME/Android/Sdk"

export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH"
```

By default in android studio, you should have your base device configured, if no

Click Tools → AVD Manager (Android Virtual Device Manager).
Click Create Virtual Device.

You may need adb working. After running virtual device, check if `adb devices` in console gives you an output
If no, then istall it as prompt suggests

If AND ONLY IF `@react-native-community/cli` is not present in package.json inside UndergroundProject,

`npm install --save-dev @react-native-community/cli`

# Checking if everything works correctly

After doing above steps, <b>With emulated device running</b> do:

`npx react-native doctor`

This will show you, which things you installed correctly and what do you need to fix

# Running Application

`npx react-native start` in one terminal - launches bundler

`npx react-native run-android` in the other one - runs app
