import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";
import UserItem from "./component/UserItem";
import SwitchButton from "./component/SwitchButton";
import Metrics from "../../theme/Metrics";
import colors from "../../theme/Colors";
import Firebase from "../../firebasehelper";
import {
  removeItemfromArray,
  removeItemfromArrayByKey
} from "../../utils/functions";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.users,
      housemates: [],
      uid: props.uid,
      group: "communitymates"
    };
  }

  componentDidMount() {
    const { uid } = this.state;
    this.setState({ users: this.props.users });
    this.findResult();
    console.log("uid", uid);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ users: nextProps.users });
    this.findResult();
  }
  findResult = () => {
    const { users, uid } = this.state;
    console.log("users", users);
    users.forEach(item => {
      console.log("item.id", item.id);
      if (item.id === uid) users.pop(item);
    });
    this.setState({ users });
    // let index = 0;
    // result.forEach((item, index) => {
    //   if (Object.keys(item)[0] === uid) result.pop(item);
    // });
    // let allusers = removeItemfromArrayByKey(result, uid);
    // console.log("allusers", allusers);
    // this.setState({ users: allusers });
    // Firebase.findFriends(uid).then(res => {
    //   console.log("member", res);
    //   let friends = removeItemfromArray(res, uid);
    //   console.log("friends", friends);
    //   if (friends) {
    //     let promises = friends.map(item => {
    //       return Firebase.getUserDatafromUID(item).then(res => {
    //         const username = res.firstname + " " + res.lastname;
    //         return {
    //           username: username,
    //           img: res.avatar_url
    //         };
    //       });
    //     });
    //     Promise.all(promises).then(res => {
    //       console.log("housemates", res);
    //       this.setState({ housemates: res });
    //     });
    //   }
    // });
  };
  renderCommunitymateItem = ({ item }) => {
    return (
      <UserItem
        avatar={item.avatar_url}
        username={item.firstname + " " + item.lastname}
        onPressChat={() => this.onPressChat(item.id)}
      />
    );
  };
  renderHousemateItem = ({ item }) => {
    return <UserItem avatar={item.img} username={item.username} />;
  };
  chooseGroup = group => {
    console.log("group", group);
    this.setState({ group });
  };
  onPressChat = item => {
    console.log("item", item);
  };
  render() {
    const { users, housemates, group } = this.state;
    return (
      <View
        style={{
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <SwitchButton onChooseGroup={this.chooseGroup} />
        {group === "communitymates" && (
          <FlatList
            data={users}
            renderItem={this.renderCommunitymateItem}
            style={{
              width: "100%"
            }}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 10
            }}
          />
        )}
        {group === "housemates" && (
          <FlatList
            data={housemates}
            renderItem={this.renderHousemateItem}
            style={{
              width: "100%"
            }}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 10
            }}
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    backgroundColor: colors.white
  },
  content: {
    display: "flex",
    flexDirection: "column",
    padding: 5,
    margin: 5
  },
  view: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 40,
    overflow: "hidden"
  }
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    users: state.users,
    basic: state.basic,
    uid: state.uid
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
