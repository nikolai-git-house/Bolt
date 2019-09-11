import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import Logo from "../../../components/Logo";
import TopImage from "../../../components/TopImage";
import colors from "../../../theme/Colors";
import Switcher from "./components/Switcher";
import Membership_Toggle from "./Membership_Toggle";
import BoltOns_Toggle from "./BoltOns_Toggle";
import Main from "../Main";
class Landing_Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "membership"
    };
  }
  onTap = screen => {
    console.log(screen);
    this.setState({ screen: screen });
  };
  componentDidMount = () => {
    this.load();
    this.props.navigation.addListener("willFocus", this.load);
  };
  load = () => {
    const { navigation } = this.props;
    if (navigation.state.params) {
      console.log("navigation", navigation);
      const { page } = navigation.state.params;
      console.log("page", page);
      this.setState({ screen: page });
    }
  };
  setScreen = screen => {
    const { uid } = this.props;
    switch (screen) {
      case "membership":
        return <Membership_Toggle {...this.props} />;
        break;
      case "bolt-ons":
        return <BoltOns_Toggle {...this.props} />;
        break;
      default:
        return <Membership_Toggle />;
    }
  };
  choose = screen => {
    console.log("screen", screen);
    this.setState({ screen });
  };
  render() {
    const { screen } = this.state;
    return (
      // <KeyboardAwareScrollView style={{ width: Metrics.screenWidth }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: colors.lightgrey
        }}
      >
        <TopImage />
        <Logo />
        <View
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            marginTop: 80,
            width: "100%"
          }}
        >
          <Switcher onChoose={this.choose} screen={screen} />
          {this.setScreen(screen)}
        </View>
      </View>
      // </KeyboardAwareScrollView>
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
    basic: state.basic,
    uid: state.uid
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing_Toggle);

// export default StackNavigator;
