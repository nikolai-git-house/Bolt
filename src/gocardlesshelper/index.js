//const access_token = "Bearer sandbox_mS3qrj0LgcXazQxE1-vt4hpXwks6ocykzJnQCvhB";
const access_token = "Bearer live_WipV8nVoJRjxHS3LG2cxlEn5mX5E9Gn5L6uOUjAV";
const url = "https://api.gocardless.com";
const creditor_id = "CR00005TTCQWAS";

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

export const getMandatesList = () => {
  return new Promise(function(resolve, reject) {
    fetch(`${url}/mandates`, {
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
export const createRedirectFlow = session_token => {
  const body = {
    redirect_flows: {
      description: "Go Cardless Direct Debit Setup",
      session_token: session_token,
      success_redirect_url: "https://gocardlessconfirm.firebaseapp.com",
      prefilled_customer: {
        given_name: "Frank",
        family_name: "Osborne",
        email: "frank.osborne@acmeplc.com"
      }
    }
  };
  return new Promise(function(resolve, reject) {
    fetch(`${url}/redirect_flows`, {
      method: "post",
      headers: {
        Authorization: access_token,
        "Content-Type": "application/json",
        "GoCardless-Version": "2015-07-06"
      },
      body: JSON.stringify(body)
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
        console.log("Request failed", error);
      });
  });
};
export const getResofRedirect = (id, token) => {
  const body = {
    data: {
      session_token: token
    }
  };
  return new Promise(function(resolve, reject) {
    fetch(`${url}/redirect_flows/${id}/actions/complete`, {
      method: "post",
      headers: {
        Authorization: access_token,
        "Content-Type": "application/json",
        "GoCardless-Version": "2015-07-06"
      },
      body: JSON.stringify(body)
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
        console.log("Request failed", error);
      });
  });
};
export const createSubscription = (mandate, amount) => {
  const body = {
    subscriptions: {
      amount: amount,
      currency: "GBP",
      name: "Monthly Magazine",
      interval_unit: "monthly",
      day_of_month: "1",
      metadata: {
        order_no: "ABCD1234"
      },
      links: {
        mandate: mandate
      }
    }
  };

  return new Promise(function(resolve, reject) {
    fetch(`${url}/subscriptions`, {
      method: "post",
      headers: {
        Authorization: access_token,
        "Content-Type": "application/json",
        "GoCardless-Version": "2015-07-06"
      },
      body: JSON.stringify(body)
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
        console.log("Request failed", error);
      });
  });
};
