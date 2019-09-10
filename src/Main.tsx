import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import {
  NativeRouter,
  Route,
  Redirect,
  withRouter
} from "react-router-native";
import * as firebase from 'firebase';
import firebaseConfig from '../configs/firebase';
import DashboardScreen from './screens/DashboardScreen';
import { Header, Title, Left, Right, Body, Icon } from 'native-base';
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
        <Left style={styles.MainHeaderFlexStretch} />
        <Body  style={styles.MainHeaderFlexStretch}>
          <Title style={styles.MainHeaderTitle}>Drinkwise</Title>
        </Body>
        <Right style={styles.MainHeaderFlexStretch}>
          <SignOutButton />
        </Right>
      </Header>

      <PrivateRoute exact path="/" component={DashboardScreen} />
      <Route exact path="/login" component={LoginForm} />
      
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
          style={styles.MainLogOutButton}
          onPress={() => {
            firebaseAuth.signout(() => history.push("/"));
          }}
        >
          <Icon name='log-out' style={styles.MainLogOutIcon} />
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

  // Auto log in for dev purposes
  componentDidMount () {
    this.login()
  }

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
  MainHeaderFlexStretch: {
    flex: 1,
  },
  MainHeaderTitle: {
    fontSize: 16,
    paddingLeft: 20,
  },
  LoginFormView: {
    borderWidth: 5
  },
  LoginFormHeader: {
    fontSize: 30
  },
  MainHeader: {
    paddingTop: getStatusBarHeight(),
    height: 54 + getStatusBarHeight(),
    backgroundColor: '#005bab',
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
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    color: '#fff',

  },
  MainLogOutButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    color: '#fff',
  },
  MainLogOutIcon: {
    color: '#fff',
  }
});

export default Main ;
