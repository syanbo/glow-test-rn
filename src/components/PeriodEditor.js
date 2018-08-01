/**
 * @flow
 */
import React, {
  Component
} from 'react';

import {
  Text,
  View,
  StyleSheet,
  Platform,
} from 'react-native';

import CalendarList from './CalendarList';
import { Colors } from '../common/Colors';

export class PeriodEditor extends Component {

  render() {
    let names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return (
      <View style={style.wrapper}>
        <View style={style.appBarLayout} >
          <View style={style.headerWrapper}>
            <View style={style.week}>
              {names.map((day, idx) => (
                <Text allowFontScaling={false} key={idx} style={style.headerWeekday} numberOfLines={1}>{day}</Text>
              ))}
            </View>
          </View>
        </View>
        <CalendarList
          style={style.calendarList}
          pastScrollRange={72}
          futureScrollRange={12}
          ref={(ref) => { this.calendarList = ref; }}
          selectedDay={this.props.selectedDayData}
          onVisibleMonthsChange={this._visibleMonthsChange}
          scrollingEnabled={true}
        />
      </View>
    );
  }
}

export default PeriodEditor;

const style = StyleSheet.create({
  appBarLayout: {
    ...Platform.select({
      android: {
        elevation: 2,
        backgroundColor: '#FFFFFF'
      },
      ios: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#e0e0e0",
      },
    })
  },
  wrapper: {
    flex: 1,
    width: '100%',
  },
  calendarList: {
    width: '100%',
  },
  headWrapper: {
    flex: 0,
    ...Platform.select({
      android: {
        height: 42,
      },
      ios: {
        height: 32,
      }
    }),
    paddingHorizontal: 16,
  },
  week: {
    ...Platform.select({
      android: {
        marginTop: 12,
      },
      ios: {
        marginTop: 7,
      }
    }),
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  headerWeekday: {
    marginTop: 2,
    marginBottom: 7,
    width: 32,
    textAlign: 'center',
    fontSize: 11,
    color: Colors.TEXT_LIGHT,
  },
});
