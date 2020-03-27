import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image} from 'react-native';
import {itemWidth} from '../../../../theme/Styles';
import colors from '../../../../theme/Colors';
class Switcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'shop',
    };
  }
  componentDidMount() {
    console.log('props', this.props);
  }
  componentWillReceiveProps(nextProps) {
    const {screen} = nextProps;
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
      <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={[styles.button, active === 'membership' ? styles.active : {}]}
          onPress={() => this.Active('membership')}>
          <Text style={active === 'membership' ? styles.activeText : {}}>
            Member
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, active === 'shop' ? styles.active : {}]}
          onPress={() => this.Active('shop')}>
          <Text style={active === 'shop' ? styles.activeText : {}}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, active === 'perks' ? styles.active : {}]}
          onPress={() => this.Active('perks')}>
          <Text style={active === 'perks' ? styles.activeText : {}}>Perks</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
