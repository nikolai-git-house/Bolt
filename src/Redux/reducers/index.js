import {
  SAVE_ONBOARDING,
  SAVE_AUTH,
  SAVE_TOKEN,
  SAVE_USERID
} from "../actions";

import { createReducer } from "reduxsauce";

export const initialState = {
  basic_profile: {},
  keys: {}
};

const saveOnboardingReducer = (state, action) => ({
  ...state,
  basic: action.basic
});

const saveAuth = (state, action) => ({
  ...state,
  keys: action.authkey
});

const saveToken = (state, action) => ({
  ...state,
  token: action.token
});

const saveCurrentUserId = (state, action) => ({
  ...state,
  user_id: action.user_id
});

const actionHandlers = {
  SAVE_ONBOARDING: saveOnboardingReducer,
  SAVE_AUTH: saveAuth,
  SAVE_TOKEN: saveToken,
  SAVE_USERID: saveCurrentUserId
};
export default createReducer(initialState, actionHandlers);
