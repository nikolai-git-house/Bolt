import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  AsyncStorage,
  Platform,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import {saveOnboarding} from '../../Redux/actions/index';
import Logo from '../../components/Logo';
import Sound from 'react-native-sound';
import TopImage from '../../components/TopImage';
import colors from '../../theme/Colors';
import {
  createToken,
  createCustomer,
  createPlan,
  createSubscription,
} from '../../apis/index';
import Firebase from '../../firebasehelper';
import Metrics from '../../theme/Metrics';
const error_img = require('../../assets/popup/error.png');
const ballon_image = require('../../assets/popup/balloon.png');
var bamboo = new Sound('bamboo.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});
bamboo.setVolume(0.5);

class PaymentSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      success: false,
      subscribe: false,
      submitted: false,
      confirming: false,
      subscribing: false,
      card_info: {},
      error_msg: '',
      webview: true,
    };
  }
  componentDidMount() {
    if (this.props.navigation.state.params) {
      const {price, pkgName} = this.props.navigation.state.params;
      this.setState({price, pkgName});
    }
  }
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  addCard = async card_info => {
    console.log('card_info', card_info);
    const {price, pkgName} = this.state;
    const {cardNumber, expiry, cvc} = card_info;
    const {email, firstname} = this.props.basic;
    const {uid} = this.props;
    let card_number = cardNumber.replace(/\s/g, '');
    let card_exp = expiry.replace(/\s/g, '');
    let month_year = card_exp.split('/');
    let exp_month = month_year[0];
    let exp_year = '20' + month_year[1];

    console.log('number', card_number);
    console.log('exp_month', exp_month);
    console.log('exp_year', exp_year);
    this.setState({confirming: true});
    let token_data, customer_data;
    try {
      token_data = await createToken(card_number, exp_month, exp_year, cvc);
      let token = token_data.data.id;
      console.log('token', token);
      let description = 'EcosystemBot Charge for ' + firstname;
      customer_data = await createCustomer(description, email, token);
      let customer_id = customer_data.data.id;
      let last4 = card_number.substring(12);
      Firebase.updateUserData(uid, {
        customer_id: customer_id,
        last4: last4,
      }).then(res => {
        this.setState({confirming: false});
        this.props.dispatch(saveOnboarding(res));
        AsyncStorage.setItem('profile', JSON.stringify(res));
        this.setState({customer_id});
        if (price) this.toggleModal('subscribe', true);
        else this.toggleModal('success', true);
      });
    } catch (err) {
      console.log('err', err.toString());

      this.setState({error_msg: err.toString(), confirming: false});
      this.toggleModal('error', true);
    }
  };
  createSubscription = (price, pkgName, uid) => {
    const {customer_id} = this.state;
    return new Promise(async (resolve, reject) => {
      let amount = 100 * price;
      //create plan
      let plan_data = await createPlan(amount, pkgName);
      let plan_id = plan_data.data.id;
      //create subscription
      let subscription_data = await createSubscription(customer_id, plan_id);
      let subscription_id = subscription_data.data.id;
      resolve(subscription_id);
    });
  };
  confirmPay = () => {
    const {price, pkgName} = this.state;
    let _this = this;
    const {uid} = this.props;
    this.setState({subscribing: true});
    this.createSubscription(price, pkgName, uid)
      .then(res => {
        console.log('Subscription is created!', res);
        let temp = [];
        Firebase.getUserDatafromUID(uid).then(res => {
          let profile = res;
          if (profile.packages) temp = profile.packages;
          temp.push({caption: pkgName, price: price});
          profile.packages = temp;
          profile.active = true;
          Firebase.updateUserData(uid, profile).then(result => {
            console.log('profile is updated!');
            this.props.dispatch(saveOnboarding(profile));
            AsyncStorage.setItem('profile', JSON.stringify(profile));
            _this.setState({subscribing: false});
            _this.toggleModal('subscribe', false);
            _this.navigateTo('Profile', {page: 'Subscriptions'});
          });
        });
      })
      .catch(err => {
        this.setState({error_msg: err});
        console.log('Error', err);
      });
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
    if (type === 'subscribe') this.setState({subscribe: visible});
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
    this.props.navigation.goBack();
  };
  onReplay = () => {
    this.toggleModal('error', false);
    this.setState({webview: true});
  };
  render() {
    const {price, confirming, webview, error_msg, subscribing} = this.state;
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
            flex: 1,
            marginTop: 100,
            width: '100%',
          }}>
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {confirming && (
                <ActivityIndicator size="large" color={colors.darkblue} />
              )}
              <Text>
                {confirming
                  ? `Registering your card...`
                  : `Thank you. I have successfully registered your card.
                  Subscribing and quick buying is unlocked.`}
              </Text>
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
                  Thank you. I have successfully registered your card.
                  Subscribing and quick buying is unlocked.
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
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.state.subscribe}
            onRequestClose={() => {}}>
            <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => this.toggleModal('subscribe', false)}>
                <View style={{flex: 1}} />
              </TouchableOpacity>
              <View style={styles.modal}>
                <Image source={ballon_image} style={{width: 80, height: 80}} />
                <Text style={{fontWeight: '700', marginBottom: 20}}>
                  Congratulations.
                </Text>
                <Text style={{textAlign: 'center'}}>
                  Thank you. I have successfully registered your card. Do you
                  want to subscribe to Membership package?
                </Text>
                <Text style={{textAlign: 'center'}}>£{price} / pcm</Text>
                <View
                  style={{
                    marginTop: 20,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  {subscribing && (
                    <ActivityIndicator size="large" color={colors.darkblue} />
                  )}
                  {!subscribing && (
                    <TouchableOpacity
                      onPress={this.confirmPay}
                      style={{
                        backgroundColor: colors.yellow,
                        width: 100,
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        borderColor: colors.grey,
                        borderWidth: 1,
                      }}>
                      <Text style={styles.text}>Subscribe</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={this.onExplore}
                    style={{
                      backgroundColor: colors.grey,
                      width: 100,
                      height: 30,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: colors.grey,
                      borderWidth: 1,
                    }}>
                    <Text style={styles.text}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textWrapper: {
    margin: 10,
  },
  infoText: {
    fontSize: 18,
    fontFamily: 'Gothic A1',
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    marginBottom: 0,
    fontFamily: 'Gothic A1',
    textAlign: 'center',
    color: colors.darkblue,
  },
  cardFormWrapper: {
    padding: 10,
    margin: 10,
  },
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    backgroundColor: colors.white,
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
    uid: state.uid,
    basic: state.basic,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentSetup);
