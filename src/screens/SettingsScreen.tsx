import React from 'react';
import {Text} from 'react-native';
import {Container, Content} from 'native-base';
import { StyleSheet } from "react-native";


/**
 * Define settings component
 */
export default class Settings extends React.Component {
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
 * Settings styles
 */
const styles = StyleSheet.create({
  SettingsScreenContainer: {
    /* ... */
  },
});