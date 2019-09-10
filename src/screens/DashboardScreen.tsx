import React from 'react';
import {Container, Content, Form, Picker} from 'native-base';
import { StyleSheet, AsyncStorage, Image, Text, View, Button, TouchableOpacity } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Audio } from 'expo-av';
import moment from "moment";


/*
 * Load images from assets folder
 */
const assets = {
  cupFull: require('../../assets/cup-full.png'),
  cupEmpty: require('../../assets/cup-empty.png'),
  iceCubes: require('../../assets/ice-cubes.mp3'),
  gulp: require('../../assets/gulp.mp3')
}

/**
 * Define Dashboard component
 */
export default class Dashboard extends React.Component<
{ /* Prop types */},
{ /* State types */
  nextCupWatcherId: number,
  nextDrinkCountdownText: string,
  isBeginTimePickerVisible: boolean,
  isEndTimePickerVisible: boolean,
  persistent: {
    beginTime: Date,
    endTime: Date,
    minutesBetweenCups: number,
    lastDrinkDate: Date,
    isEmpty: boolean
  },
}> {

  /**
   * Set initial Dashboard state
   */
  constructor(props) {
    super(props);
    this.state = {
      nextCupWatcherId: null,
      nextDrinkCountdownText: null,
      isBeginTimePickerVisible: false,
      isEndTimePickerVisible: false,
      persistent: {
        beginTime: new Date(1568095200635), // 8:00
        endTime: new Date(1568145600087), // 22:00
        minutesBetweenCups: 0.1, // 6sec
        lastDrinkDate: new Date(0),
        isEmpty: false
      }
    }
  }

  /**
   * Helper for setting state.persistent and saving in AsyncStorage
   * merges current data in state.persistent with given payload object
   */
  async setPersistentState (newPersistentState: object) {

    // merge current persistent state with given payload
    const finalPersistentState = {
      ...this.state.persistent,
      ...newPersistentState
    }

    // set merged persistent state in component
    this.setState({ persistent: finalPersistentState})

    try {
      // store merged persistent state in storage
      await AsyncStorage.setItem('PERSISTENT_STATE', JSON.stringify(finalPersistentState));

    } catch (error) {
      // handle error while saving storage
      console.error('Error while saving to storage', error)
    }
  }

  /**
   * Helper for populating state.persistent from AsyncStorage
   * merges current state.persistent with already stored data
   */
  async populatePersistentState () {

    try {
      // load persistent data from storage
      const persistentData = await AsyncStorage.getItem('PERSISTENT_STATE');

      if (persistentData !== null) {
        // populate state.persistent with loaded data
        console.log('populating state with', persistentData)
        this.setPersistentState(JSON.parse(persistentData));
      }
    } catch (error) {

      // handle error while loading persistent data
      console.error('Error while loading persistent data', error)
    }
  }

  /**
   * Tigger actions before component is mounted
   */
  componentWillMount () {
    // populate this.state.persistent with stored data
    this.populatePersistentState()
  }

  /**
   * Trigger actions when component is mounted
   */
  async componentDidMount () {

    // start counting every second till next cup of water
    const intervalId =
      setInterval(this.countdownNextTick.bind(this), 1000);

    // bind counter ID to component state
    this.setState({ nextCupWatcherId: intervalId })
  }

  /**
   * Actions before component is removed
   */
  componentWillUnmount () {

    // stop counting till next cup
    clearInterval(this.state.nextCupWatcherId);
  }

  /**
   * Resets current water cup to a fresh one
   */
  reinitWaterCupStatus = async () => {
    this.setPersistentState({ isEmpty: false })

    const soundObject = new Audio.Sound();
    await soundObject.loadAsync(assets.iceCubes);
    await soundObject.playAsync();

  }

  /**
   * Returns true/false whether counter is operating in snooze time 
   */
  isSnoozeTime () {

    const
      beginTime = new Date(this.state.persistent.beginTime),
      endTime = new Date(this.state.persistent.endTime),
      beginMoment = moment().set({
        'hour': beginTime.getHours(),
        'minutes': beginTime.getMinutes(),
        'seconds': 0
      }),
      endMoment = moment().set({
        'hour': endTime.getHours(),
        'minutes': endTime.getMinutes(),
        'seconds': 59
      }),
      isSnoozeTime = !moment().isBetween(beginMoment, endMoment)

      return isSnoozeTime
  }

  /**
   * This method checks if it's a proper
   * moment to drink next cup of water
   */
  countdownNextTick () {

    // skip checking if i should drink next cup if its already full
    if (!this.state.persistent.isEmpty) {
      return
    }

    // skip checking during snoozed time
    if (this.isSnoozeTime()) {
      this.setState({ nextDrinkCountdownText: 'Snoozed time!' })
      return
    }

    const minutesOffset = this.state.persistent.minutesBetweenCups;
    const lastCupDate = this.state.persistent.lastDrinkDate;

    // minutesOffset
    const offsetedLastCupDate = moment(lastCupDate).add(minutesOffset, 'm').toDate();

    const countdown = moment.duration(moment(offsetedLastCupDate).diff(moment()))

    const formatedCountdown = countdown.asMilliseconds() <= 0
      ? 'Now!' : moment.utc(countdown.add(1, 's').as('milliseconds')).format('HH:mm:ss')

    this.setState({ nextDrinkCountdownText: formatedCountdown })

    const isOvertime = moment().isAfter(offsetedLastCupDate);

    if (isOvertime) {
      this.reinitWaterCupStatus()
    }

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
  handleBeginTimePicked = (date: Date) => {
    this.setPersistentState({ beginTime: date });
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
    this.setPersistentState({ endTime: date });
    this.hideEndTimePicker();
  }

  /**
   * Handle Pick of reminder interval
   */
  handleIntervalPicked (newInterval) {
    this.setPersistentState({ minutesBetweenCups: newInterval })
  }

  /**
   * Empty the water cup when its touched
   */
  async handleWaterCupTouch () {

    // escape further actions while cup is already empty
    if (this.state.persistent.isEmpty) {
      return
    }

    this.setPersistentState({
      isEmpty: true,
      lastDrinkDate: new Date()
    })

    const soundObject = new Audio.Sound();
    await soundObject.loadAsync(assets.gulp);
    await soundObject.playAsync();

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
                source={this.state.persistent.isEmpty ? assets.cupEmpty : assets.cupFull}
              />
            </TouchableOpacity>
            <Text>{this.state.nextDrinkCountdownText}</Text>
          </View>

          <View style={styles.DashboardRow}>
            <Form>
              <Picker
                note
                mode="dropdown"
                style={styles.DashboardIntervalPicker}
                selectedValue={this.state.persistent.minutesBetweenCups}
                onValueChange={this.handleIntervalPicked.bind(this)}
              >
                <Picker.Item label="6 seconds" value={0.1} />
                <Picker.Item label="15 minutes" value={15} />
                <Picker.Item label="30 minutes" value={30} />
                <Picker.Item label="45 minutes" value={45} />
                <Picker.Item label="1 hour" value={60} />
                <Picker.Item label="1 hour 15 min" value={75} />
                <Picker.Item label="1 hour 30 min" value={90} />
                <Picker.Item label="1 hour 45 min" value={105} />
                <Picker.Item label="2 hours" value={120} />
              </Picker>
            </Form>
          </View>

          <View style={styles.DashboardRow}>

            <TouchableOpacity onPress={this.showBeginTimePicker}>
              <Text >Begin: {moment(this.state.persistent.beginTime).format('HH:mm')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.showEndTimePicker}>
              <Text>End: {moment(this.state.persistent.endTime).format('HH:mm')}</Text>
            </TouchableOpacity>

            <DateTimePicker
              mode='time'
              date={new Date(this.state.persistent.beginTime)}
              timePickerModeAndroid='spinner'
              isVisible={this.state.isBeginTimePickerVisible}
              onConfirm={this.handleBeginTimePicked}
              onCancel={this.hideBeginTimePicker}
            />

            <DateTimePicker
              mode='time'
              date={new Date(this.state.persistent.endTime)}
              timePickerModeAndroid='spinner'
              isVisible={this.state.isEndTimePickerVisible}
              onConfirm={this.handleEndTimePicked}
              onCancel={this.hideEndTimePicker}
            />
          </View>

          <View style={styles.DashboardRow}>
            <Text>{JSON.stringify(this.state, null, 2)}</Text>
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
    width: 190
  },
  DashboardRow: {
    borderWidth: 2,
    borderColor: 'red'
  },
});
