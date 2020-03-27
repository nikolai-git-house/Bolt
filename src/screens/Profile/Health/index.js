import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  AsyncStorage,
  Alert,
  TouchableWithoutFeedback,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../../theme/Colors';
import {Metrics} from '../../../theme';
import CheckDiv from '../../../components/CheckDiv';
import {saveHealth} from '../../../Redux/actions/index';
import Firebase from '../../../firebasehelper';
const physical_profile = [
  'Ability to exercise',
  'Physician approval',
  'Cardiac stability',
  'Respiratory stability',
  'Brain & spine stability',
  'Bone & muscle stability',
  'Chest stability',
  'Blood Pressure stability',
  'Cholesterol stability',
  'Prescribe Meds',
];
const ok_img = require('../../../assets/success.png');
const error_img = require('../../../assets/popup/error.png');
class HealthProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      healthprofile: {
        physical_profile_checked: [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
      },
      saving: false,
      errorVisible: false,
      error_msg: '',
      editable: false,
      button_txt: 'Edit Profile Information',
      webview: true,
    };
  }
  componentDidMount() {
    const {health} = this.props;
    console.log('health', health);
    if (health && Object.keys(health).length !== 0) {
      console.log('health is not empty');
      this.setState({healthprofile: health});
      this.setState({webview: false});
      let keyboardScrollView = this.refs.KeyboardAwareScrollView;
      if (keyboardScrollView) keyboardScrollView.update();
    } else {
      console.log('health is empty');
      this.setState({webview: true});
    }
  }
  onLoadFinished = () => {
    if (this.webview) {
      console.log('posted message');
      this.webview.postMessage('health_botMessages');
    }
  };
  toggleEdit = () => {
    const {editable} = this.state;
    if (editable) {
      this.setState({button_txt: 'Edit Profile Information'});
    } else {
      this.setState({button_txt: 'Save Profile Information'});
    }
    this.setState({editable: !editable});
  };
  onCheck = index => {
    let {healthprofile} = this.state;
    let temp = healthprofile.physical_profile_checked;
    const value = healthprofile.physical_profile_checked[index];
    temp[index] = !value;
    healthprofile.physical_profile_checked = temp;
    this.setState({healthprofile: healthprofile});
  };
  EditInput = (property, value) => {
    let {healthprofile} = this.state;
    healthprofile[property] = value;
    this.setState({healthprofile: healthprofile});
  };
  save = () => {
    const {uid} = this.props;
    let {healthprofile, editable} = this.state;
    if (editable) {
      this.setState({saving: true});
      healthprofile['uid'] = uid;
      Firebase.isActive(uid).then(res => {
        if (res) {
          Firebase.health_signup(healthprofile)
            .then(res => {
              console.log('health_signup', res);
              this.props.dispatch(saveHealth(healthprofile));
              AsyncStorage.setItem(
                'healthprofile',
                JSON.stringify(healthprofile),
              );
              console.log('saving', 'false');
              this.setState({saving: false});
              this.toggleEdit();
            })
            .catch(err => {
              alert(err);
            });
        } else {
          this.setState({saving: false});
          this.setState({
            error_msg:
              'You are not active member. Please activate your profile.',
          });
          this.toggleError();
        }
      });
    } else {
      this.toggleEdit();
    }
  };
  toggleError = visible => {
    this.setState({errorVisible: visible});
  };
  onEventHandler = data => {
    const {healthprofile} = this.state;
    const {uid} = this.props;
    let temp = healthprofile;
    const obj = JSON.parse(data);
    const key = Object.keys(obj)[0];
    console.log('key', key);
    console.log('value', obj[key]);
    temp[key] = obj[key];
    this.setState({healthprofile: temp});

    console.log(obj);
    if (obj.onboardingFinished) {
      temp['uid'] = uid;
      this.setState({healthprofile: temp});
      Firebase.health_signup(temp)
        .then(res => {
          this.props.dispatch(saveHealth(temp));
          AsyncStorage.setItem('healthprofile', JSON.stringify(temp));
        })
        .catch(err => {
          alert(err);
        });
      setTimeout(() => this.setState({webview: false}), 1000);
      console.log('healthprofile', healthprofile);
    } else this.setState(obj);
  };
  render() {
    const {
      healthprofile,
      saving,
      error_msg,
      editable,
      button_txt,
      webview,
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
                alignItems: 'center',
                backgroundColor: colors.white,
                paddingBottom: 50,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Gothic A1',
                  fontSize: 20,
                  fontWeight: '700',
                  marginBottom: 10,
                }}>
                My Health Profile
              </Text>
              <View
                style={{
                  width: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {editable &&
                  physical_profile.map((item, index) => {
                    return (
                      <CheckDiv
                        key={index}
                        title={item}
                        onCheck={() => this.onCheck(index)}
                        checked={healthprofile.physical_profile_checked[index]}
                      />
                    );
                  })}
                {!editable &&
                  physical_profile.map((item, index) => {
                    return (
                      healthprofile.physical_profile_checked[index] && (
                        <View style={styles.checkedItem} key={index}>
                          <Text style={{fontSize: 18}}>{item}</Text>
                          <Image
                            source={ok_img}
                            style={{
                              width: 18,
                              height: 18,
                              marginLeft: 'auto',
                            }}
                          />
                        </View>
                      )
                    );
                  })}
              </View>
              <Text style={styles.Title}>Doctor's information</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>DOCTOR'S NAME</Text>
                <View style={styles.checkedItem}>
                  <TextInput
                    style={styles.input}
                    onChangeText={txt => this.EditInput('doctor_name', txt)}
                    value={healthprofile.doctor_name}
                    editable={editable}
                  />
                  {!editable && healthprofile.doctor_name != '' && (
                    <Image
                      source={ok_img}
                      style={{width: 18, height: 18, marginLeft: 'auto'}}
                    />
                  )}
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>DOCTOR'S NUMBER</Text>
                <View style={styles.checkedItem}>
                  <TextInput
                    style={styles.input}
                    onChangeText={txt => this.EditInput('doctor_phone', txt)}
                    value={healthprofile.doctor_phone}
                    editable={editable}
                  />
                  {!editable && healthprofile.doctor_phone != '' && (
                    <Image
                      source={ok_img}
                      style={{width: 18, height: 18, marginLeft: 'auto'}}
                    />
                  )}
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>SURGERY NAME</Text>
                <View style={styles.checkedItem}>
                  <TextInput
                    style={styles.input}
                    onChangeText={txt => this.EditInput('surgery_name', txt)}
                    value={healthprofile.surgery_name}
                    editable={editable}
                  />
                  {!editable && healthprofile.surgery_name != '' && (
                    <Image
                      source={ok_img}
                      style={{width: 18, height: 18, marginLeft: 'auto'}}
                    />
                  )}
                </View>
              </View>

              {!saving && (
                <TouchableOpacity style={styles.CallAction} onPress={this.save}>
                  <Text style={{color: colors.yellow, fontSize: 15}}>
                    {button_txt}
                  </Text>
                </TouchableOpacity>
              )}
              {saving && (
                <ActivityIndicator size="large" color={colors.darkblue} />
              )}
            </View>
            <Modal
              animationType={'fade'}
              transparent={true}
              visible={this.state.errorVisible}
              onRequestClose={() => {}}>
              <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <TouchableWithoutFeedback
                  style={{flex: 1}}
                  onPress={() => this.toggleError(false)}>
                  <View style={{flex: 1}} />
                </TouchableWithoutFeedback>
                <View style={styles.modal}>
                  <Image source={error_img} style={{width: 80, height: 80}} />
                  <Text style={{fontWeight: '700'}}>Error</Text>
                  <Text style={{textAlign: 'center'}}>{error_msg}</Text>
                  <TouchableHighlight
                    onPress={() => {
                      this.toggleError(false);
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
                    <Text style={styles.text}>OK</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </KeyboardAwareScrollView>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  inputGroup: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  checkedItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 5,
  },
  input: {
    height: 20,
    fontSize: 18,
    borderWidth: 0,
    paddingLeft: 5,
    paddingRight: 5,
  },
  checked_input: {
    height: 40,
    width: '100%',
  },
  Title: {
    fontSize: 20,
    fontFamily: 'Gothic A1',
    color: colors.darkblue,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
  },
  subTitle: {fontSize: 15, color: colors.darkblue},
  CallAction: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.darkblue,
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
    health: state.health,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(HealthProfile);
