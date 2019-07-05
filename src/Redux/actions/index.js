/**
 * Author: Moses Adekunle Esan for E&M Digital
 * Date: 6/29/2017
 * Project: React Native Redux Quotes App with CRUD operations
 */

"use strict";

export const SAVE_ONBOARDING = "SAVE_ONBOARDING";
export const SAVE_UID = "SAVE_UID";
export const SAVE_PET = "SAVE_PET";
export const SAVE_BIKE = "SAVE_BIKE";
export const SAVE_HEALTH = "SAVE_HEALTH";
export const SAVE_HOME = "SAVE_HOME";
export const SAVE_RENT = "SAVE_RENT";
export const SAVE_REDIRECT_TOKEN = "SAVE_REDIRECT_TOKEN";
export const REMOVE_ALL = "REMOVE_ALL";

export const saveOnboarding = basicInfo => ({
  type: SAVE_ONBOARDING,
  basic: basicInfo
});
export const saveUID = uid => ({ type: SAVE_UID, uid: uid });
export const savePet = pet => ({
  type: SAVE_PET,
  pet: pet
});
export const saveBike = bike => ({
  type: SAVE_BIKE,
  bike: bike
});
export const saveHealth = health => ({
  type: SAVE_HEALTH,
  health: health
});
export const saveHome = home => ({
  type: SAVE_HOME,
  home: home
});
export const saveRent = rent => ({
  type: SAVE_RENT,
  rent: rent
});
export const saveRedirectToken = token => ({
  type: SAVE_REDIRECT_TOKEN,
  redirect_token: token
});
export const removeAll = () => ({
  type: REMOVE_ALL
});
