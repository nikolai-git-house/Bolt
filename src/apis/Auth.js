export const doSMS = async (phoneNumber, pin) => {
  try {
    let response = await fetch(
      `https://inchworm-angelfish-9768.twil.io/sendSMS?phoneNumber=${phoneNumber}&pin=${pin}`,
      {
        method: "GET"
      }
    );
    let res = await response.json();
    return res;
  } catch (err) {
    return err;
  }
};
export const getToken = async (
  grant_type,
  client_id,
  client_secret,
  username,
  password
) => {
  try {
    console.log("grant_type", grant_type);
    console.log("client_id", client_id);
    console.log("client_secret", client_secret);
    console.log("username", username);
    console.log("password", password);
    let res = await fetch(
      `https://test.salesforce.com/services/oauth2/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&username=${username}&password=${password}`,
      {
        method: "post"
      }
    );
    let json = await res.json();
    console.log(json);
    return json;
  } catch (err) {
    return err;
  }
};
export const signUp = async (
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
) => {
  try {
    let token = "Bearer " + access_token;
    let streetName = street + " " + number;
    const body = JSON.stringify({
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: password,
      phone: phone,
      dob: dob,
      avatar: avatar
    });
    console.log("body", body);
    return fetch(
      "https://pin--dev.my.salesforce.com/services/apexrest/v2/CreateUser",
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: body
      }
    ).then(res => {
      //console.log("res", res._bodyInit);
      return res._bodyInit;
    });

    //let json = await res.json();
    // return json;
  } catch (err) {
    console.log("error_api", error);
    //console.log("error", err);
    return err;
  }
};
export const logIn = async (
  response_type,
  client_id,
  redirect_uri,
  scope,
  display
) => {
  try {
    console.log("response_type", response_type);
    console.log("client_id", client_id);
    console.log("redirect_uri", redirect_uri);
    console.log("scope", scope);
    console.log("display", display);
    return fetch(
      `https://dev-pin.cs106.force.com/members/services/oauth2/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&display=${display}`,
      {
        method: "get"
      }
    );
  } catch (err) {
    return err;
  }
};
