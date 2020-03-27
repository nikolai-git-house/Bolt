import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import Sound from 'react-native-sound';
import colors from '../../theme/Colors';
import Logo from '../../components/Logo';
import TopImage from '../../components/TopImage';
import {Metrics} from '../../theme';
import {
  saveOnboarding,
  saveUID,
  savePet,
  saveBike,
  saveHealth,
  saveHome,
} from '../../Redux/actions/index';
import Firebase from '../../firebasehelper';
const back_img = require('../../assets/back.png');
const ballon_image = require('../../assets/popup/balloon.png');
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
class Onboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      firstname: '',
      phone: '',
      DOB: '',
      renter_owner: '',
      credit_Visible: false,
    };
  }
  componentDidMount() {
    Firebase.getCreditMembers().then(res => {
      this.setState({credit_members: res});
    });
  }
  onLoadFinished = () => {
    if (this.webview) {
      console.log('posted message');
      this.webview.postMessage('onboarding_botMessages');
    }
  };
  goBack = () => {
    this.props.navigation.goBack();
  };
  toggleModal = value => {
    this.setState({credit_Visible: value});
  };
  render() {
    const {username, phone, DOB} = this.state;
    console.log('username', username);
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: colors.white,
        }}>
        <TopImage />
        <Logo />
        <View
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            position: 'absolute',
            top: 40,
            left: 10,
            zIndex: 1000,
          }}>
          <TouchableOpacity onPress={this.goBack}>
            <Image source={back_img} style={{width: 25, height: 25}} />
          </TouchableOpacity>
        </View>
        <View style={styles.maincontainer}>
          <WebView
            ref={r => (this.webview = r)}
            originWhitelist={['*']}
            source={
              Platform.OS === 'ios'
                ? {uri: './external/onboarding/index.html'}
                : {uri: 'file:///android_asset/onboarding/index.html'}
            }
            onMessage={event => this.onEventHandler(event.nativeEvent.data)}
            injectedJavaScript={injectedJavascript}
            startInLoadingState
            domStorageEnabled={true}
            javaScriptEnabled
            onLoad={this.onLoadFinished}
            mixedContentMode="always"
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
            useWebKit={true}
          />
        </View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.credit_Visible}
          onRequestClose={() => {}}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => this.toggleModal(false)}>
              <View style={{flex: 1}} />
            </TouchableOpacity>
            <View style={styles.modal}>
              <Image source={ballon_image} style={{width: 80, height: 80}} />
              <Text style={{fontWeight: '700', fontSize: 20}}>
                We love you.
              </Text>
              <Text style={{textAlign: 'center'}}>
                So we've credited you membership for 12 months.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.toggleModal(false);
                }}
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
                <Text style={styles.text}>Amazing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  onEventHandler = data => {
    const {firstname, phone, DOB, renter_owner, credit_members} = this.state;
    bamboo.play();
    console.log('data', data);
    if (data !== 'bamboo') {
      const obj = JSON.parse(data);
      console.log(obj);
      if (obj.onboardingFinished) {
        let basicInfo = {
          firstname: firstname,
          phonenumber: phone,
          dob: DOB,
          renter_owner: renter_owner,
          groupId: '',
          tokens: 5,
        };
        if (credit_members.includes(phone)) {
          this.toggleModal(true);
          basicInfo.active = true;
          basicInfo.packages = [{caption: 'Membership Pack', price: 9.99}];
        }
        Firebase.signup(basicInfo)
          .then(res => {
            console.log('uid', res.id);
            this.props.dispatch(saveOnboarding(basicInfo));
            this.props.dispatch(saveUID(res.id));
            AsyncStorage.setItem('profile', JSON.stringify(basicInfo));
            AsyncStorage.setItem('uid', res.id);

            setTimeout(() => this.props.navigation.navigate('Main'), 100);
          })
          .catch(err => {
            console.log('Error', err);
          });
      } else if (obj.already_registered) {
        console.log('phone', phone);
        Firebase.getProfile(phone).then(res => {
          console.log('uid', res.id);
          this.props.dispatch(saveOnboarding(res.data()));
          this.props.dispatch(saveUID(res.id));
          AsyncStorage.setItem('profile', JSON.stringify(res.data()));
          AsyncStorage.setItem('uid', res.id);
          let getPet = Firebase.getPetDatafromUID(res.id);
          let getBike = Firebase.getBikeDatafromUID(res.id);
          let getHealth = Firebase.getHealthDatafromUID(res.id);
          let getHome = Firebase.getHomeDatafromUID(res.id);
          Promise.all([getPet, getBike, getHealth, getHome])
            .then(res => {
              if (res) {
                console.log('promise all', res);
                console.log('pet', res[0]);
                console.log('bike', res[1]);
                console.log('health', res[2]);
                console.log('home', res[3]);
                if (res[0]) {
                  console.log('dispatch savePet');
                  this.props.dispatch(savePet(res[0]));
                  AsyncStorage.setItem('petprofile', JSON.stringify(res[0]));
                }
                if (res[1]) {
                  console.log('dispatch saveBike');
                  this.props.dispatch(saveBike(res[1]));
                  AsyncStorage.setItem('bikeprofile', JSON.stringify(res[1]));
                }
                if (res[2]) {
                  console.log('dispatch saveHealth');
                  this.props.dispatch(saveHealth(res[2]));
                  AsyncStorage.setItem('healthprofile', JSON.stringify(res[2]));
                }
                if (res[3]) {
                  console.log('dispatch saveHome');
                  this.props.dispatch(saveHome(res[3]));
                  AsyncStorage.setItem('homeprofile', JSON.stringify(res[3]));
                }
                setTimeout(() => this.props.navigation.navigate('Main'), 100);
              } else
                setTimeout(() => this.props.navigation.navigate('Main'), 100);
            })
            .catch(err => {
              Alert.alert('Error', err);
            });
        });
      } else this.setState(obj);
    }
  };
}

const styles = StyleSheet.create({
  caption: {
    fontSize: 20,
    color: colors.darkblue,
    fontWeight: '700',
    marginBottom: 20,
  },
  subcaption: {
    fontSize: 15,
    textAlign: 'center',
  },
  containter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    paddingTop: 20,
    marginTop: 100,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  subcontainer: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modal: {
    position: 'absolute',
    left: '10%',
    top: '20%',
    width: '80%',
    height: '30%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.lightgrey,
    padding: 10,
  },
});
function mapStateToProps(state) {
  return {
    basic: state.basic,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Onboard);
