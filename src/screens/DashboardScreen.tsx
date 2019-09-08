import React from 'react';
import {Text, View} from 'react-native';
import {Container, Content, Form, Picker} from 'native-base';
import { StyleSheet } from "react-native";

export default class Default extends React.Component {

  state = {
    interval: '120'
  }

  handleIntervalPickerChange (newInterval) {
    this.setState({ interval: newInterval })
  }

  render () {
    return (
      <Container style={styles.DashboardContainer}>
        <Content>


          <View style={styles.DashboardRow}>
            <Text>Dashboard Screen</Text>
          </View>


          <View style={styles.DashboardRow}>
            <Form>
              <Picker
                note
                mode="dropdown"
                style={styles.DashboardIntervalPicker}
                selectedValue={this.state.interval}
                onValueChange={this.handleIntervalPickerChange.bind(this)}
              >
                <Picker.Item label="15 min" value="15" />
                <Picker.Item label="30 min" value="30" />
                <Picker.Item label="45 min" value="45" />
                <Picker.Item label="1hr" value="60" />
                <Picker.Item label="1hr 15min" value="75" />
                <Picker.Item label="1hr 30min" value="90" />
                <Picker.Item label="1hr 45min" value="105" />
                <Picker.Item label="2hr" value="120" />
              </Picker>

              <Text>{ this.state.interval }</Text>
            </Form>
          </View>

          <View style={styles.DashboardRow}>
            <Text>abcdef</Text>
          </View>


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
    width: 150
  },
  DashboardRow: {
    borderWidth: 2,
    borderColor: 'red'
  },
});