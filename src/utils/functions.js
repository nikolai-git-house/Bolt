import { AsyncStorage } from "react-native";
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
export function getCurrentTime() {
  var d = new Date();
  var h = addZero(d.getHours());
  var m = addZero(d.getMinutes());
  var time = h + ":" + m;
  return time;
}
export async function isSession() {
  try {
    const result = await AsyncStorage.getItem("profile");
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export function isEmailValidate(email) {
  if (email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    return true;
  else return false;
}
export function isPasswordValidate(pwd) {
  if (
    pwd &&
    /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/.test(
      pwd
    )
  )
    return true;
  else return false;
}
export function isDateValidate(date) {
  if (
    date &&
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
      date
    )
  )
    return true;
  else return false;
}
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export function isJsonOk(text) {
  if (
    /^[\],:{}\s]*$/.test(
      text
        .replace(/\\["\\\/bfnrtu]/g, "@")
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          "]"
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
    )
  ) {
    return true;
  } else {
    return false;
  }
}
export function hexToString(hex) {
  hex = hex.replace("%", "");
  var string = "";
  for (var i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return string;
}
function iscontain_Hex(str) {
  return str.search("%");
}
export function clearString(str) {
  while (iscontain_Hex(str) != -1) {
    var index = str.search("%");
    var hex = str.slice(index, index + 3);
    str = str.replace(hex, hexToString(hex));
  }
  return str;
}
export function getUserId(str) {
  let array = str.split("/");
  return array.pop();
}
