import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
const home = require("../../../assets/myhome/home.png");
const renting = require("../../../assets/myhome/renting.png");
class SwitchButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "home"
    };
  }
  componentDidMount() {
    console.log("props", this.props);
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
          justifyContent: "center",
          marginBottom: 20
        }}
      >
        <TouchableOpacity
          style={[styles.button, active === "home" ? styles.active : {}]}
          onPress={() => this.Active("home")}
        >
          <Image
            source={home}
            style={{ width: 30, height: 28, marginRight: 5 }}
          />
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, active === "renting" ? styles.active : {}]}
          onPress={() => this.Active("renting")}
        >
          <Image
            source={renting}
            style={{ width: 30, height: 31.5, marginRight: 5 }}
          />
          <Text>Renting</Text>
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
export default SwitchButton;
