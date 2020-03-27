import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import Fidel from 'fidel-react-native';
import colors from '../../theme/Colors';
import {Metrics} from '../../theme';
const logoImg = require('../../assets/wallet/card_linkage.png');
const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');
const resolvedImage = resolveAssetSource(logoImg);
const cardSchemes = new Set([
  Fidel.CardScheme.visa,
  Fidel.CardScheme.mastercard,
  Fidel.CardScheme.americanExpress,
]);
class MyCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    Fidel.setup({
      apiKey: 'pk_test_2aec8c1f-f4e9-4384-9f02-6644fb5b1a13',
      programId: '532b2a8a-9306-4be4-b317-ed42439701f8',
    });
    Fidel.setOptions({
      bannerImage: resolvedImage,
      country: Fidel.Country.unitedKingdom,
      supportedCardSchemes: Array.from(cardSchemes),
      autoScan: false,
      metaData: {'meta-data-1': 'value1'},
      companyData: 'BoltLab',
      privacyUrl: 'http://boltlabs.co.uk',
    });
    this.openFidel();
  };
  componentWillReceiveProps = nextProps => {
    this.setState({tokens: nextProps.basic.tokens});
  };
  openFidel = () => {
    const {onBack} = this.props;
    Fidel.openForm((error, result) => {
      if (error) {
        console.log('error', error);
        if (error.code === 'user-canceled') {
          onBack();
        }
      } else {
        console.info(result);
      }
    });
  };
  navigateTo = (page, props = {}) => {
    this.props.navigation.navigate(page, props);
  };
  render() {
    return (
      // <KeyboardAwareScrollView style={{ width: Metrics.screenWidth }}>
      <View style={styles.main_container}>
        <View style={styles.content_view}>
          <TouchableOpacity
            onPress={this.openFidel}
            style={[styles.Button, {backgroundColor: colors.lightgrey}]}>
            <Text>Add card</Text>
          </TouchableOpacity>
        </View>
      </View>
      // </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  content_view: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: Metrics.screenHeight > 750 ? 50 : 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    backgroundColor: colors.white,
    fontFamily: 'Gothic A1',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  token_img_container: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  token_number: {
    fontSize: 20,
    textAlign: 'center',
  },
  row_view: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  redeem_text: {
    textAlign: 'center',
    fontFamily: 'Gothic A1',
    fontSize: 18,
    fontWeight: '200',
    marginTop: 10,
    marginBottom: 10,
  },
  Button: {
    borderRadius: 20,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
  White_Button: {
    borderRadius: 10,
    padding: 10,
    width: 100,
    height: 60,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    shadowOffset: {height: 1, width: 1},
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  Font: {
    textAlign: 'center',
    fontFamily: 'Gothic A1',
    fontSize: 12,
  },
  Title: {
    fontSize: 20,
    fontFamily: 'Gothic A1',
    color: colors.darkblue,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
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
    padding: 20,
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
export default connect(mapStateToProps, mapDispatchToProps)(MyCards);

// export default StackNavigator;
