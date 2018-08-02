/**
 * @flow
 */

import React, {
  PureComponent
} from 'react';

import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform
} from 'react-native';

const { width } = Dimensions.get('window');

const ITEM_HEADER = 44; // 月份高度
const ITEM_SPACE = 10;  // item 间距
const ITEM_WIDTH = ~~((width - ITEM_SPACE * 2) / 7); // item高度

import XDate from 'xdate';
import * as dateUtils from './dateUtils';

export default class CalendarList extends PureComponent<*> {
  constructor(props) {
    super(props);

    const { pastScrollRange, futureScrollRange } = props;
    const rows = [];
    const date = XDate();

    // 数据源处理
    let offset = 0;
    for (let i = 0; i <= pastScrollRange + futureScrollRange; i++) {
      const rangeDate = date.clone().addMonths(i - pastScrollRange, true);
      const rangeDateStr = rangeDate.toString('yyyy年MM月');

      const days = dateUtils.page(rangeDate, 0);
      const count = days.length / 7;
      const H = count * ITEM_WIDTH + ITEM_HEADER;
      // 记录每个Item的offset 为getItemLayout准备
      offset = offset + H;
      let row = {
        date: rangeDate,
        dateString: rangeDateStr,
        days: days.map(d => ({
          day: d,
          selected:
            dateUtils.sameDate(d, date),
          isEdit: false,
          isEditSelected: false // 编辑状态下的选中
        })),
        height: H,
        offset
      };
      if (dateUtils.sameMonth(rangeDate, date)) {
        row.isToMonth = true;
        // 记录今天的 offset 值
        this.toDayOffset = offset;
      } else {
        row.isToMonth = false;
      }
      // 默认显示当前月份和上下 一共3个月份的数据
      row.show = (pastScrollRange - 1 <= i && i <= pastScrollRange + 1 || !pastScrollRange && i <= pastScrollRange + 2);
      rows.push(row);
    }

    this.state = {
      rows,
      isEdit: false, // 控制编辑
      showToDay: false // 控制是否显示 回到今天按钮
    };
  }

  renderCalendar = ({ item, index }) => {
    return <Item {...item} index={index} onPress={this.onPressDay}/>;
  };

  getItemLayout = (data, index) => {
    const item = data[index];
    if (index === -1) {
      // -1 的情况设置0 是否合适
      return { length: 0, offset: 0, index };
    } else {
      return { length: item.height, offset: item.offset, index };
    }
  };

  /**
   * 可视区域数组改变 show 值
   * 奇怪的问题 viewableItems 有时为1
   */
  onViewableItemsChanged = ({ viewableItems }) => {
    const newRows = this.state.rows.map((v, i) => {
      // return {
      //   ...v,
      //   show: !!viewableItems.find(f => f.index === i)
      // };
      return {
        ...v,
        show: !!viewableItems.some(f => Math.abs(i - f.index) <= 1)
      };
    });
    this.setState({
      rows: newRows,
      showToDay: !viewableItems.some(v => v.item.isToMonth)
    });
  };

  /**
   * 点击天数
   */
  onPressDay = ({ isEdit, isEditSelected }, index, monthIndex) => {
    if (isEdit) {
      console.log(index, monthIndex, '---');
      this.setState((partialState) => {
        return {
          rows: partialState.rows.map((v, i) => {
            if (monthIndex === i) {
              return {
                ...v,
                days: v.days.map((d, di) => {
                  if (di === index) {
                    return { ...d, isEditSelected: !d.isEditSelected };
                  } else {
                    return d;
                  }
                })
              };
            } else {
              return v;
            }
          })
        };
      });
    } else {
      this.setState((partialState) => {
        return {
          rows: partialState.rows.map((v, i) => ({
            ...v,
            days: v.days.map((d, di) => ({
              ...d,
              selected: index === di && i === monthIndex
            }))
          }))
        };
      });
    }
  };

