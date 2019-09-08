import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import {
  NativeRouter,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-native";
import * as firebase from 'firebase';
import firebaseConfig from '../configs/firebase';
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Header, Title, Left, Right, Body } from 'native-base';
import { getStatusBarHeight } from 'react-native-status-bar-height';

/**
 * Initialize Firebase
 */ 
firebase.initializeApp(firebaseConfig);




/**
 * Main component with routes
 */
function Main () {
  return (
    
    <NativeRouter>

      <Header style={styles.MainHeader}>
        <Left>
        </Left>
        <Body>
          <Title>DrinkWise</Title>
        </Body>
        <Right>
          <SignOutButton />
        </Right>
      </Header>

      <View style={styles.MainNavigation}>
        <Link to="/" style={styles.MainNavigationItem} underlayColor="#f0f4f7">
          <Text>Dash</Text>
        </Link>
        <Link to="/settings" style={styles.MainNavigationItem} underlayColor="#f0f4f7">
          <Text>Sett</Text>
        </Link>
      </View>

      <Route exact path="/login" component={LoginForm} />
      <PrivateRoute exact path="/" component={DashboardScreen} />
      <PrivateRoute exact path="/settings" component={SettingsScreen} />
      
    </NativeRouter>
  );
}



/**
 * Store authentication state and sign-in/out methods
 */
const firebaseAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    firebase.auth().signInWithEmailAndPassword('test@test.test', '123456').then(function () {
      console.log('SIGNED IN')
      firebaseAuth.isAuthenticated = true;
      cb()
    }).catch(function(error) {
      console.log('SIGN IN ERROR', error.code, error.message);
    });
  },
  signout(cb) {
    firebase.auth().signOut().then(function() {
      console.log('SIGNED OUT');
      firebaseAuth.isAuthenticated = false;
      cb()
    }).catch(function(error) {
      console.log('SIGN OUT ERROR');
    });
  },
};



/**
 * Sign Out Button
 */
const SignOutButton = withRouter(
  ({ history }) =>
    firebaseAuth.isAuthenticated ? (
      <View>
        <TouchableHighlight
          style={styles.SessionButton}
          underlayColor="#f0f4f7"
          onPress={() => {
            firebaseAuth.signout(() => history.push("/"));
          }}
        >
          <Text>Sign out</Text>
        </TouchableHighlight>
      </View>
    ) : (
      // Not logged in state
      null
    )
);



/**
 * Routes requiring authentication
 */
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        firebaseAuth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}



/**
 * Login form and redirection
 */
class LoginForm extends Component {
  state = { redirectToReferrer: false };

  login = () => {
    firebaseAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <View style={styles.LoginFormView}>
        <Text>Welcome to Drinkwise</Text>
        <Text style={styles.LoginFormHeader}>Login</Text>

        <TouchableHighlight
          style={styles.SessionButton}
          underlayColor="#f0f4f7"
          onPress={this.login}
        >
          <Text>Log in</Text>
        </TouchableHighlight>
      </View>
    );
  }
}



/**
 * App styles
 */
const styles = StyleSheet.create({
  LoginFormView: {
    borderWidth: 5
  },
  LoginFormHeader: {
    fontSize: 30
  },
  MainHeader: {
    paddingTop: getStatusBarHeight(),
    height: 54 + getStatusBarHeight(),
  },
  MainNavigation: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  MainNavigationItem: {
    flex: 1,
    alignItems: "center",
    padding: 10
  },
  SessionButton: {
    width: 200,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 10
  }
});

export default Main ;
