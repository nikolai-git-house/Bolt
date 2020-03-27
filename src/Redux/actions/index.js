/**
 * Author: Moses Adekunle Esan for E&M Digital
 * Date: 6/29/2017
 * Project: React Native Redux Quotes App with CRUD operations
 */

'use strict';

export const SAVE_ONBOARDING = 'SAVE_ONBOARDING';
export const SAVE_UID = 'SAVE_UID';
export const SAVE_PET = 'SAVE_PET';
export const SAVE_BIKE = 'SAVE_BIKE';
export const SAVE_HEALTH = 'SAVE_HEALTH';
export const SAVE_HOME = 'SAVE_HOME';
export const SAVE_INVITATION = 'SAVE_INVITATION';
export const SAVE_RENT = 'SAVE_RENT';
export const SAVE_REDIRECT_TOKEN = 'SAVE_REDIRECT_TOKEN';
export const REMOVE_ALL = 'REMOVE_ALL';
export const SAVE_COMINGFLAG = 'SAVE_COMINGFLAG';
export const SAVE_POST = 'SAVE_POST';
export const SAVE_ALLUSER = 'SAVE_ALLUSER';
export const SAVE_SCREEN = 'SAVE_SCREEN';
export const RESET_CONCIERGE = 'RESET_CONCIERGE';
export const saveOnboarding = basicInfo => ({
  type: SAVE_ONBOARDING,
  basic: basicInfo,
});
export const saveUID = uid => ({type: SAVE_UID, uid: uid});
export const saveInvitation = invitation => ({
  type: SAVE_INVITATION,
  invitation: invitation,
});
export const savePet = pet => ({
  type: SAVE_PET,
  pet: pet,
});
export const saveBike = bike => ({
  type: SAVE_BIKE,
  bike: bike,
});
export const saveHealth = health => ({
  type: SAVE_HEALTH,
  health: health,
});
export const saveHome = home => ({
  type: SAVE_HOME,
  home: home,
});
export const saveRent = rent => ({
  type: SAVE_RENT,
  rent: rent,
});
export const saveRedirectToken = token => ({
  type: SAVE_REDIRECT_TOKEN,
  redirect_token: token,
});
export const resetConcierge = reset => ({
  type: RESET_CONCIERGE,
  reset: reset,
});
export const removeAll = () => ({
  type: REMOVE_ALL,
});
export const saveComingflag = flag => ({
  type: SAVE_COMINGFLAG,
  coming_flag: flag,
});
export const savePosts = posts => ({
  type: SAVE_POST,
  posts: posts,
});
export const saveUsers = users => ({
  type: SAVE_ALLUSER,
  users: users,
});
export const saveScreen = screen => ({
  type: SAVE_SCREEN,
  screen: screen,
});
