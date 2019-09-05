import React from 'react';
import { Text, View, TextInput, StyleSheet, Button } from 'react-native';
import { Link } from 'react-router-native';

// set TS types used as initial state
type PropTypes = { };
type StateTypes = {
  email: string,
  password: string,
  errorMessage: string | null
};

export default class Default extends React.Component<PropTypes, StateTypes> {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: null
    };
  }

  handleLogin = () => {
    console.log('TODO Implement login handling')
  }

  render () {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Login" onPress={this.handleLogin} />
        <Link to="/Register"><Text>Register</Text></Link>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    height: 32,
    width: '80%',
    borderColor: 'blue',
    borderWidth: 1,
    marginTop: 10
  }
})