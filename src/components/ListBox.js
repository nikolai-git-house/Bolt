import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  Image,
  Keyboard
} from "react-native";

import { Dropdown } from "react-native-material-dropdown";
import colors from "../theme/Colors";
import InputBox from "./InputBox";

export default class ListBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drop_height: new Animated.Value(0),
      text: "E.g xxxx"
    };
  }

  DropIn = () => {
    this.state.drop_height.setValue(0);
    Animated.timing(this.state.drop_height, {
      toValue: 140,
      duration: 0
    }).start(() => {
      this.props.onClick();
    });
  };

  DropOut = () => {
    this.state.drop_height.setValue(140);
    Animated.timing(this.state.drop_height, {
      toValue: 0,
      duration: 0
    }).start(() => {});
  };
  _renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ paddingLeft: 20, marginBottom: 5 }}
      onPress={() => this.onSelectItem(item)}
    >
      <Text style={{ color: colors.white, fontSize: 18 }}>{item}</Text>
    </TouchableOpacity>
  );
  onSelectItem = item => {
    console.log("selected", item);
    this.setState({ text: item });
    this.DropOut();
  };
  render() {
    const { label } = this.props;
    const { imgsrc } = this.props;
    const { onChange } = this.props;
    const { placeholder } = this.props;

    const { data } = this.props;
    const { drop_height } = this.state;
    return (
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1
          }}
        >
          <Text
            style={{
              width: 280,
              marginBottom: 10,
              textAlign: "center"
            }}
          >
            {label}
          </Text>
          <View
            style={{
              width: 280,
              height: 40,
              display: "flex",
              flexDirection: "row",
              paddingLeft: "5%",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.cardborder,
              backgroundColor: colors.white,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center"
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                borderWidth: 1,
                borderColor: colors.cardborder,
                backgroundColor: colors.darkblue,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image style={{ width: 30, height: 30 }} source={imgsrc} />
            </View>

            <TouchableOpacity
              style={{
                width: 280,
                height: 40,
                marginLeft: -30,
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={this.DropIn}
            >
              <Text style={{ fontSize: 20 }}>{this.state.text}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Animated.View
          style={{
            width: 280,
            height: drop_height,
            zIndex: 0,
            paddingTop: 40,
            marginTop: -40,
            marginBottom: 40,
            borderRadius: 20,
            backgroundColor: colors.darkblue
          }}
        >
          <ScrollView
            style={{
              width: "100%"
            }}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <FlatList
              style={{ width: "100%" }}
              data={data}
              renderItem={this._renderItem}
            />
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}
