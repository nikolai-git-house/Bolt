import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Sound from 'react-native-sound';
import colors from '../../theme/Colors';
import Metrics from '../../theme/Metrics';
import TopImage from '../../components/TopImage';
import Logo from '../../components/Logo';

// var bamboo = new Sound("bamboo.mp3", Sound.MAIN_BUNDLE, error => {
//   if (error) {
//     console.log("failed to load the sound", error);
//     return;
//   }
//   // Play the sound with an onEnd callback
//   bamboo.play(success => {
//     if (success) {
//       console.log("successfully finished playing");
//     } else {
//       console.log("playback failed due to audio decoding errors");
//     }
//   });
// });
// bamboo.setVolume(0.5);
class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: 'false',
    };
  }
  signIn = () => {
    this.props.navigation.navigate('SignIn');
  };
  joinMember = () => {
    this.props.navigation.navigate('Onboard');
  };
  render() {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          height: Metrics.screenHeight,
          alignItems: 'center',
          backgroundColor: colors.lightgrey,
        }}>
        <TopImage />
        <Logo />
        <View
          style={{
            marginTop: 100,
            width: '100%',
            height: '80%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: colors.lightgrey,
          }}>
          <View style={Styles.JoinProfileContainer}>
            <Text style={[Styles.Title, {color: colors.darkblue}]}>
              Join Ecosystem
            </Text>
            <Image
              source={require('../../assets/Landing/join_bolt.png')}
              style={{width: 60, height: 60}}
            />
            <Text style={[Styles.SubTitle, {color: colors.darkblue}]}>
              Insider access, perks savings & subscriptions. Earn tokens to
              spend on all walks of life. Own your life & data with your
              blockchain iD. Live your best life with the help of community.
            </Text>
            <TouchableOpacity
              onPress={this.joinMember}
              style={[Styles.CallAction, {backgroundColor: colors.yellow}]}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.darkblue,
                  fontWeight: '500',
                }}>
                Join Now
              </Text>
            </TouchableOpacity>
          </View>
          <View style={Styles.SignInContainer}>
            <Text style={[Styles.Title, {color: colors.darkblue}]}>
              Already a member
            </Text>
            <Image
              source={require('../../assets/Landing/already_member.png')}
              style={{width: 60, height: 60}}
            />
            <Text style={[Styles.SubTitle, {color: colors.darkblue}]}>
              Those who have joined the club.
            </Text>
            <TouchableOpacity
              onPress={this.signIn}
              style={[Styles.CallAction, {backgroundColor: colors.grey}]}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.darkblue,
                  fontWeight: '500',
                }}>
                Sign me in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  SignInContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 250,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    color: colors.darkblue,
    padding: 10,
    margin: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder,
  },
  JoinProfileContainer: {
    backgroundColor: colors.grey,
    borderRadius: 10,
    height: 280,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    color: colors.darkblue,
    paddingVertical: 10,
    paddingHorizontal: 30,
    margin: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder,
  },
  Title: {fontSize: 30, fontFamily: 'Gothic A1', fontWeight: '200'},
  SubTitle: {fontSize: 15, fontFamily: 'Gothic A1', textAlign: 'center'},
  CallAction: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder,
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
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Landing);
