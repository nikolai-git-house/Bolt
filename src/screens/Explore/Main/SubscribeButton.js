import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { connect } from "react-redux";
import { sliderWidth, itemWidth } from "../../../theme/Styles";
import colors from "../../../theme/Colors";
class SubscribeButton extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(props) {
    console.log("props", props);
    const { coming_flag } = props;
    console.log("coming_flag", coming_flag);
  }
  componentDidMount() {
    console.log("props", this.props);
  }
  render() {
    const { coming_flag, BoltOn, payoption } = this.props;
    return (
      <TouchableOpacity
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          width: itemWidth,
          height: 45,
          borderRadius: 15,
          backgroundColor: coming_flag
            ? "#FFE366"
            : payoption === "subscriptions"
            ? colors.green
            : colors.brand,
          shadowOffset: { height: 1, width: 1 },
          shadowColor: colors.darkblue,
          shadowOpacity: 0.1,
          elevation: 3
        }}
        onPress={BoltOn}
      >
        <Text style={{ fontSize: 20 }}>
          {coming_flag
            ? "Pre register"
            : payoption === "subscriptions"
            ? "Subscribe"
            : "Buy It"}
        </Text>
      </TouchableOpacity>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    coming_flag: state.coming_flag
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribeButton);
