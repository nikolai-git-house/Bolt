import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Platform,
  AsyncStorage,
  Modal,
  TouchableOpacity,
} from 'react-native';
import WebView from 'react-native-webview';
import colors from '../../../theme/Colors';
import Sound from 'react-native-sound';
import {connect} from 'react-redux';
import {saveOnboarding} from '../../../Redux/actions/index';
import Subscription from '../../../components/Subscription';
import Firebase from '../../../firebasehelper';
import {createToken, createCustomer} from '../../../apis/index';
import {Metrics} from '../../../theme';
const error_img = require('../../../assets/popup/error.png');
const ballon_image = require('../../../assets/popup/balloon.png');
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
class SubscriptionProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      success: false,
      error_msg: '',
      pkgs: [],
      payment_status: false,
      card_info: {},
      webview: true,
    };
  }
  componentDidMount() {
    console.log('this.props', this.props);
    console.log('basic in Subscriptions', this.props.basic);
    this.setState({
      webview: this.props.basic.active ? false : true,
    });
    if (this.props.basic.packages) {
      this.setState({pkgs: this.props.basic.packages});
    } else {
      console.log('Empty Package');
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
    this.setState({
      webview: nextProps.basic.customer_id ? false : true,
    });
    if (nextProps.basic.packages) {
      this.setState({pkgs: nextProps.basic.packages});
    }
  }
  navigateTo = page => {
    this.props.navigation.navigate(page);
  };
  addCard = async card_info => {
    console.log('card_info', card_info);
    const {cardNumber, expiry, cvc} = card_info;
    const {email, firstname} = this.props.basic;
    const {uid} = this.props;
    let card_number = cardNumber.replace(/\s/g, '');
    let card_exp = expiry.replace(/\s/g, '');
    let month_year = card_exp.split('/');
    let exp_month = month_year[0];
    let exp_year = '20' + month_year[1];
    let name = firstname;

    console.log('number', card_number);
    console.log('exp_month', exp_month);
    console.log('exp_year', exp_year);

    let token_data, customer_data;
    try {
      token_data = await createToken(card_number, exp_month, exp_year, cvc);
      let token = token_data.data.id;
      console.log('token', token);
      let description = 'EcosystemBot Charge for ' + name;
      customer_data = await createCustomer(description, email, token);
      let customer_id = customer_data.data.id;
      console.log('customer_id', customer_id);
      let last4 = card_number.substring(12);
      Firebase.updateUserData(uid, {
        customer_id: customer_id,
        last4: last4,
      }).then(res => {
        this.props.dispatch(saveOnboarding(res));
        AsyncStorage.setItem('profile', JSON.stringify(res));
        this.toggleModal('success', true);
      });
    } catch (err) {
      console.log('err', err.toString());
      this.setState({error_msg: err.toString()});
      this.toggleModal('error', true);
    }
  };
  onLoadFinished = () => {
    const {firstname} = this.props.basic;
    if (this.subscriptions_webview) {
      console.log('firstname', firstname);
      console.log('posted message');
      this.subscriptions_webview.postMessage(
        JSON.stringify({
          firstname: firstname,
          profile_type: 'subscriptions_botMessages',
        }),
      );
    }
  };
  toggleModal(type, visible) {
    if (type === 'error') this.setState({error: visible});
    if (type === 'success') this.setState({success: visible});
  }
  onEventHandler = async data => {
    const {card_info} = this.state;
    const {uid} = this.props;
    let temp = card_info;
    bamboo.play();
    if (data != 'bamboo') {
      const obj = JSON.parse(data);
      const key = Object.keys(obj)[0];
      console.log('key', key);
      console.log('value', obj[key]);
      const card_info = JSON.parse(obj[key]);
      setTimeout(() => this.setState({webview: false}), 1000);
      this.addCard(card_info);
    }
  };
  onExplore = () => {
    this.toggleModal('success', false);
    this.navigateTo('Explore');
  };
  onReplay = () => {
    this.toggleModal('error', false);
    this.setState({webview: true});
  };
  render() {
    const {pkgs, error_msg, webview} = this.state;
    const {basic} = this.props;
    const {last4, customer_id} = basic;
    return (
      <View style={styles.maincontainer}>
        {webview && (
          <WebView
            ref={r => (this.subscriptions_webview = r)}
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
          <View
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: colors.white,
              fontFamily: 'Gothic A1',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '700',
                marginBottom: 20,
              }}>
              My Subscriptions.
            </Text>
            {customer_id && (
              <View style={styles.Section}>
                <Image
                  source={require(`../../../assets/activated.png`)}
                  style={{width: 30, height: 30, marginRight: 10}}
                />
                <Text>**** **** **** {last4}</Text>
              </View>
            )}
            {!customer_id && (
              <View style={styles.Section}>
                <Image
                  source={require(`../../../assets/nonactivated.png`)}
                  style={{width: 30, height: 30, marginRight: 10}}
                />
              </View>
            )}
            <View>
              <Text style={{textAlign: 'center', marginBottom: 50}}>
                All subscriptions are debited on the day of the month which you
                purchased them.
              </Text>
              <ScrollView>
                {pkgs.map((item, index) => {
                  return (
                    <Subscription
                      price={item.price}
                      pkgName={item.caption}
                      key={index}
                    />
                  );
                })}
              </ScrollView>
            </View>
          </View>
        )}
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.error}
          onRequestClose={() => {}}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => this.toggleModal('error', false)}>
              <View style={{flex: 1}} />
            </TouchableOpacity>
            <View style={styles.modal}>
              <Image source={error_img} style={{width: 80, height: 80}} />
              <Text style={{fontWeight: '700'}}>Error</Text>
              <Text style={{textAlign: 'center'}}>{error_msg}</Text>
              <TouchableOpacity
                onPress={this.onReplay}
                style={{
                  backgroundColor: colors.brand,
                  width: 100,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: colors.grey,
                  borderWidth: 1,
                }}>
                <Text style={styles.text}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.success}
          onRequestClose={() => {}}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => this.toggleModal('success', false)}>
              <View style={{flex: 1}} />
            </TouchableOpacity>
            <View style={styles.modal}>
              <Image source={ballon_image} style={{width: 80, height: 80}} />
              <Text style={{fontWeight: '700'}}>Congratulations.</Text>
              <Text style={{textAlign: 'center'}}>
                Thank you. I have successfully registered your card. Subscribing
                and quick buying is unlocked.
              </Text>
              <TouchableOpacity
                onPress={this.onExplore}
                style={{
                  backgroundColor: colors.brand,
                  width: 100,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: colors.grey,
                  borderWidth: 1,
                }}>
                <Text style={styles.text}>Explore</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    backgroundColor: colors.white,
  },
  button: {
    width: 100,
    height: 100,
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.grey,
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 1, width: 1}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android,
  },
  buttonClk: {
    width: 100,
    height: 100,
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.grey,
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 8, width: 8}, // IOS
    shadowOpacity: 0.4, // IOS
    shadowRadius: 0.2, //IOS
    elevation: 2, // Android,
  },
  Title: {
    fontSize: 20,
    fontFamily: 'Gothic A1',
    color: colors.white,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 0,
  },
  CallAction: {
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 5,
    padding: 5,
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
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 40,
    overflow: 'hidden',
  },
  Section: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
    height: 25,
    width: '100%',
    fontSize: 20,
  },
  Section_Column: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
    width: '100%',
    fontSize: 20,
  },
  Icon: {
    padding: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.darkblue,
    paddingLeft: 10,
    marginBottom: 20,
  },
  tabStyle: {
    backgroundColor: '#f0eff5',
  },
  activeTabTextStyle: {
    color: '#fff',
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
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubscriptionProfile);
