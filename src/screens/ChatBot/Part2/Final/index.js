import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  ListView,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../../../theme/Colors';
import Logo from '../../../../components/Logo';
import ButtonBox from '../../../../components/ButtonBox';
import AddressBox from '../../../../components/AddressBox';
import ListBox from '../../../../components/ListBox';
import Caption from '../../../../components/Caption';
import InputBox from '../../../../components/InputBox';
import Populated from '../../../../components/Populated';
import {Metrics} from '../../../../theme';
import {address_status, country_names} from '../../../../utils/Constants.js';
export default class Final extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onAccept = this.onAccept.bind(this);
  }

  ScrollTo = offset => {
    console.log('offset', offset);
    this.refs.scrollView.scrollTo(offset);
  };
  onAccept = () => {
    console.log('accept');
    this.props.navigation.navigate('Main');
  };
  onDecline = () => {};
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 50,
        }}>
        <Logo />

        <ScrollView
          ref="scrollView"
          style={{
            width: '100%',
            height: '95%',
            marginTop: 20,
          }}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Caption content="Declaration that the information you have supplied is your own, true and accurate. I consent to this information being verified by contacting the third parties detailed in this form. I understand that the results of the findings will be forwarded to the appointed letting agent and/or landlord and may be accessed again should I default on my rental payment or apply for a new tenancy in the future. I agree that ECOSYSTEM or their approved agent may search the files of a credit referencing agency and IDS Limited, the insurance industry's data collection agency, which will keep a record of that search. I understand that I may request the name and address of the credit reference agency to whom I may then apply for a copy of the information provided. I also understand that in the event of me defaulting on the rental payment, that any default may be recorded with the credit reference agency and IDS Limited, who may supply the information to other credit companies or insurers in the quest for the responsible granting of tenancies, insurance and/or credit. I understand that in the event of any default by me in respect of my covenants in my tenancy agreement with my landlord, the information contained herein may be disclosed to ECOSYSTEM and/or one or more tracing companies and/or debt collection agencies in order to recover any monies due or to trace my whereabouts. The information provided in this form by me is information as described in Ground 17 of the Housing Act 1996 (Ground 6 Housing Act Scotland 2005)and I understand that if any information within this application is found to be untrue, it is grounds for termination of the tenancy. I also understand that any default in the payment of rent may affect any future applications for tenancies, insurance or credit. The details you provide will be held by ECOSYSTEM and the letting agent and may be used by us or passed to carefully selected third parties to keep you up to date on our products and services and other organisations we believe will be of interest to you." />
          <TouchableOpacity
            style={{
              backgroundColor: colors.yellow,
              width: 200,
              height: 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              marginBottom: 20,
            }}
            onPress={this.onAccept}>
            <Text>Accept & Complete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 200,
              height: 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: colors.cardborder,
              borderWidth: 1,
              borderRadius: 20,
            }}
            onPress={this.onDecline}>
            <Text style={{color: colors.grey}}>Decline</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
