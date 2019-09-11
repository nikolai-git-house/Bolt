import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import Home from "./Home";
import Renting from "./Renting";
import Logo from "../../components/Logo";
import TopImage from "../../components/TopImage";
import colors from "../../theme/Colors";
import SwitchButton from "./component/SwitchButton";
class MyHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "Home"
    };
  }
  onTap = screen => {
    console.log(screen);
    this.setState({ screen: screen });
  };
  componentDidMount = () => {
    console.log("this.props in MyHome", this.props);
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
      case "home":
        return <Home {...this.props} />;
        break;
      case "renting":
        return <Renting {...this.props} />;
        break;
      default:
        return <Home {...this.props} />;
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
          backgroundColor: colors.white
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
          <SwitchButton onChoose={this.choose} />
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
)(MyHome);

// export default StackNavigator;
