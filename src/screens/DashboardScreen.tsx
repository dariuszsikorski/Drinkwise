import React from 'react';
import {Container, Content, Form, Picker} from 'native-base';
import { StyleSheet, AsyncStorage, Image, Text, View, Button, TouchableOpacity } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

/*
 * Load images from assets folder
 */
const assets = {
  cupFull: require('../../assets/cup-full.png'),
  cupEmpty: require('../../assets/cup-empty.png')
}

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
  currentCup: {
    createdDate: Date,
    isEmpty: boolean
  },
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
      currentCup: {
        createdDate: new Date(),
        isEmpty: false
      },
    }
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

    // this.storeWaterCupStatus();
    this.loadWaterCupStatus();
  }

  /**
   * Actions before component is removed
   */
  componentWillUnmount () {

    // stop counting till next cup
    clearInterval(this.state.nextCupWatcherId);
  }

  storeWaterCupStatus = async () => {
    try {
      // store current water cup
      const waterCupStatus = JSON.stringify(this.state.currentCup)
      await AsyncStorage.setItem('WATER_CUP', waterCupStatus);

    } catch (error) {
      // error with storing water cup
      console.log('Error while storing water cup', error)
    }
  }

  loadWaterCupStatus = async () => {
    // console.log('retreiving');
    try {
      const storedWaterCup = await AsyncStorage.getItem('WATER_CUPh');

      if (storedWaterCup !== null) {
        // water cup was loaded - move it to state
        console.log('water cup was loaded - move it to state')
        this.setState({ currentCup: JSON.parse(storedWaterCup) })

      } else {
        // water cup was not loaded - reinit current cup
        console.log('water cup was not loaded - reinit current cup')
        this.reinitWaterCupStatus()
      }
    } catch (error) {
      // error with retrieving water cup
      console.log('Error while getting water cup!', error)
    }
  }

  /**
   * Resets current water cup to a fresh one
   */
  reinitWaterCupStatus = () => {
    const emptyWaterCup = {
      createdDate: new Date(),
      isEmpty: false
    }

    this.setState({ currentCup: emptyWaterCup })
    // this.storeWaterCupStatus()
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
  }

  /**
   * Hide Begin time picker
   */
  hideBeginTimePicker = () => {
    this.setState({ isBeginTimePickerVisible: false });
  }

  /**
   * Handle Pick of Begin time
   */
  handleBeginTimePicked = date => {
    this.setState({ beginTime: date });
    this.hideBeginTimePicker();
  }

  /**
   * Show End time picker
   */
  showEndTimePicker = () => {
    console.log('showEndTimePicker')
    this.setState({ isEndTimePickerVisible: true });
  }

  /**
   * Hide End time picker
   */
  hideEndTimePicker = () => {
    console.log('hideEndTimePicker')
    this.setState({ isEndTimePickerVisible: false });
  }

  /**
   * Handle pick of end time
   */
  handleEndTimePicked = date => {
    console.log("End time picked: ", date);
    this.setState({ endTime: date });
    this.hideEndTimePicker();
  }

  /**
   * Handle Pick of reminder interval
   */
  handleIntervalPicked (newInterval) {
    this.setState({ timeBetweenCups: newInterval })
  }

  /**
   * Empty the water cup when its touched
   */
  handleWaterCupTouch () {
    const currentCup = {...this.state.currentCup}
    currentCup.isEmpty = true;
    this.setState({currentCup})
  }

  /**
   * Render template of the component
   */
  render () {
    return (
      <Container style={styles.DashboardContainer}>
        <Content>

          <View style={styles.DashboardRow}>
            <TouchableOpacity onPress={this.handleWaterCupTouch.bind(this)}>
              <Image
                style={{height: 254, width: 148}}
                source={this.state.currentCup.isEmpty ? assets.cupEmpty : assets.cupFull}
              />
            </TouchableOpacity>
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
                <Picker.Item label="1 min" value="1" />
                <Picker.Item label="15 min" value="15" />
                <Picker.Item label="30 min" value="30" />
                <Picker.Item label="45 min" value="45" />
                <Picker.Item label="60 min" value="60" />
                <Picker.Item label="75 min" value="75" />
                <Picker.Item label="90 min" value="90" />
                <Picker.Item label="105 min" value="105" />
                <Picker.Item label="120 min" value="120" />
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
