import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  AsyncStorage,
  Platform,
  Modal,
} from 'react-native';
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Sound from 'react-native-sound';
import Firebase from '../../firebasehelper';
import {
  saveHome,
  saveOnboarding,
  saveInvitation,
} from '../../Redux/actions/index';
import colors from '../../theme/Colors';
import StickItem from '../../components/StickItem';
import {Metrics} from '../../theme';
const error_img = require('../../assets/popup/error.png');
const success_image = require('../../assets/popup/happy_home.png');
var bamboo = new Sound('bamboo.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});
bamboo.setVolume(0.5);
const injectedJavascript = `(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
})()`;
class HomeProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource: require('../../assets/avatar.png'),
      accomodation_statusImg: error_img,
      location_statusImg: error_img,
      bedroom_statusImg: error_img,
      price_statusImg: error_img,
      localUri: null,
      homepack: 'Activate',
      petpack: 'Bolt-on',
      homeprofile: {},
      webview: true,
      notification: false,
      notification_msg: '',
      processing: false,
    };
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount in Home');
    this.load();
    this.props.navigation.addListener('willFocus', this.load);
  }
  async componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps in Home');
    //console.log("nextProps", nextProps);
    const {home} = nextProps;

    if (home && Object.keys(home).length !== 0) {
      console.log('home is not empty');
      this.setState({homeprofile: home});
      this.setState({webview: false});
      let keyboardScrollView = this.refs.KeyboardAwareScrollView;
      if (keyboardScrollView) keyboardScrollView.update();
    }
  }
  load = () => {
    const {basic, home, invitation} = this.props;
    const {firstname} = basic;
    if (invitation) {
      const {property_id, property_name} = invitation;
      if (property_id) {
        console.log('notification popped up');
        this.setState({
          notification_msg: `Hello ${firstname}, your landlord has invited you to  ${property_name} as a resident. Once you accept you'll be linked to the property.`,
          webview: false,
          property_id,
          property_name,
        });
        this.toggleModal();
      }
    } else if (home && Object.keys(home).length !== 0) {
      console.log('home is not empty');
      this.setState({homeprofile: home});
      this.setState({webview: false});
      let keyboardScrollView = this.refs.KeyboardAwareScrollView;
      if (keyboardScrollView) keyboardScrollView.update();
    } else {
      console.log('home is empty');
      this.setState({webview: true});
    }
  };
  selectPhotoTapped(id) {
    let thisElement = this;
    console.log(id);
  }
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  onActivate_HomePack = () => {
    this.navigateTo('MainList', {
      ongoBack: () => console.log('Will go back from nextComponent'),
      packageRequired: ['Serviced Home Pack'],
    });
  };
  onLoadFinished = () => {
    console.log('finished');
    if (this.webview) {
      console.log('posted message');
      this.webview.postMessage('home_botMessages');
    }
  };
  onEventHandler = data => {
    const {homeprofile} = this.state;
    const {uid} = this.props;
    let temp = homeprofile;
    bamboo.play();
    if (data != 'bamboo') {
      const obj = JSON.parse(data);
      const key = Object.keys(obj)[0];
      console.log('key', key);
      console.log('value', obj[key]);
      temp[key] = obj[key];
      this.setState({homeprofile: temp});

      console.log(obj);
      if (obj.onboardingFinished) {
        temp['uid'] = uid;
        this.setState({homeprofile: temp});
        Firebase.home_signup(temp)
          .then(res => {
            this.props.dispatch(saveHome(temp));
            AsyncStorage.setItem('homeprofile', JSON.stringify(temp));
          })
          .catch(err => {
            alert(err);
          });
        setTimeout(() => this.setState({webview: false}), 1000);
      } else this.setState(obj);
    }
    console.log('homeprofile', homeprofile);
  };
  toggleModal = () => {
    const {notification} = this.state;
    this.setState({notification: !notification});
  };
  onAcceptInvitation = () => {
    const {basic, uid} = this.props;
    const {property_id} = this.state;
    console.log('basic in Home', basic);
    let {phonenumber} = basic;
    this.setState({processing: true});
    Firebase.updateUserData(uid, {groupId: property_id}).then(res => {
      this.props.dispatch(saveOnboarding(res));
    });
    Firebase.acceptInvitation(uid, property_id, phonenumber)
      .then(res => {
        console.log('res of Accept', res);
        this.setState({processing: false});
        this.toggleModal();
        Firebase.getPropertyById(property_id).then(property_data => {
          const {bedrooms, property_address} = property_data;
          let address =
            property_address.first_address_line +
            ' ' +
            property_address.second_address_line;
          let home_profile = {
            uid,
            address,
            onboardingFinished: true,
            bedrooms,
          };
          Firebase.home_signup(home_profile)
            .then(res => {
              this.props.dispatch(saveHome(home_profile));
              AsyncStorage.setItem('homeprofile', JSON.stringify(home_profile));
              this.props.dispatch(saveInvitation(null));
            })
            .catch(err => {
              alert(err);
            });
        });
      })
      .catch(err => {
        console.log('err', err);
        this.setState({processing: false});
        this.toggleModal();
      });
  };
  onRejectInvitation = () => {
    const {basic, uid} = this.props;
    const {property_id} = this.state;
    let {phonenumber} = basic;
    this.setState({processing: true});
    Firebase.rejectInvitation(uid, property_id, phonenumber)
      .then(res => {
        console.log('res of rejectInvitation', res);
        this.props.dispatch(saveInvitation(null));
        this.setState({processing: false});
        this.toggleModal();
      })
      .catch(err => {
        console.log('err', err);
        this.setState({processing: false});
        this.toggleModal();
      });
  };
  render() {
    const {basic} = this.props;
    const imgs = this.state.imagesArray;
    const {
      homepack,
      webview,
      homeprofile,
      notification_msg,
      processing,
    } = this.state;
    return (
      <View style={styles.maincontainer}>
        {webview && (
          <WebView
            ref={r => (this.webview = r)}
            originWhitelist={['*']}
            source={
              Platform.OS === 'ios'
                ? {uri: './external/onboarding/index.html'}
                : {uri: 'file:///android_asset/onboarding/index.html'}
            }
            onMessage={event => this.onEventHandler(event.nativeEvent.data)}
            startInLoadingState
            injectedJavaScript={injectedJavascript}
            javaScriptEnabled
            onLoad={this.onLoadFinished}
            mixedContentMode="always"
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
            useWebKit={true}
          />
        )}
        {!webview && (
          <KeyboardAwareScrollView style={{width: '100%', height: '100%'}}>
            <View
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}>
              <View
                style={{
                  width: '90%',
                  height: 120,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderBottomColor: colors.grey,
                  borderBottomWidth: 1,
                }}>
                <StickItem
                  value={basic.renter_owner}
                  checked={true}
                  img={require('../../assets/home/user.png')}
                />
                <StickItem
                  value={homeprofile.address}
                  checked={true}
                  img={require('../../assets/home/placeholder.png')}
                />
                <StickItem
                  value={homeprofile.bedrooms}
                  checked={true}
                  img={require('../../assets/home/bed.png')}
                />
              </View>
              <View
                style={{
                  width: '90%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  marginTop: 10,
                  marginBottom: 10,
                  backgroundColor: colors.white,
                }}>
                <View
                  style={{
                    width: '100%',
                    height: 50,
                    marginBottom: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: 150,
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        marginTop: 5,
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                      source={require('../../assets/home.png')}
                    />
                    <Text style={{fontSize: 16}}>Home Pack</Text>
                  </View>
                  {/* <TouchableOpacity
                    style={
                      homepack == 'Activate' ? styles.CtoA : styles.CtoA_Clk
                    }
                    disabled={homepack === 'Activated'}
                    onPress={this.onActivate_HomePack}>
                    <Text style={{fontSize: 14, color: colors.darkblue}}>
                      {homepack}
                    </Text>
                  </TouchableOpacity> */}
                </View>
                <StickItem
                  value="Ai Home chatbot"
                  checked={homepack === 'Activated' ? true : false}
                  img={require('../../assets/home/house.png')}
                />
                <StickItem
                  value="Google Home"
                  checked={homepack === 'Activated' ? true : false}
                  img={require('../../assets/home/house.png')}
                />
                <StickItem
                  value="Wifi"
                  checked={homepack === 'Activated' ? true : false}
                  img={require('../../assets/home/house.png')}
                />
                <StickItem
                  value="Netflix"
                  checked={homepack === 'Activated' ? true : false}
                  img={require('../../assets/home/house.png')}
                />
                <StickItem
                  value="Monthly cleaning"
                  checked={homepack === 'Activated' ? true : false}
                  img={require('../../assets/home/house.png')}
                />
                <StickItem
                  value="Gas, water, electric"
                  checked={homepack === 'Activated' ? true : false}
                  img={require('../../assets/home/house.png')}
                />
                <StickItem
                  value="Contents, damage & keys cover"
                  checked={homepack === 'Activated' ? true : false}
                  img={require('../../assets/home/house.png')}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}
        <Modal
          modalOptions={{dismissible: false}}
          animationType={'fade'}
          transparent={true}
          visible={this.state.notification}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <View style={styles.modal}>
              <Image source={success_image} style={{width: 80, height: 80}} />
              <Text style={{fontWeight: '700'}}>
                Linked Property Notification
              </Text>
              <Text style={{textAlign: 'center'}}>{notification_msg}</Text>
              {!processing && (
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableHighlight
                    onPress={this.onAcceptInvitation}
                    style={{
                      backgroundColor: colors.yellow,
                      width: 100,
                      height: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: 'black',
                      shadowOffset: {width: 0, height: 0},
                      shadowOpacity: 0.2,
                      elevation: 3,
                    }}>
                    <Text style={styles.text}>Accept</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={this.onRejectInvitation}
                    style={{
                      backgroundColor: colors.yellow,
                      width: 100,
                      height: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: 'black',
                      shadowOffset: {width: 0, height: 0},
                      shadowOpacity: 0.2,
                      elevation: 3,
                    }}>
                    <Text style={styles.text}>Decline</Text>
                  </TouchableHighlight>
                </View>
              )}
              {processing && (
                <ActivityIndicator size="large" color={colors.darkblue} />
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  Title: {fontSize: 35, fontFamily: 'Gothic A1'},
  CtoA: {
    borderRadius: 20,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 50,
    backgroundColor: colors.yellow,
    shadowOffset: {height: 1, width: 1},
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  CtoA_Clk: {
    borderRadius: 20,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 50,
    backgroundColor: 'rgba(255, 255, 0, 0.3)',
    shadowOffset: {height: 1, width: 1},
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  CallAction: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#152439',
    shadowOffset: {height: 1, width: 1},
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  iconstyle: {
    color: '#9c9ebf',
  },
  textstyle: {
    fontFamily: 'Gothic A1',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    paddingBottom: 3,
    paddingLeft: 10,
  },
  textFieldstyle: {
    fontFamily: 'Gothic A1',
    //fontWeight: "600",
    alignSelf: 'stretch',
    //height: 44
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 40,
    overflow: 'hidden',
  },
  toolbar: {
    backgroundColor: '#484b89',
    height: 55,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(33, 33, 39, 0.7)',
    borderRadius: 50,
    overflow: 'hidden',
  },
  Section: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  Icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    width: '100%',
    fontSize: 18,
    backgroundColor: 'transparent',
    color: '#424242',
  },
  fab: {
    justifyContent: 'center',
    alignContent: 'center',
    ...Platform.select({
      ios: {
        backgroundColor: '#ecd9fc',
        height: 50,
        width: 70,
        borderRadius: 10,
      },
      android: {
        backgroundColor: '#9513fe',
        height: 60,
        width: 60,
        borderRadius: 30,
      },
    }),
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 3,
    zIndex: 5,
    overflow: 'hidden',
  },
  tabStyle: {
    backgroundColor: '#f0eff5',
  },
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    fontFamily: 'Gothic A1',
  },
  modal: {
    position: 'absolute',
    left: '10%',
    top: '20%',
    width: '80%',
    height: '35%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.lightgrey,
    padding: 10,
  },
  text: {
    fontSize: 15,
    marginBottom: 0,
    fontFamily: 'Gothic A1',
    textAlign: 'center',
    color: colors.darkblue,
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
    invitation: state.invitation,
    home: state.home,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeProfile);
