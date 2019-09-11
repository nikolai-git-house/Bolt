import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import { itemWidth } from "../../../../theme/Styles";
import colors from "../../../../theme/Colors";
const membership = require("../../../../assets/Explore/landing_toggle/membership.png");
const bolt_ons = require("../../../../assets/Explore/landing_toggle/bolt-ons.png");
class Switcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "membership"
    };
  }
  componentDidMount() {
    console.log("props", this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { screen } = nextProps;
    this.setState({ active: screen });
  }
  Active = option => {
    const { onChoose } = this.props;
    onChoose(option);
    this.setState({ active: option });
  };
  render() {
    const { active } = this.state;
    return (
      <View
        style={{
          width: "90%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <TouchableOpacity
          style={[styles.button, active === "membership" ? styles.active : {}]}
          onPress={() => this.Active("membership")}
        >
          <Image
            source={membership}
            style={{ width: 30, height: 21, marginRight: 5 }}
          />
          <Text>Membership</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, active === "bolt-ons" ? styles.active : {}]}
          onPress={() => this.Active("bolt-ons")}
        >
          <Image
            source={bolt_ons}
            style={{ width: 30, height: 17, marginRight: 5 }}
          />
          <Text>Bolt-Ons</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: "40%",
    height: 50,
    textAlign: "center",
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    margin: 1
  },
  header: {
    textAlign: "center",
    fontSize: 17
  },
  active: {
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 3
  },
  inactive: {
    color: "grey"
  }
});
export default Switcher;
