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
const token_img = require("../assets/choice/newicons/20_tokens.png");
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
const cashback_img = require("../assets/choice/newicons/35_cashback.png");
const healthy_eating_img = require("../assets/choice/newicons/36_healthy_eating.png");
const music_img = require("../assets/choice/newicons/37_music.png");
const my_card_img = require("../assets/choice/newicons/38_my_card.png");
const my_housemates_img = require("../assets/choice/newicons/39_my_housemates.png");
const my_trips_img = require("../assets/choice/newicons/40_my_trips.png");
const request_callback_img = require("../assets/choice/newicons/41_request_callback.png");
const speak_to_a_doctor_img = require("../assets/choice/newicons/42_speak_to_a_doctor.png");
const sport_img = require("../assets/choice/newicons/43_sport.png");
export function getChoiceImageByTicketId(ticket_id) {
  let ticket_str = ticket_id.toString();
  let ticket = ticket_str.split(".");
  let ticketID = ticket[0];
  console.log("ticketID", ticketID);
  switch (ticketID) {
    case "0":
      return home_emergency_img;
      break;
    case "1":
      return home_repair_img;
      break;
    case "2":
      return home_repair_img;
      break;
    case "3":
      return home_repair_img;
      break;
    case "4":
      return home_repair_img;
      break;
    case "5":
      return home_repair_img;
      break;
    case "6":
      return home_repair_img;
      break;
    case "7":
      return home_repair_img;
      break;
    case "8":
      return home_repair_img;
      break;
    case "9":
      return home_repair_img;
      break;
    case "10":
      return home_repair_img;
      break;
    case "11":
      return home_repair_img;
      break;
    case "12":
      return home_repair_img;
      break;
    case "13":
      return home_repair_img;
      break;
    case "14":
      return home_repair_img;
      break;
    case "15":
      return subscription_packages_img;
      break;
    case "16":
      return my_subscriptions_img;
      break;
    case "17":
      return wellness_img;
      break;
    case "18":
      return health_img;
      break;
    case "19":
      return home_utilities_img;
      break;
    case "20":
      return token_img;
      break;
    case "21":
      return travel_img;
      break;
    case "22":
      return dining_drinking_img;
      break;
    case "23":
      return arts_culture_img;
      break;
    case "24":
      return entertainment_img;
      break;
    case "25":
      return beauty_treatments_img;
      break;
    case "26":
      return groceries_shopping_img;
      break;
    case "27":
      return fashion_shopping_img;
      break;
    case "28":
      return pets_img;
      break;
    case "29":
      return bike_scooter_img;
      break;
    case "30":
      return talk_img;
      break;
    case "31":
      return app_bug_img;
      break;
    case "35":
      return cashback_img;
      break;
    case "36":
      return healthy_eating_img;
      break;
    case "37":
      return music_img;
      break;
    case "38":
      return my_card_img;
      break;
    case "39":
      return my_housemates_img;
      break;
    case "40":
      return my_trips_img;
      break;
    case "41":
      return request_callback_img;
      break;
    case "42":
      return speak_to_a_doctor_img;
      break;
    case "43":
      return sport_img;
      break;
  }
}
export const credit_members = [
  "+447539997649",
  "+447940119153",
  "+447849392982",
  "+447751637988",
  "+447825152007",
  "+447554035979",
  "+447754197910",
  "+447850740759",
  "+447473308537",
  "+447748764554"
];
