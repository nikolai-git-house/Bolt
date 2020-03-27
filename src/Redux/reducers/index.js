import {
  SAVE_ONBOARDING,
  SAVE_UID,
  SAVE_PET,
  SAVE_BIKE,
  SAVE_HEALTH,
  SAVE_HOME,
  SAVE_RENT,
  SAVE_REDIRECT_TOKEN,
  REMOVE_ALL,
  SAVE_COMINGFLAG,
  SAVE_POST,
  SAVE_ALLUSER,
} from '../actions';

import {createReducer} from 'reduxsauce';

export const initialState = {
  basic_profile: null,
  uid: '',
  invitation: null,
  pet: null,
  bike: null,
  health: null,
  home: null,
  rent: null,
  redirect_token: null,
  posts: [],
  users: [],
  screen: 'personal',
  reset: false,
};

const saveOnboardingReducer = (state, action) => ({
  ...state,
  basic: action.basic,
});

const saveUIDReducer = (state, action) => ({
  ...state,
  uid: action.uid,
});

const saveInvitationReducer = (state, action) => ({
  ...state,
  invitation: action.invitation,
});

const savePetReducer = (state, action) => ({
  ...state,
  pet: action.pet,
});

const saveBikeReducer = (state, action) => ({
  ...state,
  bike: action.bike,
});

const saveHealthReducer = (state, action) => ({
  ...state,
  health: action.health,
});

const saveHomeReducer = (state, action) => ({
  ...state,
  home: action.home,
});

const saveRentReducer = (state, action) => ({
  ...state,
  rent: action.rent,
});

const saveRedirectTokenReducer = (state, action) => ({
  ...state,
  redirect_token: action.redirect_token,
});

const resetConciergeReducer = (state, action) => ({
  ...state,
  reset: action.reset,
});
const removeAllReducer = (state, action) => ({
  ...state,
  invitation: null,
  pet: null,
  bike: null,
  health: null,
  home: null,
  rent: null,
});
const saveComingflagReducer = (state, action) => ({
  ...state,
  coming_flag: action.coming_flag,
});
const savePostsReducer = (state, action) => ({
  ...state,
  posts: action.posts,
});
const saveUsersReducer = (state, action) => ({
  ...state,
  users: action.users,
});
const saveScreenReducer = (state, action) => ({
  ...state,
  screen: action.screen,
});
const actionHandlers = {
  SAVE_ONBOARDING: saveOnboardingReducer,
  SAVE_UID: saveUIDReducer,
  SAVE_INVITATION: saveInvitationReducer,
  SAVE_PET: savePetReducer,
  SAVE_BIKE: saveBikeReducer,
  SAVE_HEALTH: saveHealthReducer,
  SAVE_HOME: saveHomeReducer,
  SAVE_RENT: saveRentReducer,
  SAVE_REDIRECT_TOKEN: saveRedirectTokenReducer,
  REMOVE_ALL: removeAllReducer,
  SAVE_COMINGFLAG: saveComingflagReducer,
  SAVE_POST: savePostsReducer,
  SAVE_ALLUSER: saveUsersReducer,
  SAVE_SCREEN: saveScreenReducer,
  RESET_CONCIERGE: resetConciergeReducer,
};
export default createReducer(initialState, actionHandlers);
