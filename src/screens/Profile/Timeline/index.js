import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import Firebase from '../../../firebasehelper';
import {getChoiceImageByTicketId} from '../../../utils/Constants';
import TicketItem from './TicketItem';
import colors from '../../../theme/Colors';
const really_happy_img = require('../../../assets/timeline/really_happy.png');
const happy_img = require('../../../assets/timeline/happy.png');
const satisfactory_img = require('../../../assets/timeline/satisfactory.png');
const unhappy_img = require('../../../assets/timeline/unhappy.png');

function compare(a, b) {
  if (parseInt(a.time, 10) < parseInt(b.time, 10)) {
    return -1;
  }
  if (parseInt(a.time, 10) > parseInt(b.time, 10)) {
    return 1;
  }
  return 0;
}
class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      ticket_id: '',
      visible_arr: [],
      close_visible: false,
      checked: 'Really Happy',
    };
  }
  componentDidMount() {
    const {uid} = this.props;
    Firebase.getAllTicketsById(uid, res => {
      console.log('tickets', res);
      let tickets = Object.values(res);
      tickets.sort(compare);
      let visible_arr = tickets.map(item => {
        return false;
      });
      this.setState({tickets, visible_arr});
    });
  }
  navigateTo = (page, props) => {
    const {uid} = this.props;
    this.props.navigation.navigate(page, props);
  };
  toggleModal = (type, value) => {
    if (type === 'close') this.setState({close_visible: value});
  };
  onPressChat = (ticket_id, status) => {
    const {uid} = this.props;
    let ticket_Str = ticket_id.toString();
    let ticketID = ticket_Str.split('.').join('');
    console.log('ticketID', ticketID);
    if (status !== 'Closed')
      this.navigateTo('LiveChat', {uid, ticket_id: ticketID});
  };
  onTerminateTicket = (ticket_id, status) => {
    this.setState({ticket_id});
    if (status !== 'Closed') this.toggleModal('close', true);
  };
  terminateTicket = () => {
    this.toggleModal('close', false);
    const {uid} = this.props;
    const {ticket_id, checked} = this.state;
    let ticket_Str = ticket_id.toString();
    let ticketID = ticket_Str.split('.').join('');
    let feeling = checked;
    Firebase.terminateChat(uid, ticketID, feeling, res => {
      if (res === 'success') {
        console.log('terminated!');
      }
    });
  };
  toggleTicket = index => {
    let {visible_arr} = this.state;
    visible_arr[index] = !visible_arr[index];
    this.setState({visible_arr});
    console.log('visible_arr', visible_arr);
  };
  renderTicketItem = ({item, index}) => {
    const ticket_id = item.ticket_id || '';
    const {visible_arr} = this.state;
    const {basic} = this.props;
    const {firstname} = basic;
    const img = getChoiceImageByTicketId(ticket_id);
    return (
      <TicketItem
        img={img}
        ticket={item}
        firstname={firstname}
        toggleTicket={() => this.toggleTicket(index)}
        terminateTicket={() => this.onTerminateTicket(ticket_id, item.status)}
        onPressChat={() => this.onPressChat(ticket_id, item.status)}
        visible={visible_arr[index]}
      />
    );
  };
  render() {
    const {tickets, ticket_id, checked} = this.state;
    return (
      <View style={{display: 'flex'}}>
        <FlatList
          data={tickets}
          renderItem={this.renderTicketItem}
          style={{
            width: '100%',
          }}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 50,
          }}
        />

        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.close_visible}
          onRequestClose={() => {}}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => this.toggleModal('close', false)}>
              <View style={{flex: 1}} />
            </TouchableOpacity>
            <View style={styles.modal}>
              <Text style={{fontWeight: '700', fontSize: 20, marginBottom: 20}}>
                Were you happy?
              </Text>
              <TouchableOpacity
                style={[
                  styles.option_button,
                  checked === 'Really Happy' ? styles.clicked : null,
                ]}
                onPress={() => this.setState({checked: 'Really Happy'})}>
                <Image
                  source={really_happy_img}
                  style={{width: 30, height: 30}}
                />
                <Text>Really Happy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option_button,
                  checked === 'Happy' ? styles.clicked : null,
                ]}
                onPress={() => this.setState({checked: 'Happy'})}>
                <Image source={happy_img} style={{width: 30, height: 30}} />
                <Text>Happy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option_button,
                  checked === 'Satisfactory' ? styles.clicked : null,
                ]}
                onPress={() => this.setState({checked: 'Satisfactory'})}>
                <Image
                  source={satisfactory_img}
                  style={{width: 30, height: 30}}
                />
                <Text>Satisfactory</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option_button,
                  checked === 'Unhappy' ? styles.clicked : null,
                ]}
                onPress={() => this.setState({checked: 'Unhappy'})}>
                <Image source={unhappy_img} style={{width: 30, height: 30}} />
                <Text>Unhappy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.terminateTicket}
                style={{
                  backgroundColor: colors.yellow,
                  width: 100,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: colors.grey,
                  borderWidth: 1,
                }}>
                <Text style={styles.text}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    left: '10%',
    top: '20%',
    width: '80%',
    height: '40%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.lightgrey,
    padding: 10,
  },
  option_button: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  clicked: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 3,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    basic: state.basic,
    uid: state.uid,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Timeline);
