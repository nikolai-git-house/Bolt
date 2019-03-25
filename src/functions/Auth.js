import {
  grant_type,
  client_id,
  client_secret,
  username,
  SFpassword
} from "../utils/Constants";
import { getToken, signUp, logIn } from "../apis/Auth";
export const register = async profile => {
  try {
    console.log("profile", profile);
    const {
      firstname,
      lastname,
      email,
      password,
      postcode,
      number,
      street,
      city,
      phone,
      dob,
      avatar
    } = profile;
    let response = await getToken(
      grant_type,
      client_id,
      client_secret,
      username,
      SFpassword
    );
    let access_token = response.access_token;
    console.log("access_token", access_token);
    return signUp(
      firstname,
      lastname,
      email,
      password,
      postcode,
      number,
      street,
      city,
      phone,
      dob,
      avatar,
      access_token
    );
  } catch (err) {
    console.log("error_function", err);
    return err;
  }
};
