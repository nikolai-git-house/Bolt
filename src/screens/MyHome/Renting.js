import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  ToolbarAndroid,
  AsyncStorage,
  Platform,
  TextInput,
} from 'react-native';
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Firebase from '../../firebasehelper';
import {saveRent} from '../../Redux/actions/index';
import Sound from 'react-native-sound';
import colors from '../../theme/Colors';
import StickItem from '../../components/StickItem';
import {Metrics} from '../../theme';
const error_img = require('../../assets/error.png');

var bamboo = new Sound('bamboo.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});
bamboo.setVolume(0.5);

class RentingProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource: require('../../assets/avatar.png'),
      localUri: null,
      rentprofile: {},
      housemateprofile: {},
      rent_webview: false,
      housemate_webview: false,
      rent_housemate: '',
    };
  }
  componentDidMount() {
    this.setState({rent_webview: false});
    this.setState({housemate_webview: false});
  }
  navigateTo = page => {
    this.props.navigation.navigate(page);
  };
  onLoadFinished = () => {
    if (this.housemate_webview) {
      console.log('posted message');
      this.housemate_webview.postMessage('housemate_botMessages');
    }
  };
  startRentingTest = () => {
    this.setState({rent_webview: true});
  };
  startHousemateTest = () => {
    this.setState({housemate_webview: true});
  };
  onEventHandler = data => {
    const {rentprofile, housemateprofile, rent_housemate} = this.state;
    const {uid} = this.props;
    bamboo.play();
    console.log('rent_housemate', rent_housemate);
    if (data != 'bamboo') {
      const obj = JSON.parse(data);
      const key = Object.keys(obj)[0];
      console.log('key', key);
      if (rent_housemate === '') {
        this.setState({
          rent_housemate: key === 'approve' ? 'housemate' : 'rent',
        });
      }
      if (rent_housemate === 'rent') {
        let temp = rentprofile;
        temp[key] = obj[key];
        this.setState({rentprofile: temp});

        if (obj.onboardingFinished) {
          temp['uid'] = uid;
          this.setState({rentprofile: temp});
          Firebase.rent_signup(temp)
            .then(res => {
              this.props.dispatch(saveRent(temp));
              AsyncStorage.setItem('rentprofile', JSON.stringify(temp));
            })
            .catch(err => {
              alert(err);
            });
          setTimeout(() => this.setState({rent_webview: false}), 1000);
        } else this.setState(obj);
        console.log('rentprofile', rentprofile);
      }
      if (rent_housemate === 'housemate') {
        let temp = housemateprofile;
        temp[key] = obj[key];
        this.setState({housemateprofile: temp});

        if (obj.onboardingFinished) {
          temp['uid'] = uid;
          this.setState({housemateprofile: temp});
          // Firebase.rent_signup(temp)
          //   .then(res => {
          //     this.props.dispatch(saveRent(temp));
          //     AsyncStorage.setItem("rentprofile", JSON.stringify(temp));
          //   })
          //   .catch(err => {
          //     alert(err);
          //   });
          setTimeout(() => this.setState({housemate_webview: false}), 1000);
        } else this.setState(obj);
        console.log('housemateprofile', housemateprofile);
      }
    }
  };
  render() {
    const {basic} = this.props;
    const {rent_webview, housemate_webview} = this.state;
    return (
      <View style={styles.maincontainer}>
        {rent_webview && (
          <WebView
            ref={r => (this.rent_webview = r)}
            originWhitelist={['*']}
            source={
              Platform.OS === 'ios'
                ? {uri: './external/rent_profile/index.html'}
                : {uri: 'file:///android_asset/rent_profile/index.html'}
            }
            onMessage={event => this.onEventHandler(event.nativeEvent.data)}
            startInLoadingState
            javaScriptEnabled
            onLoad={this.onLoadFinished}
            mixedContentMode="always"
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
          />
        )}
        {housemate_webview && (
          <WebView
            ref={r => (this.housemate_webview = r)}
            originWhitelist={['*']}
            source={
              Platform.OS === 'ios'
                ? {uri: './external/rent_profile/index.html'}
                : require('../../webview/rent_profile/index.html')
            }
            onMessage={event => this.onEventHandler(event.nativeEvent.data)}
            startInLoadingState
            javaScriptEnabled
            onLoad={this.onLoadFinished}
            mixedContentMode="always"
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
            useWebKit={true}
          />
        )}
        {!rent_webview && !housemate_webview && (
          <KeyboardAwareScrollView style={{width: '100%', height: '100%'}}>
            <View
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                backgroundColor: colors.white,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Gothic A1',
                  fontSize: 20,
                  fontWeight: '700',
                  marginBottom: 10,
                }}>
                Renting Reference
              </Text>
              <View
                style={{
                  width: '90%',
                  height: 180,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}>
                <StickItem
                  value="Employment"
                  checked={false}
                  img={require('../../assets/renting/Employment_.png')}
                />
                <StickItem
                  value="Right to Rent"
                  checked={false}
                  img={require('../../assets/renting/RighttoRent.png')}
                />
                <StickItem
                  value="Credit & Affordability"
                  checked={false}
                  img={require('../../assets/renting/Credit_Affordability_.png')}
                />
                <StickItem
                  value="Rental History"
                  checked={false}
                  img={require('../../assets/renting/RentalHistory.png')}
                />
                <StickItem
                  value="Pets"
                  checked={false}
                  img={require('../../assets/renting/Pets.png')}
                />
              </View>
              <TouchableOpacity
                style={styles.PrimaryCallAction}
                onPress={this.startRentingTest}>
                <Text>Take the test</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        )}
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
  PrimaryCallAction: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#faff87',
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
    backgroundColor: colors.white,
    fontFamily: 'Gothic A1',
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
    home: state.home,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(RentingProfile);
