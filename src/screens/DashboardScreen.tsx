import React from 'react';
import {Text} from 'react-native';
import {Container, Content} from 'native-base';
import { StyleSheet } from "react-native";

export default class Default extends React.Component {

  render () {
    return (
      <Container style={styles.DashboardScreenContainer}>
        <Content>
          <Text>
            Dashboard Screen
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
  DashboardScreenContainer: {
    borderWidth: 5
  },
});