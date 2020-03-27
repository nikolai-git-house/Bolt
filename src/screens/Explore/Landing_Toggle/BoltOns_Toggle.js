import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {saveComingflag} from '../../../Redux/actions/index';
import colors from '../../../theme/Colors';
import Logo from '../../../components/Logo';
import TopImage from '../../../components/TopImage';
import {Metrics} from '../../../theme';
import PackCarousel from '../../../components/PackCarousel';
import Firebase from '../../../firebasehelper';
import SubscribeButton from '../Main/SubscribeButton';
const error_img = require('../../../assets/popup/error.png');
const ballon_image = require('../../../assets/popup/balloon.png');
const carousel_height =
  Metrics.screenHeight > 750 ? 500 : Metrics.screenHeight - 240;
const axios = require('axios');
let isgroup = 0;
let price = 0;
let imgName = '';
let pkgName = '';
class BoltOns_Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bolt_height: new Animated.Value(0),
      isgroup: 0,
      price: 0,
      renter_owner: props.basic.renter_owner === 'Renter' ? 1 : 2,
      error_Visible: false,
      error_payment_Visible: false,
      email_Visible: false,
      loadingdata: false,
      btn_able: false,
      error_msg: '',
      coming_flag: false,
      payoption: 'subscriptions',
    };
  }
  componentDidMount() {
    const {packages} = this.props.basic;
  }
  componentWillReceiveProps(nextProps) {
    const {packages} = nextProps.basic;
    console.log('packages', packages);
  }
  toggleError(error, visible) {
    if (error === 'error') this.setState({error_Visible: visible});
    if (error === 'payment') this.setState({error_payment_Visible: visible});
    if (error === 'email') this.setState({email_Visible: visible});
  }
  Bolt = () => {
    const {bolt_height} = this.state;
    if (bolt_height._value == 0)
      Animated.timing(
        // Animate over time
        this.state.bolt_height, // The animated value to drive
        {
          toValue: 350, // Animate to opacity: 1 (opaque)
          duration: 200, // Make it take a while
        },
      ).start();
    else
      Animated.timing(
        // Animate over time
        this.state.bolt_height, // The animated value to drive
        {
          toValue: 0, // Animate to opacity: 1 (opaque)
          duration: 200, // Make it take a while
        },
      ).start();
  };
  SendMail = (to, from, pkgname, message, sender_name) => {
    axios
      .post(
        'https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/sendEmail',
        {
          to: to,
          message: message,
          sender_name: sender_name,
          from: from,
          pkgname: pkgname,
        },
      )
      .then(result => {
        if (result.status === 200) {
          alert('Mail Submited.');
        }
      })
      .catch(err => {
        console.log('error', err);
      });
    console.log('message', message);
  };
  BoltOn = () => {
    this.setState({loadingdata: true});
    const {uid, basic} = this.props;
    const {coming_flag} = this.state;

    if (!coming_flag)
      Firebase.isPaymentReady(uid).then(async result => {
        this.setState({loadingdata: false});
        if (result) {
          let isPackageGot = await Firebase.isPackageGot(uid, pkgName);
          console.log('isPackageGot', isPackageGot);

          if (!isPackageGot)
            this.navigateTo('Pack', {
              price: price,
              isgroup: isgroup,
              imgName: imgName,
              pkgName: pkgName,
            });
          else {
            this.setState({
              error_msg:
                "You have already bought this package. You can't buy same package again.",
            });
            this.toggleError('error', true);
          }
        } else this.createStripe();
      });
    else {
      this.toggleError('email', true);
      this.setState({loadingdata: false});
      let packageName = pkgName;
      let sender_email = basic.email;
      console.log('basic', basic);
      let groupId = basic.groupId ? basic.groupId : 'No';
      let receiver_email = 'preregister@boltlabs.co.uk';
      this.SendMail(
        receiver_email,
        sender_email,
        packageName,
        `package/product: ${packageName}. Property/GroupID:${groupId} `,
        basic.firstname,
      );
    }

    //this.navigateTo("Pack", { price: price, isgroup: isgroup });
  };
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  updateButton = pkgName => {
    if (
      pkgName === 'Health & Fitness Pack' ||
      pkgName === 'Happy Cycling Pack'
    ) {
      this.props.dispatch(saveComingflag(true));
    } else this.props.dispatch(saveComingflag(false));
  };
  getCurrentSlider = (var1, var2, var3, var4) => {
    const {uid} = this.props;
    isgroup = var1;
    price = var2;
    imgName = var3;
    pkgName = var4;
    this.updateButton(pkgName);
  };
  createStripe = () => {
    this.navigateTo('PaymentSetup');
  };
  onChoosePay = option => {
    this.setState({payoption: option});
  };
  render() {
    const {renter_owner, loadingdata, error_msg, payoption} = this.state;
    let height = 200;
    switch (Platform.OS) {
      case 'ios':
        height = 300;
        break;
      case 'android':
        height = 200;
        break;
    }
    return (
      <View
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.lightgrey,
          marginTop: -10,
        }}>
        <View
          style={{
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: 20,
          }}>
          <View
            style={{
              width: '100%',
              paddingBottom: 10,
              height: carousel_height,
            }}>
            <PackCarousel
              getActive={async (isgroup, price, imgName, pkgName) => {
                this.getCurrentSlider(isgroup, price, imgName, pkgName);
              }}
              onLoad={() => console.log('loaded')}
              renter_owner={renter_owner}
              fromBoltOn={true}
            />
          </View>
          {loadingdata && (
            <ActivityIndicator size="large" color={colors.darkblue} />
          )}
          {!loadingdata && (
            <SubscribeButton BoltOn={this.BoltOn} payoption={payoption} />
          )}
        </View>

        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.error_Visible}
          onRequestClose={() => {}}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => this.toggleError('error', false)}>
              <View style={{flex: 1}} />
            </TouchableOpacity>
            <View style={styles.modal}>
              <Image source={error_img} style={{width: 80, height: 80}} />
              <Text style={{fontWeight: '700'}}>Error</Text>
              <Text style={{textAlign: 'center'}}>{error_msg}</Text>
              <TouchableOpacity
                onPress={() => {
                  this.toggleError('error', false);
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
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.email_Visible}
          onRequestClose={() => {}}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => this.toggleError('email', false)}>
              <View style={{flex: 1}} />
            </TouchableOpacity>
            <View style={styles.modal}>
              <Image source={ballon_image} style={{width: 80, height: 80}} />
              <Text style={{fontWeight: '700'}}>Congratulations.</Text>
              <Text style={{textAlign: 'center'}}>
                You'll be the first to know when this package is available.
                We'll also credit you 10 tokens to redeem on your subscription.
                Hang tight.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.toggleError('email', false);
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
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.error_payment_Visible}
          onRequestClose={() => {}}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => this.toggleError('payment', false)}>
              <View style={{flex: 1}} />
            </TouchableOpacity>
            <View style={styles.modal}>
              <Image source={error_img} style={{width: 80, height: 80}} />
              <Text style={{fontWeight: '700'}}>Error</Text>
              <Text style={{textAlign: 'center'}}>
                You didn't add your credit card info as payment setup. Do you
                want to add it? It only takes one minute to finish all.
              </Text>
              <TouchableOpacity
                onPress={this.createStripe}
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
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
export default connect(mapStateToProps, mapDispatchToProps)(BoltOns_Toggle);
