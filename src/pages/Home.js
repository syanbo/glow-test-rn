/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Platform, StyleSheet, Button, Text, View } from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class Home extends Component<*> {
  static navigationOptions =
  {
     title: 'Home',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to paticipate this task!</Text>
        <Text style={styles.instructions}>To get started, read and edit CalendarList.js</Text>
        <Text style={styles.instructions}>Create and modify anything you need.</Text>
        <Text style={styles.instructions}></Text>
        <Text style={styles.instructions}>/* === Original RN instruction below: === */</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button
          title="Enter calendar"
          onPress={() =>
            navigate('Calendar', { name: 'Calendar' })
          }
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
