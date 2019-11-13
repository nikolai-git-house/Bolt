import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { Dropdown } from "react-native-material-dropdown";
import Firebase from "../firebasehelper";
import colors from "../theme/Colors";

export default class RestaurantInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cuisines: props.cuisines,
      locations: props.locations,
      cuisine: "",
      location: ""
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
    const { cuisine, location } = this.state;
    console.log(cuisine, location);
    const { onSend } = this.props;
    if (cuisine && location) onSend(cuisine, location);
  };
  findData(query, type) {
    const { cuisines, locations } = this.state;

    let queried_arr = [];
    if (query === "") {
      return [];
    }
    if (type === "cuisine") {
      cuisines.forEach(item => {
        if (item === query) return [];
        if (item.includes(query)) queried_arr.push(item);
      });
    } else {
      locations.forEach(item => {
        if (item === query) return [];
        if (item.includes(query)) queried_arr.push(item);
      });
    }
    return queried_arr;
  }
  onClickedItem = (item, type) => {
    if (type === "cuisine") {
      this.setState({ cuisine: item });
      Firebase.getLocationByCuisine(item, res => {
        this.setState({ locations: res });
      });
    } else {
      this.setState({ location: item });
    }
  };
  render() {
    const { cuisines, locations, cuisine, location } = this.state;
    const { onOpen } = this.props;
    const cuisine_data = this.findData(cuisine, "cuisine");
    const location_data = this.findData(location, "location");
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
            Cuisine
          </Text>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={[styles.autocompleteContainer, { zIndex: 1000 }]}
            inputContainerStyle={styles.input}
            listContainerStyle={styles.result}
            data={cuisine_data}
            defaultValue={cuisine}
            onChangeText={text => this.setState({ cuisine: text })}
            placeholder="???"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => this.onClickedItem(item, "cuisine")}
              >
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <Text
            style={{
              marginTop: 20,
              fontSize: 16,
              marginBottom: 10
            }}
          >
            Location
          </Text>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.autocompleteContainer}
            inputContainerStyle={styles.input}
            listContainerStyle={styles.result}
            data={location_data}
            defaultValue={location}
            onChangeText={text => this.setState({ location: text })}
            placeholder="Type finder of associated words"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => this.onClickedItem(item, "location")}
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
    fontFamily: "Gothic A1",
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
