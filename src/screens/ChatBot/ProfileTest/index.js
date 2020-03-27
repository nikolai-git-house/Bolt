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
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import colors from '../../../theme/Colors';
import Logo from '../../../components/Logo';
import {Metrics} from '../../../theme';
import {saveOnboarding} from '../../../Redux/actions/index';
class Onboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personalType: '',
      spareType: '',
      animalType: '',
      socialType: '',
      employmentType: '',
      salary: '',
      addressType: '',
    };
  }
  render() {
    const {username, phone, location, DOB} = this.state;
    console.log('username', username);
    return (
      <View style={styles.maincontainer}>
        {/* <Logo /> */}
        <WebView
          originWhitelist={['*']}
          source={{uri: './external/testpart1/index.html'}}
          onMessage={event => this.onEventHandler(event.nativeEvent.data)}
        />
      </View>
    );
  }
  onEventHandler = data => {
    const {
      personalType,
      spareType,
      animalType,
      socialType,
      employmentType,
      salary,
      addressType,
    } = this.state;
    const obj = JSON.parse(data);
    console.log(obj);
    if (obj.Part1Finished) {
      const {firstname, lastname, phone, dob} = this.props;
      const basicInfo = {
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        dob: dob,
        personalType: personalType,
        spareType: spareType,
        animalType: animalType,
        socialType: socialType,
        employmentType: employmentType,
        salary: salary,
        addressType: addressType,
      };

      this.props.dispatch(saveOnboarding(basicInfo));

      setTimeout(() => this.props.navigation.navigate('ProfileSuccess'), 1000);
    } else this.setState(obj);
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
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 50,
    backgroundColor: colors.lightgrey,
  },
  subcontainer: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
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
