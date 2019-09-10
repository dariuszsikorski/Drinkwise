import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableHighlight, TextInput } from "react-native";
import {
  NativeRouter,
  Route,
  Redirect,
  withRouter
} from "react-router-native";
import * as firebase from 'firebase';
import firebaseConfig from '../configs/firebase';
import DashboardScreen from './screens/DashboardScreen';
import { Header, Title, Left, Right, Body, Icon, Card, CardItem } from 'native-base';
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
  authenticate(login, password, cb) {
    firebase.auth().signInWithEmailAndPassword(login, password).then(function () {
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
  state = {
    redirectToReferrer: false,
    login: 'test@test.test',
    password: '123456',
  };

  login = () => {
    firebaseAuth.authenticate(this.state.login, this.state.password, () => {
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
      
       <Card style={styles.MainCard}>
          <CardItem style={styles.MainCardItem}>
            <Body style={styles.MainFormWrapper}>

              <Text style={styles.MainLoginHeader}>Login to your Account</Text>
      
              <TextInput
                style={styles.MainLoginInput}
                value={this.state.login}
                placeholder="Login"
                onChangeText={(login) => this.setState({login})}
                placeholderTextColor = "#afb2cc"
              ></TextInput>

              <TextInput
                style={styles.MainPasswordInput}
                value={this.state.password}
                placeholder="Password"
                onChangeText={(password) => this.setState({password})}
                placeholderTextColor = "#afb2cc"
                secureTextEntry={true}
              ></TextInput>

              <TouchableHighlight
                style={styles.MainLoginButton}
                onPress={this.login}
              >
                <Text style={styles.MainLoginButtonText}>Log in</Text>
              </TouchableHighlight>
      
            </Body>
          </CardItem>
        </Card>

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
    borderWidth: 5,
    borderColor: 'purple',
  },
  MainHeader: {
    paddingTop: getStatusBarHeight(),
    height: 54 + getStatusBarHeight(),
    backgroundColor: '#005bab',
  },
  MainLogOutButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    color: '#fff',
  },
  MainLogOutIcon: {
    color: '#fff',
  },
  MainCard: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 25,
    paddingBottom: 25,
  },
  MainCardItem: {
    paddingBottom: 20,
  },
  MainFormWrapper: {
    alignItems: 'stretch',
  },
  MainLoginHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  MainLoginInput: {
    borderBottomWidth: 1,
    borderColor: '#bfc2cc',
    padding: 10,
    marginTop: 15,
    borderRadius: 4,
  },
  MainPasswordInput: {
    borderBottomWidth: 1,
    borderColor: '#bfc2cc',
    padding: 10,
    marginTop: 15,
    borderRadius: 4,
  },
  MainLoginButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 35,
    backgroundColor: '#34bce9',
    borderRadius: 4.
  },
  MainLoginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Main ;
