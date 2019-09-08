import React from 'react';
import {Text, View, Button} from 'react-native';
import {Container, Content, Form, Picker} from 'native-base';
import { StyleSheet } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";


/**
 * Define Dashboard component
 */
export default class Dashboard extends React.Component<
{ /* TS prop types */},
{ // TS state types
  interval: string,
  isStartTimePickerVisible: boolean,
  isEndTimePickerVisible: boolean,
  startTime: string,
  endTime: string,
}> {

  /**
   * Set initial Dashboard state
   */
  constructor(props) {
    super(props);
    this.state = {
      interval: '120',
      isStartTimePickerVisible: false,
      isEndTimePickerVisible: false,
      startTime: '',
      endTime: ''
    };
  }

  /**
   * Show Start time picker
   */
  showStartTimePicker = () => {
    console.log('showStartTimePicker')
    this.setState({ isStartTimePickerVisible: true });
  };

  /**
   * Hide Start time picker
   */
  hideStartTimePicker = () => {
    console.log('hideStartTimePicker')
    this.setState({ isStartTimePickerVisible: false });
  };

  /**
   * Handle Pick of start time
   */
  handleStartTimePicked = date => {
    console.log("Start time picked: ", date);
    this.setState({ startTime: date });
    this.hideStartTimePicker();
  };

  /**
   * Show End time picker
   */
  showEndTimePicker = () => {
    console.log('showEndTimePicker')
    this.setState({ isEndTimePickerVisible: true });
  };

  /**
   * Hide End time picker
   */
  hideEndTimePicker = () => {
    console.log('hideEndTimePicker')
    this.setState({ isEndTimePickerVisible: false });
  };

  /**
   * Handle pick of end time
   */
  handleEndTimePicked = date => {
    console.log("End time picked: ", date);
    this.setState({ endTime: date });
    this.hideEndTimePicker();
  };

  /**
   * Handle Pick of reminder interval
   */
  handleIntervalPicked (newInterval) {
    this.setState({ interval: newInterval })
  }

  /**
   * Render template of the component
   */
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
                onValueChange={this.handleIntervalPicked.bind(this)}
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

            <Button title="Start Time" onPress={this.showStartTimePicker} />
            <DateTimePicker
              mode='time'
              timePickerModeAndroid='spinner'
              isVisible={this.state.isStartTimePickerVisible}
              onConfirm={this.handleStartTimePicked}
              onCancel={this.hideStartTimePicker}
            />
            <Text>Start: {this.state.startTime.toString()}</Text>

            <Button title="End Time" onPress={this.showEndTimePicker} />
            <DateTimePicker
              mode='time'
              timePickerModeAndroid='spinner'
              isVisible={this.state.isEndTimePickerVisible}
              onConfirm={this.handleEndTimePicked}
              onCancel={this.hideEndTimePicker}
            />
            <Text>End: {this.state.endTime.toString()}</Text>

          </View>
        </Content>
      </Container>
    )
  }
}

/**
 * Dashboard component styles
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