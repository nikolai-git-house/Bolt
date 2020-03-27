import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image} from 'react-native';
class Switcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'tokens',
    };
  }
  componentDidMount() {
    console.log('props', this.props);
  }
  componentWillReceiveProps(nextProps) {
    const {screen} = nextProps;
    console.log('screen in ReceiveProps', screen);
    this.setState({active: screen});
  }
  Active = option => {
    const {onChoose} = this.props;
    onChoose(option);
    this.setState({active: option});
  };
  render() {
    const {active} = this.state;
    return (
      <View style={styles.view}>
        <TouchableOpacity
          style={[styles.button, active === 'tokens' ? styles.active : {}]}
          onPress={() => this.Active('tokens')}>
          <Text style={active === 'tokens' ? styles.activeText : {}}>
            My Tokens
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, active === 'cards' ? styles.active : {}]}
          onPress={() => this.Active('cards')}>
          <Text style={active === 'cards' ? styles.activeText : {}}>
            My Cards
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    width: '35%',
    height: 40,
    textAlign: 'center',
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 1,
  },
  header: {
    textAlign: 'center',
    fontSize: 17,
  },
  activeText: {
    fontWeight: '600',
  },
  active: {
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.2,
    elevation: 3,
  },
  inactive: {
    color: 'grey',
  },
});
export default Switcher;
