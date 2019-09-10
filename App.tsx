import React from 'react';
import { ScreenOrientation, AppLoading } from 'expo';
import * as Font from 'expo-font';
import Main from './src/Main';
import { Ionicons } from '@expo/vector-icons';


/**
 * Allow Landscape and Portrait Orientations
 */
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL);


/**
 * Render main component of the application
 */
export default class App extends React.Component<
  { /* Prop types */},
  { isReady: Boolean }
> {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  /**
   * Register font and hide loader when mounted
   */
  async componentDidMount() {

    // register fonts for native base
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render () {

    // show loader before app is mounted
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    // render main application
    return (
      <Main />
    );
  }
}