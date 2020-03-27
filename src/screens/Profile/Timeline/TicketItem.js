/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../theme/Colors';
import Metrics from '../../../theme/Metrics';
import {getStringfromSeconds} from '../../../utils/functions';
class TicketItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({visible: nextProps.visible});
  }
  onPressChat = () => {
    const {onPressChat} = this.props;
    onPressChat();
  };
  terminateChat = () => {
    const {terminateTicket} = this.props;
    terminateTicket();
  };
  getIssueText = () => {
    const {ticket} = this.props;
    const {item, room, adjective} = ticket;
    if (item) {
      return (
        'The ' +
        item.toLowerCase() +
        ' in the ' +
        room.toLowerCase() +
        ' is ' +
        adjective.toLowerCase() +
        '.'
      );
    } else return null;
  };
  render() {
    const {img, ticket, toggleTicket, firstname} = this.props;
    const {issue, status, title, time, feeling, note} = ticket;
    const {visible} = this.state;
    return (
      <View
        style={{
          width: Metrics.screenWidth,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: Metrics.screenWidth,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            height: 60,
            backgroundColor: colors.white,
            borderRadius: 5,
            shadowColor: 'black',
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.2,
            elevation: 3,
          }}
          onPress={toggleTicket}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Text style={{fontSize: 16}}>{title}</Text>
          </View>
          <Text style={{fontSize: 14}}>{getStringfromSeconds(time)}</Text>
        </TouchableOpacity>
        {visible && (
          <View
            style={{
              padding: 10,
              backgroundColor: colors.lightgrey,
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
              <Text style={{fontWeight: '500', marginBottom: 20}}>
                {status} Ticket
              </Text>
              <Text>{this.getIssueText()}</Text>
              <Text style={{fontWeight: '600'}}>
                {feeling
                  ? `${firstname} is ${feeling.toLowerCase()} with this ticket.`
                  : null}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: '#7ef0a7',
                  },
                ]}
                onPress={this.onPressChat}>
                <Text style={{width: '100%', textAlign: 'center'}}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: '#ffd366',
                  },
                ]}>
                <Text style={{width: '100%', textAlign: 'center'}}>
                  Add note
                </Text>
              </TouchableOpacity>
              {status !== 'Closed' && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#faff87',
                    },
                  ]}
                  onPress={this.terminateChat}>
                  <Text style={{width: '100%', textAlign: 'center'}}>
                    Close ticket
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        {/* <View>
          {note.map(item => {
            
          })}
        </View> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  imageContainer: {
    width: 50,
    height: 50,
    overflow: 'hidden',
  },
  button: {
    width: 100,
    height: 35,
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 2,
    marginBottom: 2,
  },
});
export default TicketItem;
