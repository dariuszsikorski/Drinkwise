## Drinkwise

An Android App reminding You to drink a cup of water written in React Native

<img src="./assets/icon.png">

### Installation on Android
1. download `builds/drinkwise-latest.apk`
2. copy to your phone
3. install APK using file manager of your choice
4. proceed with installation when you will be alerted of unknown source and author. App was simply built with Expo.io online services

### Things which I didn't implement at the moment
* Migrate app to Redux
* Add Push Notifications
* Run app with a background process when it's closed
* Split app to separate component files and communicate over Redux
* Consistent component declarations - they should extend React.Component everywhere
* Implement water cup counter with animation


### Installation

1. Install packages
```
yarn install
```

2. Run expo server for app
```
yarn start
```

3. Install Expo on your mobile phone and scan server QR code

### Links
Project is using following technologies:
* https://docs.expo.io/versions/latest/
* https://facebook.github.io/react-native/
* https://nativebase.io/
* https://www.typescriptlang.org/
* https://firebase.google.com/

### Building application for Android
```
expo build:android 
```

### Author
Dariusz Sikorski


### License
See LICENSE.md