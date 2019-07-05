import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import colors from "../../../theme/Colors";
import { connect } from "react-redux";
import Subscription from "../../../components/Subscription";
import Firebase from "../../../firebasehelper";

class SubscriptionProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pkgs: []
    };
  }
  componentDidMount() {
    console.log("basic in Subscriptions", this.props.basic);
    if (this.props.basic.packages) {
      let promises = this.props.basic.packages.map(item => {
        return Firebase.getPackageInfo(item).then(res => {
          return res;
        });
      });
      Promise.all(promises).then(res => {
        console.log("pkgs", res);
        this.setState({ pkgs: res });
      });
    } else {
      console.log("Empty Package");
    }
  }
  navigateTo = page => {
    this.props.navigation.navigate(page);
  };
  componentWillReceiveProps(nextProps) {
    console.log("basic in Subscriptions", nextProps.basic);
    if (nextProps.basic.packages) {
      let promises = nextProps.basic.packages.map(item => {
        return Firebase.getPackageInfo(item).then(res => {
          return res;
        });
      });
      Promise.all(promises).then(res => {
        console.log("pkgs", res);
        this.setState({ pkgs: res });
      });
    } else {
      console.log("Empty Package");
    }
  }
  render() {
    const { pkgs } = this.state;
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          backgroundColor: colors.white
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Quicksand",
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 20
          }}
        >
          My Subscriptions.
        </Text>
        <Text style={{ textAlign: "center", marginBottom: 50 }}>
          All subscriptions are debited on the 1st day of each month.
        </Text>
        <ScrollView>
          {pkgs.map((item, index) => {
            return (
              <Subscription
                price={item.price}
                pkgName={item.caption}
                key={index}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.grey,
    borderRadius: 5,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2 // Android,
  },
  buttonClk: {
    width: 100,
    height: 100,
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.grey,
    borderRadius: 5,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 8, width: 8 }, // IOS
    shadowOpacity: 0.4, // IOS
    shadowRadius: 0.2, //IOS
    elevation: 2 // Android,
  },
  Title: {
    fontSize: 20,
    fontFamily: "Quicksand",
    color: colors.darkblue,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20
  },
  CallAction: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    height: 40,
    borderRadius: 5,
    backgroundColor: colors.darkblue
  },
  modal: {
    position: "absolute",
    left: "10%",
    top: "20%",
    width: "80%",
    height: "35%",
    justifyContent: "space-around",
    alignItems: "center",
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.lightgrey,
    padding: 20
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 40,
    overflow: "hidden"
  },
  Section: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  Icon: {
    padding: 10
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.darkblue,
    width: "100%",
    paddingLeft: 10,
    marginBottom: 20
  },
  tabStyle: {
    backgroundColor: "#f0eff5"
  },
  activeTabTextStyle: {
    color: "#fff"
  }
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    basic: state.basic
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionProfile);
