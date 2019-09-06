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
      <View style={styles.container}>
        <View style={styles.nav}>
          <Link to="/public" style={styles.navItem} underlayColor="#f0f4f7">
            <Text>Pgubl</Text>
          </Link>
          <Link to="/protected" style={styles.navItem} underlayColor="#f0f4f7">
            <Text>Prot</Text>
          </Link>
          <Link to="/dashboard" style={styles.navItem} underlayColor="#f0f4f7">
            <Text>Dash</Text>
          </Link>
          <Link to="/settings" style={styles.navItem} underlayColor="#f0f4f7">
            <Text>Sett</Text>
          </Link>
        </View>
      </View>

        <SignOutButton />
        <Route path="/public" component={Public} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/protected" component={Protected} />
        <PrivateRoute path="/dashboard" component={DashboardScreen} />
        <PrivateRoute path="/settings" component={SettingsScreen} />
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
          style={styles.button}
          underlayColor="#f0f4f7"
          onPress={() => {
            firebaseAuth.signout(() => history.push("/public"));
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
 * Example public view
 */
function Public() {
  return <Text>Public</Text>;
}



/**
 * Example private (protected) view
 */
function Protected() {
  return <Text>Protected</Text>;
}



/**
 * Login button and redirection
 */
class Login extends Component {
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
      <View>
        <Text>Please login to visit page {from.pathname}</Text>

        <TouchableHighlight
          style={styles.button}
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
  container: {
    marginTop: 25,
    padding: 10
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    padding: 10
  },
  button: {
    width: 200,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 10
  }
});

export default Main ;
