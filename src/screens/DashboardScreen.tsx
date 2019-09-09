import React from 'react';
import {Text, View, Button} from 'react-native';
import {Container, Content, Form, Picker} from 'native-base';
import { StyleSheet } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import {AsyncStorage} from 'react-native';



/**
 * Define Dashboard component
 */
export default class Dashboard extends React.Component<
{ /* Prop types */},
{ /* State types */
  timeBetweenCups: string,
  isBeginTimePickerVisible: boolean,
  isEndTimePickerVisible: boolean,
  beginTime: string,
  endTime: string,
  nextCupWatcherId: any,
  currentCup: Object | null,
}> {

  /**
   * Set initial Dashboard state
   */
  constructor(props) {
    super(props);
    this.state = {
      timeBetweenCups: '120',
      isBeginTimePickerVisible: false,
      isEndTimePickerVisible: false,
      beginTime: '',
      endTime: '',
      nextCupWatcherId: null,
      currentCup: null,
    };
  }

  /**
   * Actions after component is created
   */
  async componentDidMount () {

    // start counting every second till next cup of water
    const intervalId =
      setInterval(this.shouldIDrinkNextCup, 1000);

    // bind interval to component state
    this.setState({ nextCupWatcherId: intervalId })

    // this.storeCurrentWaterCup();
    this.loadCurrentWaterCup();
  }

  /**
   * Actions before component is removed
   */
  componentWillUnmount () {

    // stop counting till next cup
    clearInterval(this.state.nextCupWatcherId);
  }

  storeCurrentWaterCup = async () => {
    try {
      // store current water cup
      const currentWaterCup = JSON.stringify(this.state.currentCup)
      await AsyncStorage.setItem('WATER_CUP', currentWaterCup);

    } catch (error) {
      // error with storing water cup
      console.log('Error while storing water cup', error)
    }
  };

  loadCurrentWaterCup = async () => {
    // console.log('retreiving');
    try {
      const storedWaterCup = await AsyncStorage.getItem('WATER_CUP');

      if (storedWaterCup !== null) {
        // water cup was loaded - move it to state
        console.log('water cup was loaded - move it to state')
        this.setState({ currentCup: JSON.parse(storedWaterCup) })

      } else {
        // water cup was not loaded - reinit current cup
        console.log('water cup was not loaded - reinit current cup')
        this.reinitCurrentWaterCup()
      }
    } catch (error) {
      // error with retrieving water cup
      console.log('Error while getting water cup!', error)
    }
  };

  /**
   * Resets current water cup to a fresh one
   */
  reinitCurrentWaterCup () {
    const emptyWaterCup = {
      createdDate: new Date(),
      isEmpty: false
    }

    this.setState({ currentCup: emptyWaterCup })
    this.storeCurrentWaterCup()
  }

  /**
   * This method ensures if it's a proper
   * moment to drink next cup of water
   */
  shouldIDrinkNextCup () {
    // TODO
    console.log('checking')
  }

  /**
   * Show Begin time picker
   */
  showBeginTimePicker = () => {
    this.setState({ isBeginTimePickerVisible: true });
  };

  /**
   * Hide Begin time picker
   */
  hideBeginTimePicker = () => {
    this.setState({ isBeginTimePickerVisible: false });
  };

  /**
   * Handle Pick of Begin time
   */
  handleBeginTimePicked = date => {
    this.setState({ beginTime: date });
    this.hideBeginTimePicker();
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
    this.setState({ timeBetweenCups: newInterval })
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
                selectedValue={this.state.timeBetweenCups}
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
              <Text>{ this.state.timeBetweenCups }</Text>
            </Form>
          </View>

          <View style={styles.DashboardRow}>
            <Button title="Begin Time" onPress={this.showBeginTimePicker} />
            <DateTimePicker
              mode='time'
              timePickerModeAndroid='spinner'
              isVisible={this.state.isBeginTimePickerVisible}
              onConfirm={this.handleBeginTimePicked}
              onCancel={this.hideBeginTimePicker}
            />
            <Text>Begin: {this.state.beginTime.toString()}</Text>

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

          <View style={styles.DashboardRow}>
            <Text>Cup: {JSON.stringify(this.state.currentCup, null, 2)}</Text>
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
