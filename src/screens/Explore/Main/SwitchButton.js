import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { itemWidth } from "../../../theme/Styles";
import colors from "../../../theme/Colors";
class SwitchButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "subscriptions"
    };
  }
  componentDidMount() {
    console.log("props", this.props);
  }
  Active = option => {
    const { onChoosePay } = this.props;
    onChoosePay(option);
    this.setState({ active: option });
  };
  render() {
    const { active } = this.state;
    return (
      <View
        style={{
          width: itemWidth,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <TouchableOpacity
          style={[
            styles.headerWrapper,
            {
              borderBottomColor: active === "subscriptions" ? "black" : "grey"
            }
          ]}
          onPress={() => this.Active("subscriptions")}
        >
          <Text
            style={[
              styles.header,
              active === "subscriptions" ? styles.active : styles.inactive
            ]}
          >
            Subscriptions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.headerWrapper,
            {
              borderBottomColor: active === "quick_buys" ? "black" : "grey"
            }
          ]}
          onPress={() => this.Active("quick_buys")}
        >
          <Text
            style={[
              styles.header,
              active === "quick_buys" ? styles.active : styles.inactive
            ]}
          >
            Quick buys
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: "48%",
    textAlign: "center",
    borderBottomWidth: 5,
    marginBottom: 10
  },
  header: {
    textAlign: "center",
    fontSize: 20
  },
  active: {
    color: "black",
    fontWeight: "500"
  },
  inactive: {
    color: "grey"
  }
});
export default SwitchButton;
