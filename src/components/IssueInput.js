import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { Dropdown } from "react-native-material-dropdown";
import Firebase from "../firebasehelper";
import colors from "../theme/Colors";

export default class IssueInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      rooms: props.rooms,
      adjectives: [],
      query: "",
      room_value: "",
      adjective: ""
    };
  }
  Open = () => {
    const { onOpen } = this.props;
    onOpen();
  };
  Close = () => {
    const { onClose } = this.props;
    onClose();
  };
  SendMessage = () => {
    const { query, room_value, adjective } = this.state;
    console.log(query, room_value, adjective);
    const { onSend } = this.props;
    onSend(query, room_value, adjective);
  };
  findData(query, type) {
    const { items, adjectives } = this.state;
    console.log("items", items);
    console.log("adjectives", adjectives);

    let queried_arr = [];
    if (query === "") {
      return [];
    }
    if (type === "item") {
      items.forEach(item => {
        if (item === query) return [];
        if (item.includes(query)) queried_arr.push(item);
      });
    } else {
      adjectives.forEach(item => {
        if (item === query) return [];
        if (item.includes(query)) queried_arr.push(item);
      });
    }
    return queried_arr;
  }
  onClickedItem = (item, type) => {
    if (type === "item") {
      this.setState({ query: item });
      Firebase.getRoomByItem(item, (res, adjectives) => {
        if (res) {
          this.setState({ room_value: res[0] });
        } else this.setState({ room_value: "" });
        let adjective_arr = Object.values(adjectives);
        adjective_arr = adjective_arr.map(i => i.value);
        this.setState({ adjectives: adjective_arr });
      });
    } else {
      console.log("adjective", item);
      this.setState({ adjective: item });
    }
  };
  onChangeRoom = value => {
    this.setState({ room_value: value });
  };
  onChangeAdjective = value => {
    this.setState({ adjective: value });
  };
  render() {
    const {
      item,
      room,
      adjective,
      items,
      rooms,
      adjectives,
      room_value
    } = this.state;
    const { onClose, onOpen } = this.props;

    const { query } = this.state;
    const data = this.findData(query, "item");
    const adjective_data = this.findData(adjective, "adjective");
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 25
        }}
        onPress={onOpen}
      >
        <View
          style={{
            width: 280,
            display: "flex",
            flexDirection: "column",
            paddingLeft: "5%",
            paddingRight: "5%",
            alignItems: "flex-start",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <Text
            style={{
              marginBottom: 10,
              marginTop: 10,
              fontSize: 16
            }}
          >
            The
          </Text>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={[styles.autocompleteContainer, { zIndex: 1000 }]}
            inputContainerStyle={styles.input}
            listContainerStyle={styles.result}
            data={data}
            defaultValue={query}
            onChangeText={text => this.setState({ query: text })}
            placeholder="Item to be repaired"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => this.onClickedItem(item, "item")}
              >
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <Text
            style={{
              marginTop: 30,
              fontSize: 16,
              marginBottom: -10
            }}
          >
            in the
          </Text>
          <Dropdown
            label="Room"
            data={rooms}
            containerStyle={{ width: "100%", marginTop: 0 }}
            value={room_value}
            onChangeText={value => this.onChangeRoom(value)}
          />
          <Text
            style={{
              marginTop: 30,
              fontSize: 16,
              marginBottom: 10
            }}
          >
            is
          </Text>

          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.autocompleteContainer}
            inputContainerStyle={styles.input}
            listContainerStyle={styles.result}
            data={adjective_data}
            defaultValue={adjective}
            onChangeText={text => this.setState({ adjective: text })}
            placeholder="Description of issue"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => this.onClickedItem(item, "adjective")}
              >
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.CalltoAction}
            onPress={this.SendMessage}
          >
            <Text style={styles.Go}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: colors.white,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3
  },
  CalltoAction: {
    opacity: 0.8,
    backgroundColor: colors.yellow,
    borderRadius: 30,
    marginTop: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3
  },
  Go: {
    color: colors.darkblue,
    fontSize: 16,
    fontFamily: "Graphik",
    fontWeight: "600",
    paddingTop: 17,
    paddingBottom: 17,
    paddingLeft: 22,
    paddingRight: 22
  },
  container: {
    backgroundColor: "#F5FCFF",
    flex: 1,
    padding: 16,
    marginTop: 40
  },
  autocompleteContainer: {
    width: "100%",
    backgroundColor: colors.white,
    borderWidth: 0
  },
  result: {
    borderColor: colors.white
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2
  },
  infoText: {
    textAlign: "center",
    fontSize: 16
  }
});
