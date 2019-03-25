import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  ListView,
  FlatList,
  TextInput,
  ScrollView
} from "react-native";
import colors from "../../../theme/Colors";
import Bubble from "../../../components/Bubble";
import { Metrics } from "../../../theme";
import Logo from "../../../components/Logo";
var myVar;
export default class ProfileSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: colors.lightgrey
        }}
      >
        <View style={{ flex: 1.5 }}>
          <Image
            source={require("../../../assets/cartoon.jpg")}
            style={{ width: "100%", height: "100%" }}
            opacity={0.5}
          />
        </View>
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "500" }}>
            Profile test part one complete
          </Text>
          <Text style={{ fontSize: 25, fontWeight: "100" }}>
            You've earned 10 tokens
          </Text>
          <TouchableOpacity
            style={{
              width: 280,
              height: 40,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              marginBottom: 20,
              backgroundColor: colors.yellow
            }}
            onPress={() => this.props.navigation.navigate("Personal")}
          >
            <Text>Click here to spend & explore</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 10,
            paddingBottom: 10
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: "100" }}>
            Profile set up
          </Text>
          <Text style={{ fontSize: 15 }}>
            User engagement and profile management
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              width: 250,
              height: 40,
              borderRadius: 20,
              borderWidth: 0.5,
              borderColor: colors.cardborder,
              backgroundColor: colors.darkblue
            }}
          >
            <Image
              source={require("../../../assets/success.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text
              style={{
                textAlign: "center",
                justifyContent: "center",
                marginLeft: 15,
                fontSize: 15,
                color: colors.white
              }}
            >
              profile completed
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 10,
            paddingBottom: 10
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: "100" }}>Test Part 2</Text>
          <Text style={{ fontSize: 15 }}>
            Pre-tenancy documentation & verify
          </Text>
          <TouchableOpacity
            style={{
              width: 250,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.yellow,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => this.props.navigation.navigate("Part2")}
          >
            <Text>Complete part two</Text>
          </TouchableOpacity>
          {/* <Text style={{ fontSize: 15 }}>
            Pre-tenancy documentation of member
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              width: 250,
              height: 40,
              borderRadius: 20,
              borderWidth: 0.5,
              borderColor: colors.cardborder,
              backgroundColor: colors.darkblue
            }}
          >
            <Image
              source={require("../../../assets/error.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text
              style={{
                textAlign: "center",
                justifyContent: "center",
                color: colors.white,
                marginLeft: 10,
                fontSize: 15
              }}
            >
              pending property offer
            </Text>
          </View> */}
        </View>
        <View style={{ flex: 0.5 }} />
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  logoContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20
  },
  sendButton: {
    color: colors.blue,
    marginLeft: -70
  }
});
