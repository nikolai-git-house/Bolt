import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../theme/Colors';
import Logo from '../../components/Logo';
import TopImage from '../../components/TopImage';
import {Metrics} from '../../theme';
import BubbleText from './BubbleText';
import MessageInput from '../../components/MessageInput';
import Sound from 'react-native-sound';
import Firebase from '../../firebasehelper';
const TAB_HEIGHT = 50;
var timer;
var bamboo = new Sound('bamboo.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});
bamboo.setVolume(0.5);
class LiveChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboard: 'invisible',
      keyboard_Height: 0,
      message_txt: '',
      messages: [],
      agency_typing: false,
      landlord_typing: false,
      title: '',
    };
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  componentDidMount() {
    const {uid, ticket_id} = this.props.navigation.state.params;
    console.log('this.props.navigation', this.props.navigation);
    console.log('uid,ticket in live', uid, ticket_id);
    Firebase.readMessage(uid);
    Firebase.getChats(uid, ticket_id, res => {
      let chats = Object.values(res);
      console.log('chats', chats);
      this.setState({messages: chats});
    });
    Firebase.getTicketData(uid, ticket_id, res => {
      console.log('uid, ticket_id', uid, ticket_id);
      console.log('ticket_Data', res);
      const {item, room, adjective, issue} = res;
      let title = '';
      if (item) {
        title = 'The ' + item + ' in the ' + room + ' is ' + adjective;
      } else title = issue;
      this.setState({title});
    });
    Firebase.getAgencyTyping(uid, ticket_id, typing => {
      this.setState({agency_typing: typing});
    });
    Firebase.getLandlordTyping(uid, ticket_id, typing => {
      this.setState({landlord_typing: typing});
    });
    Firebase.getContractorTyping(uid, ticket_id, typing => {
      this.setState({contractor_typing: typing});
    });
    Firebase.getStatus(uid, ticket_id, status => {
      console.log('status', status);
    });
  }

  _keyboardDidShow(e) {
    this.setState({keyboard: 'visible'});

    let keyboard_Height = e.endCoordinates.height;
    this.setState({keyboard_Height});
    let self = this;
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
    }, 100);
  }
  _keyboardDidHide() {
    this.setState({keyboard: 'invisible'});
  }
  setMessages() {
    console.log('setMessages');
    const {messages} = this.state;
    const {avatar_url} = this.props.basic;
    let self = this;
    setTimeout(() => {
      if (self.refs.scrollView) self.refs.scrollView.scrollToEnd();
    }, 100);
    return messages.map((message, i) => {
      return (
        <BubbleText
          message={message}
          key={i}
          typing={false}
          avatar_url={avatar_url}
        />
      );
    });
  }
  setMessageInState(message) {
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({messages});
  }
  addMessage = message => {
    const {uid, ticket_id} = this.props.navigation.state.params;
    setTimeout(() => {
      this.refs.scrollView.scrollToEnd();
    }, 100);
    this.setMessageInState(message);
    Firebase.addMessage(uid, ticket_id, message, res => {
      console.log('addedChat', res);
    });
  };
  SendMessage = () => {
    const {message_txt} = this.state;
    let self = this;
    bamboo.play();
    Keyboard.dismiss();
    this.setState({keyboard: 'invisible', message_txt: ''});
    if (message_txt) this.addMessage({type: 'user', message: message_txt});
  };
  onChangeMessage = text => {
    const {uid, ticket_id} = this.props.navigation.state.params;
    console.log('uid,ticket_id', uid, ticket_id);
    Firebase.setTypeValue(uid, ticket_id, true);
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      Firebase.setTypeValue(uid, ticket_id, false);
    }, 1000);
    this.setState({message_txt: text});
  };
  terminate = () => {
    const {uid, ticket_id} = this.props.navigation.state.params;
    Firebase.terminateChat(uid, ticket_id, res => {
      if (res === 'success') {
        console.log('Terminated chat');
      }
    });
  };
  onGoBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    const {
      keyboard_Height,
      message_txt,
      agency_typing,
      landlord_typing,
      contractor_typing,
      title,
    } = this.state;
    return (
      <View style={styles.maincontainer}>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -29,
          }}>
          <TopImage />
          <Logo />
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40,
              left: 10,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'flex-start',
            }}
            onPress={this.onGoBack}>
            <Image
              style={styles.tabbutton}
              source={require('../../assets/Explore/community/back.png')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginBottom: 5,
            marginTop: 100,
          }}>
          <Text style={{fontWeight: '700'}}>{title}</Text>
        </View>
        <ScrollView
          ref="scrollView"
          style={{paddingLeft: 16}}
          contentContainerStyle={{
            width: '100%',
            minHeight: Metrics.screenHeight - TAB_HEIGHT,
          }}
          keyboardShouldPersistTaps={'handled'}>
          <View style={{height: 70}}></View>
          {this.setMessages()}
          {agency_typing && (
            <BubbleText message={{type: 'agency'}} agency_typing={true} />
          )}
          {landlord_typing && (
            <BubbleText message={{type: 'landlord'}} landlord_typing={true} />
          )}
          {contractor_typing && (
            <BubbleText
              message={{type: 'contractor'}}
              contractor_typing={true}
            />
          )}
          <MessageInput
            style={{marginTop: 'auto'}}
            onChange={this.onChangeMessage}
            onSend={this.SendMessage}
            value={message_txt}
          />
        </ScrollView>

        {this.state.keyboard == 'visible' && (
          <View
            style={{
              width: '100%',
              height: keyboard_Height,
              backgroundColor: 'rgba(52, 52, 52, 0.0)',
            }}
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    //minHeight: Metrics.screenHeight - 20,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 29,
    backgroundColor: colors.white,
  },
  closeButton: {
    position: 'absolute',
    top: 35,
    right: 0,
    zIndex: 1000,
    opacity: 0.8,
    marginRight: 10,
    backgroundColor: colors.darkblue,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 3,
    alignSelf: 'flex-end',
  },
  button: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Gothic A1',
    fontWeight: '300',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 22,
    paddingRight: 22,
  },
  tabbutton: {
    width: 25,
    height: 25,
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
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat);
