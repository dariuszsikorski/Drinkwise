import React from 'react';
import {Text} from 'react-native';
import {Container, Content} from 'native-base';
import { StyleSheet } from "react-native";

export default class Default extends React.Component {
  render () {
    return (
      <Container style={styles.SettingsScreenContainer}>
        <Content>
          <Text>
            Settings Screen
          </Text>
        </Content>
      </Container>
    )
  }
}

/**
 * Component Styles
 */
const styles = StyleSheet.create({
  SettingsScreenContainer: {
    borderWidth: 5
  },
});