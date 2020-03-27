import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  Image,
  ImageBackground,
  ToolbarAndroid,
  AsyncStorage,
  Platform,
  Button,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  TextInput,
  findNodeHandle,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Sound from 'react-native-sound';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import ImagePicker from 'react-native-image-picker';
import colors from '../../../theme/Colors';
import Logo from '../../../components/Logo';
import {Metrics} from '../../../theme';
import Firebase from '../../../firebasehelper';
import {saveBike} from '../../../Redux/actions/index';

const default_avatar = require('../../../assets/plus.png');
const ok_img = require('../../../assets/success.png');
const error_img = require('../../../assets/popup/error.png');

var bamboo = new Sound('bamboo.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});
bamboo.setVolume(0.5);
class TravelProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource: require('../../../assets/Bike/avatar.jpg'),
      saving: false,
      errorVisible: false,
      bikeprofile: {},
      error_msg: '',
      editable: false,
      button_txt: 'Edit Profile Information',
      webview: true,
    };
  }
  componentDidMount() {
    console.log('didmount');
    const {bike} = this.props;
    console.log('bike', bike);
    if (bike && Object.keys(bike).length !== 0) {
      this.setState({bikeprofile: bike});
      this.setState({webview: false});
    } else {
      this.setState({webview: true});
    }
  }
  onLoadFinished = () => {
    if (this.webview) {
      console.log('posted message');
      this.webview.postMessage('bike_botMessages');
    }
  };
  selectPhotoTapped() {
    let thisElement = this;
    const options = {
      mediaType: 'photo', // 'photo' or 'video'
      allowsEditing: true, // Built in functionality to resize/reposition the image after selection

      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
        cameraRoll: true,
        waitUntilSaved: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let imgData = {
          image:
            Platform.OS === 'android'
              ? response.uri
              : response.uri.replace('file://', ''),
          filePath: response.path,
          fileName: response.fileName,
        };
      }
      let source = {uri: 'data:image/jpeg;base64,' + response.data};
      console.log('imgSource', source);
      //let source = { uri: response.uri };
      thisElement.setState({
        ImageSource: source,
      });
    });
  }
  toggleError = visible => {
    this.setState({errorVisible: visible});
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
  save = () => {
    let {bikeprofile, editable} = this.state;
    const {uid} = this.props;
    console.log(bikeprofile);
    if (editable) {
      this.setState({saving: true});
      bikeprofile['uid'] = uid;
      Firebase.isActive(uid).then(res => {
        if (res) {
          Firebase.bike_signup(bikeprofile)
            .then(res => {
              this.props.dispatch(saveBike(bikeprofile));
              AsyncStorage.setItem('bikeprofile', JSON.stringify(bikeprofile));
              console.log('saving', 'false');
              this.setState({saving: false});
            })
            .catch(err => {
              alert(err);
            });
        } else {
          this.setState({saving: false});
          this.toggleEdit();
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
  EditInput = (property, value) => {
    let {bikeprofile} = this.state;
    bikeprofile[property] = value;
    this.setState({bikeprofile: bikeprofile});
  };
  onEventHandler = data => {
    const {bikeprofile} = this.state;
    const {uid} = this.props;
    let temp = bikeprofile;
    bamboo.play();
    if (data != 'bamboo') {
      const obj = JSON.parse(data);
      const key = Object.keys(obj)[0];
      console.log('key', key);
      console.log('value', obj[key]);
      temp[key] = obj[key];
      this.setState({bikeprofile: temp});

      console.log(obj);
      if (obj.onboardingFinished) {
        temp['uid'] = uid;
        this.setState({bikeprofile: temp});
        Firebase.bike_signup(temp)
          .then(res => {
            this.props.dispatch(saveBike(temp));
            AsyncStorage.setItem('bikeprofile', JSON.stringify(temp));
          })
          .catch(err => {
            alert(err);
          });
        setTimeout(() => this.setState({webview: false}), 1000);
        console.log('bikeprofile', bikeprofile);
      } else this.setState(obj);
    }
  };
  render() {
    const {
      ImageSource,
      error_msg,
      saving,
      bikeprofile,
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
                : require('../../../webview/onboarding/index.html')
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
        {!webview && (
          <KeyboardAwareScrollView
            style={{flex: 1}}
            contentContainerStyle={{flexGrow: 1}}>
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
                My Bike Profile
              </Text>

              <View style={styles.Row}>
                <TouchableOpacity
                  onPress={this.selectPhotoTapped.bind(this)}
                  style={styles.avatar}>
                  <ImageBackground
                    style={styles.imageContainer}
                    source={ImageSource}
                  />
                </TouchableOpacity>
                <View style={styles.BikeContainer}>
                  <View style={styles.Row}>
                    <TextInput
                      style={styles.Title}
                      placeholder="Brand"
                      onChangeText={txt => this.EditInput('name', txt)}
                      value={bikeprofile.bike_brand}
                      editable={editable}
                    />
                    {!editable && bikeprofile.bike_brand && (
                      <Image
                        source={ok_img}
                        style={{width: 18, height: 18, marginLeft: 'auto'}}
                      />
                    )}
                  </View>
                  <View style={styles.Row}>
                    <View style={styles.Column}>
                      <Text style={styles.subTitle}>MODEL</Text>
                      <TextInput
                        style={{backgroundColor: 'transparent'}}
                        placeholder="MODEL"
                        onChangeText={txt => this.EditInput('model', txt)}
                        value={bikeprofile.bike_model}
                        editable={editable}
                      />
                    </View>
                    <View style={styles.Column}>
                      <Text style={styles.subTitle}>COLOUR</Text>

                      <TextInput
                        style={{backgroundColor: 'transparent'}}
                        placeholder="COLOUR"
                        onChangeText={txt => this.EditInput('colour', txt)}
                        value={bikeprofile.bike_colour}
                        editable={editable}
                      />
                    </View>
                    {!editable &&
                      bikeprofile.bike_model &&
                      bikeprofile.bike_colour && (
                        <Image
                          source={ok_img}
                          style={{width: 18, height: 18, marginLeft: 'auto'}}
                        />
                      )}
                  </View>
                </View>
              </View>
              <Text style={[styles.Title, {marginTop: 30}]}>
                Tell us about your bike
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>BIKE'S FRAME NUMBER</Text>
                <View
                  style={[
                    styles.checkedItem,
                    {justifyContent: 'space-between', width: '100%'},
                  ]}>
                  <TextInput
                    style={styles.input}
                    onChangeText={txt => this.EditInput('frame', txt)}
                    value={bikeprofile.bike_frame}
                    editable={editable}
                  />
                  {!editable && bikeprofile.bike_frame && (
                    <Image
                      source={ok_img}
                      style={{width: 18, height: 18, marginLeft: 'auto'}}
                    />
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>HOW MUCH DOES IT COST?</Text>
                <View
                  style={[
                    styles.checkedItem,
                    {justifyContent: 'space-between', width: '100%'},
                  ]}>
                  <TextInput
                    style={styles.input}
                    onChangeText={txt => this.EditInput('price', txt)}
                    value={bikeprofile.bike_price}
                    editable={editable}
                  />
                  {!editable && bikeprofile.bike_price && (
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
  Title: {
    fontSize: 20,
    fontFamily: 'Gothic A1',
    color: colors.darkblue,
    fontWeight: '700',
    textAlign: 'center',
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
  Row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    backgroundColor: colors.white,
    fontFamily: 'Gothic A1',
  },
  Column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  BikeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  checkedItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  input: {
    height: 20,
    fontSize: 18,
    borderWidth: 0,
    paddingLeft: 5,
    paddingRight: 5,
  },
  avatar: {
    marginTop: 20,
    shadowOffset: {height: 1, width: 1},
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 10,
    marginRight: 30,
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
    bike: state.bike,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TravelProfile);
