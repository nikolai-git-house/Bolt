import {
  SAVE_ONBOARDING,
  SAVE_UID,
  SAVE_PET,
  SAVE_BIKE,
  SAVE_HEALTH,
  SAVE_HOME,
  SAVE_RENT,
  SAVE_REDIRECT_TOKEN,
  REMOVE_ALL
} from "../actions";

import { createReducer } from "reduxsauce";

export const initialState = {
  basic_profile: null,
  uid: "",
  pet: null,
  bike: null,
  health: null,
  home: null,
  rent: null,
  redirect_token: null
};

const saveOnboardingReducer = (state, action) => ({
  ...state,
  basic: action.basic
});

const saveUIDReducer = (state, action) => ({
  ...state,
  uid: action.uid
});

const savePetReducer = (state, action) => ({
  ...state,
  pet: action.pet
});

const saveBikeReducer = (state, action) => ({
  ...state,
  bike: action.bike
});

const saveHealthReducer = (state, action) => ({
  ...state,
  health: action.health
});

const saveHomeReducer = (state, action) => ({
  ...state,
  home: action.home
});

const saveRentReducer = (state, action) => ({
  ...state,
  rent: action.rent
});

const saveRedirectTokenReducer = (state, action) => ({
  ...state,
  redirect_token: action.redirect_token
});

const removeAllReducer = (state, action) => ({
  ...state,
  pet: null,
  bike: null,
  health: null,
  home: null,
  rent: null
});

const actionHandlers = {
  SAVE_ONBOARDING: saveOnboardingReducer,
  SAVE_UID: saveUIDReducer,
  SAVE_PET: savePetReducer,
  SAVE_BIKE: saveBikeReducer,
  SAVE_HEALTH: saveHealthReducer,
  SAVE_HOME: saveHomeReducer,
  SAVE_RENT: saveRentReducer,
  SAVE_REDIRECT_TOKEN: saveRedirectTokenReducer,
  REMOVE_ALL: removeAllReducer
};
export default createReducer(initialState, actionHandlers);
