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
  minutesBetweenCups: number,
  isBeginTimePickerVisible: boolean,
  isEndTimePickerVisible: boolean,
  beginTime: string,
  endTime: string,
  nextCupWatcherId: any,
  nextDrinkCountdownText: string,
  currentCup: {
    lastDrinkDate: Date,
    isEmpty: boolean
  },
  persistent: any,
}> {

  /**
   * Set initial Dashboard state
   */
  constructor(props) {
    super(props);
    this.state = {
      minutesBetweenCups: 0.1,
      nextDrinkCountdownText: null,
      isBeginTimePickerVisible: false,
      isEndTimePickerVisible: false,
      beginTime: '',
      endTime: '',
      nextCupWatcherId: null,
      currentCup: {
        lastDrinkDate: null,
        isEmpty: false
      },
      persistent: {
      }
    }
  }

  /**
   * Helper for setting state.persistent with AsyncStorage autosave
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
   * merges current state.persistent with stored data
   */
  async populatePersistentState () {

    try {
      // load persistent data from storage
      const persistentData = await AsyncStorage.getItem('PERSISTENT_STATE');

      if (persistentData !== null) {
        // populate state.persistent with loaded data
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

    // bind interval to component state
    this.setState({ nextCupWatcherId: intervalId })

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
      const storedWaterCup = await AsyncStorage.getItem('WATER_CUP');

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
  reinitWaterCupStatus = async () => {
    const emptyWaterCup = {
      ...this.state.currentCup
    }
    emptyWaterCup.isEmpty = false;

    this.setState({ currentCup: emptyWaterCup })

    const soundObject = new Audio.Sound();
    await soundObject.loadAsync(assets.iceCubes);
    await soundObject.playAsync();

  }

  /**
   * This method checks if it's a proper
   * moment to drink next cup of water
   */
  countdownNextTick () {

    // skip checking if i should drink next cup if its already full
    if (!this.state.currentCup.isEmpty) {
      return
    }

    const minutesOffset = this.state.minutesBetweenCups;
    const lastCupDate = this.state.currentCup.lastDrinkDate;

    // minutesOffset
    const offsetedLastCupDate = moment(lastCupDate).add(minutesOffset, 'm').toDate();
    const currentMoment = new Date();

    const countdown = moment.duration(moment(offsetedLastCupDate).diff(moment(currentMoment)))

    const formatedCountdown = countdown.asMilliseconds() <= 0
      ? 'Now!' : moment.utc(countdown.add(1, 's').as('milliseconds')).format('HH:mm:ss')

    this.setState({ nextDrinkCountdownText: formatedCountdown })

    const isOvertime = moment(currentMoment).isAfter(offsetedLastCupDate);

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
    this.setState({ minutesBetweenCups: newInterval })
  }

  /**
   * Empty the water cup when its touched
   */
  async handleWaterCupTouch () {

    // escape further actions while cup is already empty
    if (this.state.currentCup.isEmpty) {
      return
    }

    const currentCup = {...this.state.currentCup}
    currentCup.isEmpty = true;
    currentCup.lastDrinkDate = new Date();
    this.setState({currentCup})

    this.storeWaterCupStatus()

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
                source={this.state.currentCup.isEmpty ? assets.cupEmpty : assets.cupFull}
              />
            </TouchableOpacity>
            <Text>Next drink in: {this.state.nextDrinkCountdownText}</Text>
          </View>

          <View style={styles.DashboardRow}>
            <Form>
              <Picker
                note
                mode="dropdown"
                style={styles.DashboardIntervalPicker}
                selectedValue={this.state.minutesBetweenCups}
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
              <Text>{ this.state.minutesBetweenCups }</Text>
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
            <Text>Cup: {JSON.stringify(this.state, null, 2)}</Text>
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
