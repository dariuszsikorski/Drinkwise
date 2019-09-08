import React from 'react';
import {Text} from 'react-native';
import {Container, Content, Form, Picker} from 'native-base';
import { StyleSheet } from "react-native";

export default class Default extends React.Component {

  state = {
    interval: '120min'
  }

  handleIntervalPickerChange (newInterval) {
    this.setState({ interval: newInterval })
  }

  render () {
    return (
      <Container style={styles.DashboardContainer}>
        <Content>
          <Text>
            Dashboard Screen
          </Text>

          <Form>
            <Picker
              note
              mode="dropdown"
              style={styles.DashboardIntervalPicker}
              selectedValue={this.state.interval}
              onValueChange={this.handleIntervalPickerChange.bind(this)}
            >
              <Picker.Item label="15 min" value="15min" />
              <Picker.Item label="30 min" value="30min" />
              <Picker.Item label="45 min" value="45min" />
              <Picker.Item label="1hr" value="60min" />
              <Picker.Item label="1hr 15min" value="75min" />
              <Picker.Item label="1hr 30min" value="90min" />
              <Picker.Item label="1hr 45min" value="105min" />
              <Picker.Item label="2hr" value="120min" />
            </Picker>
          </Form>

          <Text>{ this.state.interval }</Text>

        </Content>
      </Container>
    )
  }
}

/**
 * Component Styles
 */
const styles = StyleSheet.create({
  DashboardContainer: {
    borderWidth: 5
  },
  DashboardIntervalPicker: {
    width: 150,
  }
});