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

// set TS types used as initial state
type PropTypes = { };
type StateTypes = { isReady: Boolean };

// define component
export default class App extends React.Component<PropTypes, StateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <Main />
    );
  }
}