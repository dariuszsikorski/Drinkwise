import React from 'react';
import { Text } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import FirstScreen from './screens/_FirstScreen';
import SecondScreen from './screens/_SecondScreen';
import DefaultScreen from './screens/_DefaultScreen';
import LoadingScreen from './screens/Loading';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import MainScreen from './screens/Main';
import SettingsScreen from './screens/Settings';

/**
 * Initialize App
 */
// initializeApp();

/**
 * Define and render Root Component of the App
 */
export default class App extends React.Component {

  render () {
    return (
      <NativeRouter>
        <Text> </Text>

        <Link to="/loading">
          <Text>Loading</Text>
        </Link>

        <Link to="/Login">
          <Text>Login</Text>
        </Link>

        <Link to="/Register">
          <Text>Register</Text>
        </Link>

        <Link to="/">
          <Text>Main</Text>
        </Link>

        <Link to="/settings">
          <Text>Settings</Text>
        </Link>

        <Route exact path="/loading" component={LoadingScreen} />
        <Route exact path="/login" component={LoginScreen} />
        <Route exact path="/register" component={RegisterScreen} />
        <Route exact path="/settings" component={SettingsScreen} />
        <Route exact path="/" component={MainScreen} />
      </NativeRouter>
    );
  }
}