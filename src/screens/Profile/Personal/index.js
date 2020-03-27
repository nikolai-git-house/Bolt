import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
  AsyncStorage,
  Modal,
} from 'react-native';
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import ImageResizer from 'react-native-image-resizer';
import colors from '../../../theme/Colors';
import {Metrics} from '../../../theme';
import {saveOnboarding, removeAll} from '../../../Redux/actions/index';
import Firebase from '../../../firebasehelper';
const home_img = require('../../../assets/popup/home.png');
const error_img = require('../../../assets/popup/error.png');
const profile_score_img = require('../../../assets/personal/profile_score.png');
const eco_score_img = require('../../../assets/personal/eco_score.png');
const social_score_img = require('../../../assets/personal/social_score.png');
class PersonalProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      fullname: '',
      dob: '',
      phonenumber: '',
      activated: false,
      job: 'photographer',
      ImageSource: require('../../../assets/avatar.png'),
      isloggedIn: false,
      modalVisible: false,
      successVisible: false,
      errorVisible: false,
      error_msg: '',
      profiletest_webview: false,
      basic: {
        firstname: '',
        dob: '',
        phonenumber: '',
      },
    };
    this.toggleProfile = this.toggleProfile.bind(this);
    this.toggleError = this.toggleError.bind(this);
  }
  toggleProfile(visible) {
    this.setState({modalVisible: visible});
    this.refs.email_Input.focus();
  }
  toggleSuccess(visible) {
    this.setState({successVisible: visible});
  }
  toggleError(visible) {
    this.setState({errorVisible: visible});
  }
  openExplore = () => {
    this.toggleSuccess(false);
    this.navigateTo('Explore');
  };
  componentWillReceiveProps(props) {
    let basic = props.basic;
    const {active} = basic;
    if (active) this.setState({activated: true});
    console.log('basic in receive props', basic);
    //this.setState({ isloggedIn: true });
  }
  componentDidMount() {
    let _this = this;
    let basic = this.props.basic;
    const {active} = basic;
    if (active) this.setState({activated: true});
    if (!basic) {
      basic = {
        firstname: 'test',
        dob: '08/12/1994',
        phonenumber: '+971553818380',
      };
    } else {
      this.setState({isloggedIn: true});
      this.setState({dob: basic.dob});
      this.setState({phonenumber: basic.phonenumber});
      if (basic.avatar_url) {
        const source = {uri: basic.avatar_url};
        this.setState({ImageSource: source});
      }
      this.setState(basic);
    }
  }
  selectPhotoTapped() {
    let uid = this.props.uid;
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

        //let source = { uri: "data:image/jpeg;base64," + response.data };

        let source = {uri: response.uri};

        thisElement.setState({
          ImageSource: source,
        });
        this.uploadImage(response.uri, uid);
      }
    });
  }
  uploadImage(uri, uid) {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    const tempWindowXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    return ImageResizer.createResizedImage(uri, 300, 300, 'JPEG', 80)
      .then(resizedImageUri => {
        const uploadUri =
          Platform.OS === 'ios'
            ? resizedImageUri.uri.replace('file://', '')
            : resizedImageUri.uri;

        let mime = 'image/jpg';
        let uploadBlob = null;
        const path = 'avatars/';
        const imageRef = Firebase.storage()
          .ref(path)
          .child(`${uid}.jpg`);

        return fs
          .readFile(uploadUri, 'base64')
          .then(data => {
            return Blob.build(data, {type: `${mime};BASE64`});
          })
          .then(blob => {
            uploadBlob = blob;
            return imageRef.put(blob, {contentType: mime});
          })
          .then(() => {
            uploadBlob.close();
            return imageRef.getDownloadURL();
          })
          .then(url => {
            console.log('url', url);
            window.XMLHttpRequest = tempWindowXMLHttpRequest;
            Firebase.pushProfileImage(uid, url)
              .then(res => {
                console.log('res', res);
                this.props.dispatch(saveOnboarding(res));
                AsyncStorage.setItem('profile', JSON.stringify(res));
              })
              .catch(err => {
                console.log('error', err);
              });
          })
          .catch(err => {
            console.log('error', err);
          });
      })
      .catch(err => {
        console.log('error', err);
      });
  }
  navigateTo = page => {
    this.props.navigation.navigate(page);
  };
  startProfileTest = () => {
    this.setState({profiletest_webview: true});
  };
  LogOut = () => {
    this.props.dispatch(removeAll());
    AsyncStorage.removeItem('profile');
    AsyncStorage.removeItem('uid');
    AsyncStorage.removeItem('petprofile');
    AsyncStorage.removeItem('bikeprofile');
    AsyncStorage.removeItem('healthprofile');
    console.log('LogOut,AsyncStorage', AsyncStorage.getItem('profile'));
    this.setState({editable: true, isloggedIn: false});
    setTimeout(() => {
      this.props.navigation.navigate('Landing');
    }, 1000);
  };
  onLoadFinished = () => {
    const {basic} = this.props;
    if (this.profiletest_webview) {
      console.log('posted message');
      this.profiletest_webview.postMessage(JSON.stringify(basic));
    }
  };
  onEventHandler = data => {};
  render() {
    const {
      firstname,
      dob,
      phonenumber,
      activated,
      error_msg,
      profiletest_webview,
    } = this.state;
    let basic = this.props.basic;
    let avatar_url = basic.avatar_url;
    return (
      <View
        style={{
          width: Metrics.screenWidth,
          height: Metrics.screenHeight,
          flex: 1,
          backgroundColor: 'transparent',
          fontFamily: 'Gothic A1',
          marginTop: -80,
        }}>
        {profiletest_webview && (
          <WebView
            ref={r => (this.profiletest_webview = r)}
            originWhitelist={['*']}
            source={
              Platform.OS === 'ios'
                ? {uri: './external/profile_test/index.html'}
                : {uri: 'file:///android_asset/profile_test/index.html'}
            }
            onMessage={event => this.onEventHandler(event.nativeEvent.data)}
            onLoad={this.onLoadFinished}
            startInLoadingState
            javaScriptEnabled
            mixedContentMode="always"
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
          />
        )}
        {!profiletest_webview && (
          <KeyboardAwareScrollView
            style={{width: '100%', height: '100%'}}
            contentContainerStyle={{alignItems: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'Gothic A1',
                fontSize: 20,
                fontWeight: '700',
                marginBottom: 0,
              }}>
              {firstname}'s ID
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -10,
              }}>
              <TouchableOpacity
                onPress={this.selectPhotoTapped.bind(this)}
                style={styles.avatar}>
                <ImageBackground
                  style={styles.imageContainer}
                  source={this.state.ImageSource}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.CallAction}
                onPress={() => this.LogOut()}>
                <Text>LogOut</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 10,
                width: '80%',
                flex: 1,
                alignItems: 'flex-start',
              }}>
              <View style={styles.Section}>
                <Image
                  source={
                    activated
                      ? require(`../../../assets/activated.png`)
                      : require(`../../../assets/nonactivated.png`)
                  }
                  style={{width: 30, height: 30, marginRight: 10}}
                />
                <Text style={styles.input}>
                  {activated ? 'Active member' : 'Non active member'}
                </Text>
              </View>
              <View style={styles.Section}>
                <Image
                  source={require('../../../assets/gift.png')}
                  style={{width: 25, height: 25, marginRight: 10}}
                />
                <Text style={styles.input}>{dob}</Text>
              </View>
              <View style={styles.Section}>
                <Image
                  source={require('../../../assets/phone.png')}
                  style={{width: 25, height: 25, marginRight: 10}}
                />
                <Text style={styles.input}>{phonenumber}</Text>
              </View>
            </View>
            <View style={styles.row_view}>
              <View style={styles.group}>
                <ImageBackground
                  source={profile_score_img}
                  style={styles.token_img_container}>
                  <Text style={styles.token_number}>50</Text>
                </ImageBackground>
                <Text style={styles.coin_text}>Profile score</Text>
              </View>
              <View style={styles.group}>
                <ImageBackground
                  source={eco_score_img}
                  style={styles.token_img_container}>
                  <Text style={styles.token_number}>50</Text>
                </ImageBackground>
                <Text style={styles.coin_text}>Eco score</Text>
              </View>
              <View style={styles.group}>
                <ImageBackground
                  source={social_score_img}
                  style={styles.token_img_container}>
                  <Text style={styles.token_number}>50</Text>
                </ImageBackground>
                <Text style={styles.coin_text}>Social score</Text>
              </View>
            </View>
            {/* <View style={styles.buttonContainer}>
              <Image source={member_img} style={styles.img} />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}>
                <Text style={styles.Title}> Verified profile</Text>
                <Text style={{fontSize: 14}}>Verified ID for extra access</Text>
              </View>

              <TouchableOpacity
                style={styles.CallAction}
                onPress={this.startProfileTest}>
                <Text style={{color: colors.darkblue, fontSize: 15}}>
                  Take Test
                </Text>
              </TouchableOpacity>
            </View> */}
          </KeyboardAwareScrollView>
        )}

        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={() => this.toggleProfile(false)}>
              <View style={{flex: 1}} />
            </TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Image source={home_img} style={{width: 80, height: 80}} />
              <Text style={{textAlign: 'center'}}>
                We need to collect some more information from you to create your
                secure account.
              </Text>
              <Text style={{fontWeight: '700'}}>
                You'll have full access to perks.
              </Text>
              <TouchableHighlight
                onPress={() => {
                  this.toggleProfile(false);
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
                <Text style={styles.text}>Complete</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
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
              <Text style={{fontWeight: '700'}}>Error.</Text>
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
      </View>
    );
  }
}
const styles = StyleSheet.create({
  Title: {
    fontSize: 18,
    fontFamily: 'Gothic A1',
    color: colors.darkblue,
    fontWeight: '700',
  },
  CallAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 30,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: colors.darkblue,
    borderWidth: 1,
    backgroundColor: colors.lightgrey,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 3,
  },
  avatar: {
    marginTop: 20,
    shadowOffset: {height: 1, width: 1},
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  coin_text: {
    fontSize: 12,
  },
  token_img_container: {
    width: 80,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  token_number: {
    fontSize: 20,
    marginTop: -10,
    textAlign: 'center',
  },
  row_view: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 40,
    height: 40,
  },
  buttonGroup: {
    width: '90%',
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
  },
  buttonContainer: {
    width: '90%',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginTop: 10,
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
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 10,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 30,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: colors.darkblue,
    borderWidth: 1,
    backgroundColor: colors.lightgrey,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 3,
  },
  Section: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    height: 25,
    width: '100%',
  },
  Name: {
    fontSize: 20,
    color: colors.darkblue,
  },
  input: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 0,
    paddingTop: 0,
    fontSize: 20,
  },
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    basic: state.basic,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PersonalProfile);
