import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Button,
  Keyboard,
  Dimensions,
  TextInput,
  findNodeHandle,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  TouchableHighlight,
  AsyncStorage,
} from 'react-native';
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Sound from 'react-native-sound';
import ImagePicker from 'react-native-image-picker';
import colors from '../../../theme/Colors';
import CheckDiv from '../../../components/CheckDiv';
import Twocheckbox from '../../../components/Twocheckbox';
import Firebase from '../../../firebasehelper';
import {savePet} from '../../../Redux/actions/index';
import Metrics from '../../../theme/Metrics';

const ok_img = require('../../../assets/success.png');
const error_img = require('../../../assets/popup/error.png');

var bamboo = new Sound('bamboo.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});
bamboo.setVolume(0.5);

class PetsProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource: require('../../../assets/Pets/avatar.jpeg'),
      petpack: 'Bolt-on',
      petprofile: {
        pet_profile_checked: [false, false, false, false],
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
    const {pet} = this.props;
    console.log('pet', pet);
    if (pet && Object.keys(pet).length !== 0) {
      this.setState({petprofile: pet});
      this.setState({webview: false});
      let keyboardScrollView = this.refs.KeyboardAwareScrollView;
      if (keyboardScrollView) keyboardScrollView.update();
    } else {
      this.setState({webview: true});
    }
  }
  onLoadFinished = () => {
    if (this.webview) {
      console.log('posted message');
      this.webview.postMessage('pet_botMessages');
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
  isPetPackActive() {
    const {basic} = this.props;
    const packages = basic.packages;
    let result = false;
    if (packages) {
      packages.map((item, index) => {
        if (item.caption === 'Pet Friendly Renting Pack') result = true;
      });
    }
    console.log('isPetPackActive', result);
    return result;
  }
  save = () => {
    const {uid} = this.props;
    let {petprofile, editable} = this.state;
    if (editable) {
      this.setState({saving: true});
      petprofile['uid'] = uid;
      Firebase.isActive(uid).then(res => {
        if (res) {
          Firebase.pet_signup(petprofile)
            .then(res => {
              this.props.dispatch(savePet(petprofile));
              AsyncStorage.setItem('petprofile', JSON.stringify(petprofile));
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
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  onActivate_PetPack = () => {
    this.navigateTo('MainList', {
      ongoBack: () => console.log('Will go back from nextComponent'),
      packageRequired: ['Pet Friendly Renting Pack'],
    });
  };

  onEventHandler = data => {
    const {petprofile} = this.state;
    const {uid} = this.props;
    let temp = petprofile;
    bamboo.play();
    if (data != 'bamboo') {
      const obj = JSON.parse(data);
      const key = Object.keys(obj)[0];
      console.log('key', key);
      console.log('value', obj[key]);
      temp[key] = obj[key];
      this.setState({petprofile: temp});

      console.log(obj);
      if (obj.onboardingFinished) {
        temp['uid'] = uid;
        this.setState({petprofile: temp});
        Firebase.pet_signup(temp)
          .then(res => {
            this.props.dispatch(savePet(temp));
            AsyncStorage.setItem('petprofile', JSON.stringify(temp));
          })
          .catch(err => {
            alert(err);
          });
        setTimeout(() => this.setState({webview: false}), 1000);
        console.log('petprofile', petprofile);
      } else this.setState(obj);
    }
  };
  render() {
    const {
      ImageSource,
      petpack,
      petprofile,
      saving,
      error_msg,
      editable,
      button_txt,
      webview,
    } = this.state;
    console.log('petprofile', petprofile);
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
          <KeyboardAwareScrollView
            style={{width: '100%', height: '100%'}}
            contentContainerStyle={{alignItems: 'center'}}
            ref="KeyboardAwareScrollView"
            extraScrollHeight={100}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'Gothic A1',
                fontSize: 20,
                fontWeight: '700',
                marginBottom: 0,
              }}>
              My Pet ID
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                paddingBottom: 50,
              }}>
              <TouchableOpacity
                onPress={this.selectPhotoTapped.bind(this)}
                style={styles.avatar}>
                <ImageBackground
                  style={styles.imageContainer}
                  source={ImageSource}
                />
              </TouchableOpacity>
              <View style={[styles.Row, {marginBottom: 20}]}>
                <View style={styles.PetsContainer}>
                  <Text style={styles.Title}>{petprofile.pet_name}</Text>
                  <View style={styles.Row}>
                    <View style={styles.Column}>
                      <Text style={styles.subTitle}>SPECIES</Text>
                      <Text>{petprofile.species}</Text>
                    </View>
                    <View style={styles.Column}>
                      <Text style={styles.subTitle}>GENDER</Text>
                      <Text>{petprofile.pet_gender}</Text>
                    </View>
                  </View>
                  <View style={styles.Row}>
                    <View style={styles.Column}>
                      <Text style={styles.subTitle}>AGE</Text>
                      <Text>{petprofile.pet_age}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: '90%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
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
                      source={require('../../../assets/pet.png')}
                    />
                    <Text style={{fontSize: 16}}>Pet Pack</Text>
                  </View>
                  {/* <TouchableOpacity
                    style={
                      !this.isPetPackActive() ? styles.CtoA : styles.CtoA_Clk
                    }
                    onPress={this.onActivate_PetPack}
                    disabled={this.isPetPackActive()}>
                    <Text style={{fontSize: 14, color: colors.darkblue}}>
                      Activate
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </View>
              <Text style={styles.Title}>Tell us about your pet</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>FAVOURITE FOOD TREAT</Text>
                <Text style={styles.input}>
                  {petprofile.pet_favourite_food}
                </Text>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>SPECIAL FOOD REQUIREMENT</Text>

                <Text style={styles.input}>{petprofile.pet_special_food}</Text>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>FAVOURITE TOY</Text>
                <Text style={styles.input}>{petprofile.pet_toy}</Text>
              </View>
              <Text style={styles.Title}>Emergency Contact</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>CONTACT FULL NAME</Text>
                <Text style={styles.input}>{petprofile.vet_name}</Text>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>CONTACT NUMBER</Text>
                <Text style={styles.input}>+44{petprofile.vet_phone}</Text>
              </View>
            </View>
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
    marginTop: 10,
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
  avatar: {
    shadowOffset: {height: 1, width: 1},
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  Row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  Column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  PetsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    backgroundColor: 'transparent',
    fontFamily: 'Gothic A1',
  },
  inputGroup: {
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  input: {
    fontSize: 18,
    borderWidth: 0,
    paddingLeft: 5,
    paddingRight: 5,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 10,
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
    pet: state.pet,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PetsProfile);