  /**
   * 回到今天
   */
  handleToDay = () => {
    this.flatList && this.flatList.scrollToOffset({ offset: this.toDayOffset - 2 * ITEM_WIDTH, animated: true });
  };

  /**
   * 编辑经期
   */
  handleEdit = () => {
    this.setState((partialState) => {
      return {
        isEdit: !partialState.isEdit,
        rows: partialState.rows.map((v, i) => ({
          ...v,
          days: v.days.map(d => ({ ...d, isEdit: !partialState.isEdit }))
        }))
      };
    });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <FlatList
          ref={ref => this.flatList = ref}
          data={this.state.rows}
          renderItem={this.renderCalendar}
          keyExtractor={(item, index) => String(index)}
          initialScrollIndex={this.props.pastScrollRange} // 初始位置
          getItemLayout={this.getItemLayout}
          initialNumToRender={3} // 指定一开始渲染的数量
          onViewableItemsChanged={this.onViewableItemsChanged}
        />
        {this.state.showToDay &&
        <TouchableOpacity style={styles.todayButton} onPress={this.handleToDay}>
          <Text style={{ color: '#F23F7C' }}>今天</Text>
        </TouchableOpacity>
        }
        <TouchableOpacity style={styles.editButton} onPress={this.handleEdit}>
          <Text style={{ color: '#FFF' }}>{!this.state.isEdit ? '编辑经期' : '完成'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

/**
 * FlatList Item一定要使用 PureComponent 进行包裹 优化很明显
 */
class Item extends PureComponent {
  render() {
    const { index, show, height, date, dateString, days, onPress } = this.props;

    if (show) {
      return (
        <View style={[styles.item, { height: height }]}>
          <View style={styles.header}>
            <Text style={styles.monthText}>{dateString}</Text>
          </View>
          <View style={styles.itemWrap}>
            {days.map((v, i) => {
              const { day, selected, isEdit, isEditSelected } = v;
              const isToday = dateUtils.sameDate(day, XDate());
              const isToMonth = dateUtils.sameMonth(day, date);
              return isToMonth ?
                (
                  <TouchableOpacity
                    style={[styles.day, selected && !isEdit && { backgroundColor: '#E9E9EE' }]}
                    key={String(i)}
                    onPress={() => {
                      onPress(v, i, index);
                    }}
                  >
                    {isEdit ?
                      <View style={styles.itemEdit}>
                        <Text>{isToday ? '今' : day.toString('dd')}</Text>
                        <View style={isEditSelected ? styles.itemEditDian : styles.itemUnEditDian}/>
                      </View>
                      :
                      <Text>{isToday ? '今' : day.toString('dd')}</Text>
                    }
                  </TouchableOpacity>
                )
                : <View style={styles.day} key={String(i)}/>;
            })}
          </View>
        </View>

      );
    } else {
      return (
        <View style={[styles.item, { height: height }]}>
          <Text style={{
            fontSize: 30,
            fontWeight: '200'
          }}>{dateString}</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  todayButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 44,
    width: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#b2b2b2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA'
  },
  editButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F23F7C',
    paddingHorizontal: 24,
    ...Platform.select({
      android: {
        elevation: 2
      },
      ios: {
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'rgba(152,152,152,0.54)',
        shadowOpacity: 1,
        shadowRadius: 4
      }
    })
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    height: ITEM_HEADER,
    alignItems: 'center',
    justifyContent: 'center'
  },
  monthText: {
    fontSize: 16,
    fontWeight: '500'
  },
  itemWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: ITEM_SPACE,
    marginTop: 10
  },
  day: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ITEM_WIDTH / 2
  },
  itemEdit: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemEditDian: {
    height: 14,
    width: 14,
    backgroundColor: '#F23F7C',
    borderRadius: 7,
    marginTop: 4
  },
  itemUnEditDian: {
    height: 14,
    width: 14,
    borderRadius: 7,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F23F7C'
  }
});
