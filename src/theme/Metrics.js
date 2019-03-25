import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
const bottomMargin = 24;
const sHeight = width < height ? height : width;
const sWidth = width < height ? width : height;
const dMargin = 10;
const metrics = {
  screenWidth: sWidth,
  screenHeight: sHeight
};

export default metrics;
