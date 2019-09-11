import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { itemWidth } from "../../../theme/Styles";
import colors from "../../../theme/Colors";
class SwitchButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "communitymates"
    };
  }
  componentDidMount() {
    console.log("props", this.props);
  }
  Active = option => {
    const { onChooseGroup } = this.props;
    onChooseGroup(option);
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
              borderBottomColor:
                active === "communitymates" ? colors.brand : "grey"
            }
          ]}
          onPress={() => this.Active("communitymates")}
        >
          <Text
            style={[
              styles.header,
              active === "communitymates" ? styles.active : styles.inactive
            ]}
          >
            CommunityMates
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.headerWrapper,
            {
              borderBottomColor: active === "housemates" ? colors.brand : "grey"
            }
          ]}
          onPress={() => this.Active("housemates")}
        >
          <Text
            style={[
              styles.header,
              active === "housemates" ? styles.active : styles.inactive
            ]}
          >
            HouseMates
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
    fontSize: 17
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
