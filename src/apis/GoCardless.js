const access_token = "Bearer live_WipV8nVoJRjxHS3LG2cxlEn5mX5E9Gn5L6uOUjAV";
const url = "https://api.gocardless.com";

export const getCustomerList = () => {
  return new Promise(function(resolve, reject) {
    fetch(`${url}/customers`, {
      method: "Get",
      headers: {
        Authorization: access_token,
        "Content-Type": "application/json",
        "GoCardless-Version": "2015-07-06"
      }
    })
      .then(res => {
        //console.log("res", res._bodyInit);
        resolve(res._bodyInit);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};
