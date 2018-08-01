/**
 * @flow
 */

import React, {
  PureComponent,
} from 'react';

import {
  FlatList,
} from 'react-native';

export class CalendarList extends PureComponent<*> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FlatList />
    );
  }
}

export default CalendarList;
