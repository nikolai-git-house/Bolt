import React from "react";
import { View, FlatList } from "react-native";
import IconMenu from "./IconMenu";
import colors from "../../../theme/Colors";
const SLIDER_1_FIRST_ITEM = 0;

const community_img = require("../../../assets/profile_header/health.png");
const feed_img = require("../../../assets/profile_header/subscription.png");
const message_img = require("../../../assets/profile_header/groups.png");

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: SLIDER_1_FIRST_ITEM,
      packages: [
        { title: "Feeds", img: feed_img, index: 0, clicked: true },
        { title: "Friends", img: community_img, index: 1 }
      ]
    };
    console.log("props", props);
  }
  _renderItem = ({ item, index }) => {
    return <IconMenu data={item} key={index} PressItem={this.Press} />;
  };
  Press = data => {
    const { onTap } = this.props;
    let { packages } = this.state;
    console.log("index", data.index);
    packages.forEach(item => {
      item.clicked = false;
    });
    packages[data.index].clicked = true;
    this.setState({ packages });
    onTap(data.title);
  };

  render() {
    const { packages } = this.state;
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: 100,
          position: "absolute",
          top: 60,
          left: 0
        }}
      >
        <FlatList
          contentContainerStyle={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%"
          }}
          data={packages}
          renderItem={this._renderItem}
          horizontal={true}
        />
      </View>
    );
  }
}
