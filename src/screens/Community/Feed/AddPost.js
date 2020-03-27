import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  ImageBackground,
  Platform,
  AsyncStorage,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {connect} from 'react-redux';
import ImageResizer from 'react-native-image-resizer';
import Spinner from 'react-native-loading-spinner-overlay';
import {saveOnboarding} from '../../../Redux/actions';
import colors from '../../../theme/Colors';
import Firebase from '../../../firebasehelper';

const GIFT_NEWPOST = 2;
class AddPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboard: 'invisible',
      ImageSource: '',
      posting: false,
    };
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }
  componentWillMount() {
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }
  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidHide() {
    this.setState({keyboard: 'invisible'});
  }
  componentDidMount() {}
  selectPhotoTapped = () => {
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
      console.log('image response', response);
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
      let source = {uri: response.uri};
      thisElement.setState({
        ImageSource: source,
      });
      console.log('source', source);
      //this.uploadImage(response.uri, uid);
    });
  };
  async uploadImage(uri, imageName) {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    const tempWindowXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    try {
      const resizedImageUri = await ImageResizer.createResizedImage(
        uri,
        300,
        300,
        'JPEG',
        80,
      );
      const uploadUri =
        Platform.OS === 'ios'
          ? resizedImageUri.uri.replace('file://', '')
          : resizedImageUri.uri;

      let mime = 'image/jpg';
      let uploadBlob = null;
      const path = 'posters/';
      const imageRef = Firebase.storage()
        .ref(path)
        .child(`${imageName}.jpg`);
      const data = await fs.readFile(uploadUri, 'base64');
      uploadBlob = await Blob.build(data, {type: `${mime};BASE64`});
      await imageRef.put(uploadBlob, {contentType: mime});
      uploadBlob.close();
      const url = await imageRef.getDownloadURL();
      return url;
    } catch (error) {
      console.log(error);
    }
  }
  EditTitle = txt => {
    this.setState({title: txt});
  };
  EditContent = txt => {
    this.setState({content: txt});
  };
  onFocusContent = () => {
    this.setState({keyboard: 'visible'});
    let keyboard_Height = 300;
    this.setState({keyboard_Height});
    let self = this;
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
    }, 100);
  };
  onPost = async () => {
    const {title, content, ImageSource} = this.state;
    const {uid, basic} = this.props;
    const tokens = basic.tokens;
    if (ImageSource) {
      try {
        this.setState({posting: true});
        let today = new Date();
        let time_num = today.getTime();
        const poster = {uid, title, content};
        const res = await Firebase.addPost(poster);
        let new_tokens = tokens + GIFT_NEWPOST;
        Firebase.updateUserData(uid, {tokens: new_tokens}).then(res => {
          this.props.dispatch(saveOnboarding(res));
          AsyncStorage.setItem('profile', JSON.stringify(res));
        });
        const post_id = res.id;
        let url = await this.uploadImage(ImageSource.uri, time_num.toString());
        await Firebase.updatePost(post_id, {
          img_url: url,
        });
        this.setState({posting: false});
      } catch (error) {
        this.setState({posting: false});
        console.log(error);
      }
    }
  };
  render() {
    const {title, content, posting} = this.state;
    return (
      <View style={styles.maincontainer}>
        <Spinner
          visible={posting}
          textContent={'Posting...'}
          textStyle={styles.spinnerTextStyle}
        />
        <ScrollView
          ref="scrollView"
          contentContainerStyle={{
            width: '100%',
            minHeight: 600,
            display: 'flex',
            flexDirection: 'column',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              height: 50,
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: colors.white,
            }}>
            <TouchableOpacity
              style={{
                width: 80,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: 10,
                marginBottom: 10,
              }}
              onPress={this.props.onGoBack}>
              <Image
                style={styles.tabbutton}
                source={require('../../../assets/Explore/community/back.png')}
              />
              <Text style={{marginLeft: 10}}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 80,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: 10,
                marginBottom: 10,
              }}
              onPress={this.onPost}>
              <Text style={{marginRight: 10}}>Post</Text>
              <Image
                style={styles.tabbutton}
                source={require('../../../assets/Explore/community/post.png')}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Title of your post"
            style={{
              padding: 10,
              width: '100%',
              fontSize: 15,
              marginBottom: 10,
              backgroundColor: colors.white,
            }}
            value={title}
            onChangeText={this.EditTitle}
          />
          <View
            style={{
              width: '100%',
              height: 60,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 10,
              marginBottom: 10,
              backgroundColor: colors.white,
            }}>
            <TouchableOpacity onPress={this.selectPhotoTapped}>
              <Image
                style={styles.imageContainer}
                source={require('../../../assets/Explore/community/feature_img.png')}
              />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 10,
                width: 120,
              }}>
              Feature Image
            </Text>
            <Image
              style={styles.postimageContainer}
              source={this.state.ImageSource}
            />
          </View>
          <TextInput
            placeholder="What would you like to write about?"
            multiline={true}
            numberOfLines={9}
            maxLength={500}
            style={{
              width: '100%',
              backgroundColor: colors.white,
              padding: 10,
              height: 250,
            }}
            onFocus={this.onFocusContent}
            value={content}
            onChangeText={this.EditContent}
          />
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  maincontainer: {
    width: '100%',
    height: '100%',
    fontFamily: 'Gothic A1',
    //minHeight: Metrics.screenHeight - 20,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.lightgrey,
  },
  tabbutton: {
    width: 20,
    height: 20,
  },
  postimageContainer: {
    width: '100%',
    height: 50,
  },
  imageContainer: {
    width: 30,
    height: 30,
    overflow: 'hidden',
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
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AddPost);
