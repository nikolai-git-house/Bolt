import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  FlatList,
  Animated,
  Modal,
  Linking,
  Alert
} from "react-native";
import colors from "../theme/Colors";
const home_emergency_img = require("../assets/choice/newicons/0_home_emergencies.png");
const flood_water_img = require("../assets/choice/newicons/0.1_water_flood.png");
const fire_img = require("../assets/choice/newicons/0.2_fire.png");
const gas_leak_img = require("../assets/choice/newicons/0.3_gas_leak.png");
const burglary_img = require("../assets/choice/newicons/0.4_burglary.png");
const home_repair_img = require("../assets/choice/newicons/1_home_repair.png");
const subscription_packages_img = require("../assets/choice/newicons/15_subscription_packages.png");
const my_subscriptions_img = require("../assets/choice/newicons/16_my_subscriptions.png");
const wellness_img = require("../assets/choice/newicons/17_wellness.png");
const health_img = require("../assets/choice/newicons/18_health.png");
const home_utilities_img = require("../assets/choice/newicons/19_home_utilities.png");
const token_cashback_img = require("../assets/choice/newicons/20_token_cashback.png");
const travel_img = require("../assets/choice/newicons/21_travel_bookings.png");
const dining_drinking_img = require("../assets/choice/newicons/22_dining_drinking.png");
const arts_culture_img = require("../assets/choice/newicons/23_arts_cultures.png");
const entertainment_img = require("../assets/choice/newicons/24_entertainment.png");
const beauty_treatments_img = require("../assets/choice/newicons/25_beauty_treatments.png");
const groceries_shopping_img = require("../assets/choice/newicons/26_groceries_shopping.png");
const fashion_shopping_img = require("../assets/choice/newicons/27_fashion_shopping.png");
const pets_img = require("../assets/choice/newicons/28_pets.png");
const bike_scooter_img = require("../assets/choice/newicons/29_bike_scooter.png");
const talk_img = require("../assets/choice/newicons/30_talk_to_a_human.png");
const app_bug_img = require("../assets/choice/newicons/31_app_bugs.png");

class Choice extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.state = {
      dataSource: [
        { id: 0, title: "Home Emergency", src: home_emergency_img },
        { id: 1, title: "Home Repairs", src: home_repair_img },
        {
          id: 15,
          title: "Subscription Packages",
          src: subscription_packages_img
        },
        { id: 16, title: "My Subscriptions", src: my_subscriptions_img },
        { id: 17, title: "My Wellness", src: wellness_img },
        { id: 18, title: "Health", src: health_img },
        { id: 19, title: "Home Utilities", src: home_utilities_img },
        { id: 20, title: "Tokens & Cashback", src: token_cashback_img },
        { id: 21, title: "Travel Bookings", src: travel_img },
        { id: 22, title: "Dining & Drinking", src: dining_drinking_img },
        { id: 23, title: "Arts & Culture", src: arts_culture_img },
        { id: 24, title: "Entertainment", src: entertainment_img },
        { id: 25, title: "Beauty Treatments", src: beauty_treatments_img },
        { id: 26, title: "Groceries Shopping", src: groceries_shopping_img },
        { id: 27, title: "Fashion Shopping", src: fashion_shopping_img },
        { id: 28, title: "Pets", src: pets_img },
        { id: 29, title: "Bike & Scooter", src: bike_scooter_img },
        { id: 30, title: "Talk to a human", src: talk_img },
        { id: 31, title: "App Bugs", src: app_bug_img }
      ],
      emergency_source: [
        { id: 0.1, title: "Flood Water", src: flood_water_img },
        { id: 0.2, title: "Fire", src: fire_img },
        { id: 0.3, title: "Gas Leak", src: gas_leak_img },
        { id: 0.4, title: "Burglary", src: burglary_img }
      ],
      emergency_visible: false
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
    if (choice.id) on_selectChoice(choice);
    else this.setState({ emergency_visible: true });
  };
  selectEmergency = choice => {
    this.setState({ emergency_visible: false });
    let phoneNumber;
    if (Platform.OS !== "android") {
      phoneNumber = `telprompt:7539997649`;
    } else {
      phoneNumber = `tel:7539997649`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert("Phone number is not available");
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };
  closeModal = () => {
    console.log("pressed");
    this.setState({ emergency_visible: false });
  };
  render() {
    const { emergency_visible } = this.state;
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

        <Modal
          animationType={"fade"}
          transparent={true}
          visible={emergency_visible}
          onRequestClose={() => this.closeModal()}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={styles.modal}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={this.closeModal}
              >
                <Text style={{ color: colors.white }}>X</Text>
              </TouchableOpacity>
              <FlatList
                data={this.state.emergency_source}
                renderItem={({ item, index }) => (
                  <Animated.View style={animatedStyle} key={index}>
                    <TouchableOpacity
                      onPress={() => this.selectEmergency(item)}
                    >
                      <View
                        style={{
                          width: 70,
                          height: 70,
                          margin: 5,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          backgroundColor: colors.white,
                          borderRadius: 10
                        }}
                      >
                        <Image
                          style={styles.imageThumbnail}
                          source={item.src}
                        />
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                )}
                //Setting the number of column
                numColumns={4}
                keyExtractor={(item, index) => index}
              />
            </View>
          </View>
        </Modal>
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
  },
  modal: {
    position: "absolute",
    top: "40%",
    width: "100%",
    height: "25%",
    justifyContent: "space-around",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 10
  }
});
