import React from 'react';
import {Text, StyleSheet, View, ActivityIndicator} from 'react-native';

export default class Default extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading Drinkwise...</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})