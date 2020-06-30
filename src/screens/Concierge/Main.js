import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  TouchableOpacity,
  Image,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
// import OneSignal from 'react-native-onesignal';
import colors from '../../theme/Colors';
import {Metrics} from '../../theme';
import TopImage from '../../components/TopImage';
import Logo from '../../components/Logo';
import Firebase from '../../firebasehelper';
import {
  saveOnboarding,
  saveInvitation,
  resetConcierge,
} from '../../Redux/actions/index';
const TAB_HEIGHT = 50;
let items = [];
let rooms = [];
let adjectives = [];
let locations = [];
let cuisines = [];
import resetbutton from '../../assets/concierge/chat.png';
Firebase.getAllItem(res => {
  items = res;
  //items = res.map(item => item.toLowerCase());
});
Firebase.getAllRoom(res => {
  rooms = res.map(item => {
    return {value: item};
  });
});
Firebase.getAllAdjective(res => {
  adjectives = res.map((item, index) => {
    return {id: index, name: item};
  });
});
Firebase.getAllLocations(res => {
  console.log('locations', res);
  locations = res;
});
Firebase.getAllCuisines(res => {
  console.log('cuisines', res);
  cuisines = res;
});
function arraytoString(array) {
  let str = '';
  array.forEach(item => {
    str += ' ' + item;
  });
  return str;
}
function clearAllTimeout() {
  var id = window.setTimeout(function() {}, 0);
  while (id--) {
    window.clearTimeout(id); // will do nothing if no timeout with id is present
  }
}
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renter_owner: props.basic.renter_owner === 'Renter' ? 1 : 2,
      keyboard: 'invisible',
      keyboard_Height: 0,
      message_txt: '',
      botMessages: [],
      messages: [],
      isUserTurn: false,
      isfinalQuestion: false,
      startbooking: false,
      duration: 3000,
      info: '',
      email: '',
      password: '',
      choiceselected: false,
      goinglivechat: false,
      waiting_reply: false,
      issue_opened: false,
      show_package: false,
      show_booking_travel: false,
      show_exit_travel: false,
      pkgs: [],
    };
  }
  componentDidMount() {
    let {uid, basic} = this.props;
    console.log('pkgs', this.props.basic.packages);
    if (this.props.basic.packages) {
      let promises = this.props.basic.packages.map(item => {
        return Firebase.getPackageInfo(item.caption).then(res => {
          return res;
        });
      });
      Promise.all(promises).then(res => {
        console.log('pkgs', res);
        this.setState({pkgs: res});
      });
    } else {
      this.setState({pkgs: []});
    }
    let phone = '';
    this.unsubscribeUserProfile = Firebase.firestore()
      .collection('user')
      .doc(uid)
      .onSnapshot(snapshot => {
        let userprofile = snapshot.data();
        phone = userprofile.phonenumber;
        this.props.dispatch(saveOnboarding(userprofile));
        AsyncStorage.setItem('profile', JSON.stringify(userprofile));
      });
    this.unsubscribeInvitations = Firebase.firestore()
      .collection('invitations')
      .onSnapshot(snapshot => {
        let data = snapshot.docs;
        data.map(item => {
          let invite_item = item.data();
          if (invite_item.phone === phone) {
            console.log('invite item found in Concierge', basic);
            this.props.dispatch(saveInvitation(invite_item));
            this.navigateTo('Home');
          }
        });
        console.log('invitation data', data);
      });
    Firebase.getChatsById(uid, res => {
      if (res) {
        this.navigateTo('LiveChat', {uid, ticket_id: res});
      }
    });
    // OneSignal.getPermissionSubscriptionState(state => {
    //   console.log('notifId', state.userId);
    //   this.setState({notifId: state.userId});
    //   Firebase.updateUserData(uid, {uuid: state.userId}).then(res => {
    //     this.props.dispatch(saveOnboarding(res));
    //     AsyncStorage.setItem('profile', JSON.stringify(res));
    //   });
    // });
    this.props.navigation.addListener('willFocus', this.catchPreviousScreen);
  }
  componentWillUnmount() {
    this.unsubscribeUserProfile();
    this.unsubscribeInvitations();
  }
  componentWillReceiveProps(nextProps) {
    const {reset} = nextProps;
    console.log('reset', reset);
    if (reset) {
      this.restart();
      nextProps.dispatch(resetConcierge(false));
    }
  }
  catchPreviousScreen = () => {
    this.restart();
  };
  restart = async () => {
    this.webview.reload();
  };
  onResetConcierge = () => {
    console.log('reset');
    this.restart();
  };
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  GoLiveChat = () => {
    const {uid} = this.props;
    this.setState({waiting_reply: false});
    this.navigateTo('LiveChat', {
      ongoBack: () => console.log('Will go back from nextComponent'),
      room_id: uid,
    });
  };
  onLoadFinished = () => {
    if (this.webview) {
      this.webview.postMessage(
        JSON.stringify({
          fromMobile: true,
        }),
      );
    }
  };
  onClickTransparent = () => {
    console.log('clicked');
  };
  render() {
    const {uid} = this.props;
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
            zIndex: 1000,
          }}>
          <TopImage />
          <Logo />
        </View>
        <WebView
          style={{zIndex: 100, marginTop: 100}}
          ref={r => (this.webview = r)}
          originWhitelist={['*']}
          source={{uri: `https://aiconcierge.firebaseapp.com/?uid=${uid}`}}
          onMessage={event => this.onEventHandler(event.nativeEvent.data)}
          startInLoadingState
          javaScriptEnabled
          onLoad={this.onLoadFinished}
          mixedContentMode="always"
          thirdPartyCookiesEnabled
          allowUniversalAccessFromFileURLs
          useWebKit={true}
        />
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
  CalltoAction: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 15,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: colors.white,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 3,
  },
  button: {
    color: colors.darkblue,
    fontSize: 16,
    fontFamily: 'Gothic A1',
    fontWeight: '100',
    paddingTop: 17,
    paddingBottom: 17,
    paddingLeft: 22,
    paddingRight: 22,
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 3,
    marginTop: -5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabbutton: {
    width: 25,
    height: 25,
  },
  spinnerTextStyle: {
    color: '#FFF',
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
    reset: state.reset,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
