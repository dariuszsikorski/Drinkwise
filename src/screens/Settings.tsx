import React from 'react';
import {Text} from 'react-native';
import {Container, Content} from 'native-base';

export default class Default extends React.Component {
  render () {
    return (
      <Container>
        <Content>
          <Text>
            Settings Screen
          </Text>
        </Content>
      </Container>
    )
  }
}