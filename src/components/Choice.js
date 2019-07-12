import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Animated
} from "react-native";
import colors from "../theme/Colors";
const home_repair_img = require("../assets/choice/newicons/1_home_repair.png");
const home_utilities_img = require("../assets/choice/newicons/15_home_utilities.png");
const my_subscriptions_img = require("../assets/choice/newicons/16_my_subscriptions.png");
const bolt_packages_img = require("../assets/choice/newicons/17_bolt_packages.png");
const token_cashback_img = require("../assets/choice/newicons/18_token_cashback.png");
const property_renting_img = require("../assets/choice/newicons/19_property_renting.png");
const dining_img = require("../assets/choice/newicons/20_dinining.png");
const drinking_img = require("../assets/choice/newicons/21_drinking.png");
const arts_culture_img = require("../assets/choice/newicons/22_arts_culture.png");
const entertainment_img = require("../assets/choice/newicons/23_entertainment.png");
const pets_img = require("../assets/choice/newicons/24_pets.png");
const travel_img = require("../assets/choice/newicons/25_travel.png");
const bike_img = require("../assets/choice/newicons/26_bike.png");
const health_img = require("../assets/choice/newicons/27_health.png");
const beauty_treatments_img = require("../assets/choice/newicons/28_beauty_treatments.png");
const groceries_shopping_img = require("../assets/choice/newicons/29_groceries_shopping.png");
const fashion_shopping_img = require("../assets/choice/newicons/30_fashion_shopping.png");
class Choice extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.state = {
      dataSource: [
        { id: 1, title: "Home Repairs", src: home_repair_img },
        { id: 15, title: "Packages & Products", src: bolt_packages_img },
        { id: 16, title: "My Subscriptions", src: my_subscriptions_img },
        { id: 18, title: "Health", src: health_img },
        { id: 19, title: "Home Utilities", src: home_utilities_img },
        { id: 20, title: "Tokens & Cashback", src: token_cashback_img },
        { id: 21, title: "Travel Booking", src: travel_img },
        { id: 23, title: "Arts & Culture", src: arts_culture_img },
        { id: 24, title: "Entertainment", src: entertainment_img },
        { id: 25, title: "Beauty Treatments", src: beauty_treatments_img },
        { id: 26, title: "Groceries Shopping", src: groceries_shopping_img },
        { id: 27, title: "Fashion Shopping", src: fashion_shopping_img },
        { id: 28, title: "Pets", src: pets_img },
        { id: 29, title: "Bike Or Scooter", src: bike_img }
      ]
    };
  }
  componentDidMount() {
    this.handleAnimation();
  }
  handleAnimation = () => {
    Animated.spring(this.animatedValue, {
      toValue: 1
    }).start();
  };
  selectChoice = choice => {
    const { on_selectChoice } = this.props;
    on_selectChoice(choice);
  };
  render() {
    const animatedStyle = { transform: [{ scale: this.animatedValue }] };
    return (
      <View style={styles.MainContainer}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item, index }) => (
            <Animated.View style={animatedStyle} key={index}>
              <TouchableOpacity onPress={() => this.selectChoice(item)}>
                <View
                  style={{
                    width: 90,
                    height: 90,
                    margin: 15,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    backgroundColor: colors.white,
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.2,
                    elevation: 3
                  }}
                >
                  <Image style={styles.imageThumbnail} source={item.src} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          //Setting the number of column
          numColumns={3}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}
export default Choice;
const styles = StyleSheet.create({
  MainContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    flex: 1,
    paddingTop: 30
  },
  imageThumbnail: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "contain"
  }
});
