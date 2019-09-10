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
 * Initialize Firebase connection
 */ 
firebase.initializeApp(firebaseConfig);


/**
 * Define main component with routes
 */
export default class Main extends React.Component<
  { /* Prop types */},
  { /* State types */ }
  > {

    render () {
      return (
        <NativeRouter>
    
          {/* Global application header */}
          <Header style={styles.MainHeader}>
            <Left style={styles.MainHeaderFlexStretch} />
            <Body  style={styles.MainHeaderFlexStretch}>
              <Title style={styles.MainHeaderTitle}>Drinkwise</Title>
            </Body>
            <Right style={styles.MainHeaderFlexStretch}>
              <SignOutButton />
            </Right>
          </Header>
    
          {/* Define protected and public route paths */}
          <PrivateRoute exact path="/" component={DashboardScreen} />
          <Route exact path="/login" component={LoginForm} />
          
        </NativeRouter>
      )
    }
}


/**
 * Store authentication status and sign-in/out methods
 */
const firebaseAuth = {
  // current authentication status
  isAuthenticated: false,

  // handle user authentication with given credentials
  authenticate(login, password, callback) {
    firebase.auth().signInWithEmailAndPassword(login, password).then(function () {
      firebaseAuth.isAuthenticated = true;
      callback()
    }).catch(function(error) {
      console.error('SIGN IN ERROR', error.code, error.message);
    });
  },

  // handle user sign-out
  signout(callback) {
    firebase.auth().signOut().then(function() {
      firebaseAuth.isAuthenticated = false;
      callback()
    }).catch(function(error) {
      console.error('SIGN OUT ERROR');
    });
  },
};


/**
 * Sign out icon rendered on header
 */
const SignOutButton = withRouter(
  // create component with router for history access
  ({ history }) =>

    // render button only if authenticated
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

      // do not render if not authenticated
      null
    )
);


/**
 * Special component rendering private
 * routes or redirecting to login form
 */
function PrivateRoute({ component: Component, ...rest }) {
  
  return (
    <Route
      {...rest}
      render={props =>
        firebaseAuth.isAuthenticated ? (

          // render protected view if authenticated
          <Component {...props} />
        ) : (

          // redirect to login path if non-authenticated
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
 * Login form rendered on /login route 
 */
class LoginForm extends Component<
{
  location: {
    state: any,
  }
},
{/* State Types */}> {
  state = {
    redirectToReferrer: false,
    login: 'test@test.test',
    password: '123456',
  };

  handleLoginClick = () => {
    firebaseAuth.authenticate(this.state.login, this.state.password, () => {
      this.setState({ redirectToReferrer: true });
    });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } }
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      
       // render login form  
       <Card style={styles.MainCard}>
          <CardItem style={styles.MainCardItem}>
            <Body style={styles.MainFormWrapper}>

              {/* Header */}
              <Text style={styles.MainLoginHeader}>Login to your Account</Text>
      
              {/* Login Input  */}
              <TextInput
                style={styles.MainLoginInput}
                value={this.state.login}
                placeholder="Login"
                onChangeText={(loginString) => this.setState({loginString})}
                placeholderTextColor = "#afb2cc"
              ></TextInput>

              {/* Password Input */}
              <TextInput
                style={styles.MainPasswordInput}
                value={this.state.password}
                placeholder="Password"
                onChangeText={(passwordString) => this.setState({passwordString})}
                placeholderTextColor = "#afb2cc"
                secureTextEntry={true}
              ></TextInput>

              {/* Log-in BUtton */}
              <TouchableHighlight
                style={styles.MainLoginButton}
                onPress={this.handleLoginClick}
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
 * Main styles
 */
const styles = StyleSheet.create({
  MainHeaderFlexStretch: {
    flex: 1,
  },
  MainHeaderTitle: {
    fontSize: 16,
    paddingLeft: 20,
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