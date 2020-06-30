import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
  AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../../theme/Colors';
import Logo from '../../../components/Logo';
import TopImage from '../../../components/TopImage';
import {Metrics} from '../../../theme';
import Firebase from '../../../firebasehelper';
import {createPlan, createSubscription} from '../../../apis/index';
import {saveOnboarding} from '../../../Redux/actions/index';

const error_img = require('../../../assets/popup/error.png');
const confirm_img = require('../../../assets/popup/balloon.png');
let url = '';
class Pack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isgroup: 0,
      price: 0,
      imgUrl: require('../../../assets/packages/Product_Icons/cycle.png'),
      imgName: '',
      pkgName: '',
      errorVisible: false,
      confirmVisible: false,
      successVisible: false,
      error_msg: '',
      confirm_msg: '',
      loadingdata: false,
      confirm_ttl: '',
      confirming: false,
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    const {isgroup, price, imgName, pkgName} = navigation.state.params;
    switch (imgName) {
      case 'Happy Cycling Pack.png':
        url = require('../../../assets/packages/Product_Icons/cycle.png');
        break;
      case 'Health & Fitness Pack.png':
        url = require('../../../assets/packages/Product_Icons/health.png');
        break;
      case 'Membership Pack.png':
        url = require('../../../assets/packages/Product_Icons/membership.png');
        break;
      case 'Pet Friendly Renting Pack.png':
        url = require('../../../assets/packages/Product_Icons/pet.png');
        break;
      case 'Serviced Home Pack.png':
        url = require('../../../assets/packages/Product_Icons/home.png');
        break;
      case 'Silver Renter Pack.png':
        url = require('../../../assets/packages/Product_Icons/renter.png');
        break;
      case 'Gold Renter Pack.png':
        url = require('../../../assets/packages/Product_Icons/gold.png');
        break;
    }
    this.setState({
      isgroup: isgroup,
      price: price,
      imgUrl: url,
      imgName: imgName,
      pkgName: pkgName,
    });
  }
  onSplitClicked = async () => {
    const {isgroup, price, confirm_msg} = this.state;
    const {uid, basic} = this.props;
    const groupId = basic.groupId;
    if (groupId) {
      this.setState({loadingdata: true});
      let isGroupLeader = await Firebase.isGroupLeader(uid, groupId);
      this.setState({loadingdata: false});
      console.log('Am I groupLeader', isGroupLeader);
      if (!isgroup) {
        this.setState({
          error_msg: `The package is not available to split between your group.\n Please select "Pay It".`,
        });
        this.toggleError(true);
      } else if (!isGroupLeader) {
        this.setState({
          error_msg: `You are not leader of this group. As per group package rule, only leader can press "Split It".`,
        });
        this.toggleError(true);
      } else {
        this.setState({imgUrl: require('../../../assets/popup/split.png')});
        this.setState({loadingdata: true});
        Firebase.findFriends(uid).then(res => {
          if (res.length !== 0) {
            console.log('friends', res);
            const count = res.length;
            const final_price = price / count;

            let usernames = res.map(item => {
              return new Promise((resolve, reject) => {
                Firebase.getUserDatafromUID(item)
                  .then(result => {
                    resolve({
                      firstname: result.firstname,
                      ispayable: result.customer_id ? true : false,
                    });
                  })
                  .catch(err => {
                    reject(err);
                  });
              });
            });
            Promise.all(usernames).then(result => {
              console.log('usernames', result);
              this.setState({loadingdata: false});
              let username_list = '';
              let ispayable = true;
              result.forEach(item => {
                username_list += `${item.firstname} - £${final_price}\n `;
              });
              this.setState({
                confirm_msg: `${username_list} \nOnce you confirm Ecosystem will:\n 1. Create your monthly subscription\n 2.Invite your group to subscribe`,
              });
              this.setState({
                confirm_ttl:
                  "You've chosen to split the package between your housemates.",
              });
            });
          } else {
            this.setState({
              confirm_msg: `You are not member of any group. You will pay your self.Are you sure to pay £${price} your self?`,
            });
          }
          this.toggleConfirm(true);
        });
      }
    } else {
      this.setState({
        error_msg: `Sorry. You are not a member of any group.`,
      });
      this.toggleError(true);
    }
  };
  onPayClicked = () => {
    const {uid} = this.props;
    this.setState({imgUrl: url});
    this.setState({
      confirm_msg: `Once you confirm, Ecosystem will create your monthly subscription,
    with payments taken on 1st of each month.\nYour concierge will assist you with anything help you need.\n`,
    });
    this.setState({
      confirm_ttl:
        "You've chosen to take this package yourself and pay it yourself.",
    });
    this.toggleConfirm(true);
    console.log('uid', uid);
  };
  createSubscription = (price, pkgName, uid) => {
    return new Promise((resolve, reject) => {
      Firebase.getUserDatafromUID(uid)
        .then(async res => {
          if (res.customer_id) {
            let amount = 100 * price;
            //create plan
            let plan_data = await createPlan(amount, pkgName);
            let plan_id = plan_data.data.id;
            //create subscription
            let subscription_data = await createSubscription(
              res.customer_id,
              plan_id,
            );
            let subscription_id = subscription_data.data.id;
            resolve(subscription_id);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  confirmPay = () => {
    this.toggleConfirm(false);
    const {price, pkgName, confirming} = this.state;
    const {uid, basic} = this.props;
    this.setState({confirming: true});
    this.createSubscription(price, pkgName, uid)
      .then(res => {
        console.log('Subscription is created!', res);
        let temp = [];
        Firebase.getUserDatafromUID(uid).then(res => {
          let profile = res;
          if (profile.packages) temp = profile.packages;
          temp.push({caption: pkgName, price: price});
          profile.packages = temp;
          Firebase.updateUserData(uid, profile).then(result => {
            console.log('profile is updated!');
            let new_basic = basic;
            new_basic['packages'] = temp;
            this.props.dispatch(saveOnboarding(new_basic));
            AsyncStorage.setItem('profile', JSON.stringify(new_basic));
            this.setState({confirming: false});
            this.toggleSuccess(true);
          });
        });
      })
      .catch(err => {
        this.setState({error_msg: err, confirming: false});
        this.toggleError(true);
        console.log('Error', err);
      });
  };
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  toggleError(visible) {
    this.setState({errorVisible: visible});
  }
  toggleConfirm(visible) {
    this.setState({confirmVisible: visible});
  }
  toggleSuccess(visible) {
    this.setState({successVisible: visible});
  }
  viewSubscription = () => {
    this.toggleSuccess(false);
    this.navigateTo('Profile', {page: 'Subscriptions'});
  };
  render() {
    const {
      isgroup,
      price,
      confirm_msg,
      confirm_ttl,
      loadingdata,
      imgUrl,
      error_msg,
      confirming,
    } = this.state;
    return (
      <View
        style={{
          width: '100%',
          height: Metrics.screenHeight,
          alignItems: 'center',
          backgroundColor: colors.lightgrey,
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 40,
            left: 10,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-start',
          }}
          onPress={() => this.props.navigation.goBack()}>
          <Image
            style={Styles.tabbutton}
            source={require('../../../assets/back.png')}
          />
        </TouchableOpacity>
        <TopImage />
        <Logo />
        <View
          style={{
            position: 'absolute',
            top: 90,
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: colors.lightgrey,
          }}>
          <View style={Styles.SplitContainer}>
            <Image
              source={require('../../../assets/Explore/pack/pizza.png')}
              style={{width: 40, height: 45}}
            />
            <Text style={[Styles.SubTitle, {color: colors.darkblue}]}>
              Pay between your friends.{'\n'} Each guest is able to pay over
              time or in full via their app.
            </Text>
            {loadingdata && (
              <ActivityIndicator size="large" color={colors.darkblue} />
            )}
            {!loadingdata && (
              <TouchableOpacity
                style={[Styles.CallAction, {backgroundColor: colors.yellow}]}
                onPress={this.onSplitClicked}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.darkblue,
                    fontWeight: '500',
                  }}>
                  Split It
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={Styles.PayContainer}>
            <Image
              source={require('../../../assets/Explore/pack/mug.png')}
              style={{width: 40, height: 45}}
            />
            <Text style={[Styles.SubTitle, {color: colors.darkblue}]}>
              £{price} a month bolted-on
              {'\n'}
              Pick up the full booking.{'\n'}
              You'll pay over time or in full,managing our entire booking.{'\n'}
            </Text>
            {confirming && (
              <ActivityIndicator size="large" color={colors.darkblue} />
            )}
            {!confirming && (
              <TouchableOpacity
                style={[Styles.CallAction, {backgroundColor: colors.grey}]}
                onPress={this.onPayClicked}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.darkblue,
                    fontWeight: '500',
                  }}>
                  Pay It
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
            <View style={Styles.modal}>
              <Image
                source={error_img}
                style={{
                  width: 80,
                  height: 80,
                }}
              />
              <Text style={{fontWeight: '700'}}>Error</Text>
              <Text style={{textAlign: 'center', marginBottom: 10}}>
                {error_msg}
              </Text>
              <TouchableOpacity
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
                  shadowColor: 'black',
                  shadowOffset: {width: 0, height: 0},
                  shadowOpacity: 0.2,
                  elevation: 3,
                }}>
                <Text style={Styles.text}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.confirmVisible}
          onRequestClose={() => {}}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={() => this.toggleConfirm(false)}>
              <View style={{flex: 1}} />
            </TouchableWithoutFeedback>
            <View style={Styles.modal}>
              <Image
                source={imgUrl}
                style={{
                  width: 80,
                  height: 80,
                }}
              />
              <Text
                style={{
                  fontWeight: '700',
                  marginBottom: 10,
                  fontSize: 15,
                  textAlign: 'center',
                }}>
                {confirm_ttl}
              </Text>
              {loadingdata && (
                <ActivityIndicator size="large" color={colors.darkblue} />
              )}
              {!loadingdata && (
                <Text style={{textAlign: 'center', marginBottom: 10}}>
                  {confirm_msg}
                </Text>
              )}
              <TouchableOpacity
                onPress={this.confirmPay}
                style={{
                  backgroundColor: colors.yellow,
                  width: 130,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: colors.grey,
                  borderWidth: 1,
                  shadowColor: 'black',
                  shadowOffset: {width: 0, height: 0},
                  shadowOpacity: 0.2,
                  elevation: 3,
                }}>
                <Text style={Styles.text}>Confirm purchase</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.successVisible}
          onRequestClose={() => {}}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={() => this.toggleSuccess(false)}>
              <View style={{flex: 1}} />
            </TouchableWithoutFeedback>
            <View style={Styles.modal}>
              <Image source={confirm_img} style={{width: 80, height: 80}} />
              <Text
                style={{
                  fontWeight: '700',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                Congratulations {'\n'} you've subscribed
              </Text>
              <Text style={{textAlign: 'center', marginBottom: 10}}>
                Our concierge team will be in touch to say hi and setup your
                package.
              </Text>
              <Text style={{textAlign: 'center', fontSize: 10}}>
                View your subscriptions profile for full info.
              </Text>
              <TouchableOpacity
                onPress={this.viewSubscription}
                style={{
                  marginTop: 20,
                  backgroundColor: colors.yellow,
                  width: 100,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: colors.grey,
                  borderWidth: 1,
                  shadowColor: 'black',
                  shadowOffset: {width: 0, height: 0},
                  shadowOpacity: 0.2,
                  elevation: 3,
                }}>
                <Text style={Styles.text}>Get started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  PayContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 220,
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
  SplitContainer: {
    backgroundColor: colors.grey,
    borderRadius: 10,
    height: 220,
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
  maincontainer: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 90,
    backgroundColor: colors.lightgrey,
  },
  modal: {
    position: 'absolute',
    left: '10%',
    top: '20%',
    width: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.lightgrey,
    padding: 10,
  },
  tabbutton: {
    width: 25,
    height: 25,
  },
  Title: {fontSize: 30, fontFamily: 'Gothic A1', fontWeight: '200'},
  SubTitle: {fontSize: 15, fontFamily: 'Gothic A1', textAlign: 'center'},
  CallAction: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 3,
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
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Pack);
