/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {Platform, StyleSheet, Text, View} from 'react-native';
import {
  createStackNavigator,
} from 'react-navigation';

import PeriodEditor from './src/components/PeriodEditor';
import Home from './src/pages/Home';


const App = createStackNavigator({
  Home: { screen: Home },
  Calendar: { screen: PeriodEditor },
});

export default App;