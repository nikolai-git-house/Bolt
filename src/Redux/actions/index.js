/**
 * Author: Moses Adekunle Esan for E&M Digital
 * Date: 6/29/2017
 * Project: React Native Redux Quotes App with CRUD operations
 */

"use strict";

export const SAVE_ONBOARDING = "SAVE_ONBOARDING";
export const SAVE_AUTH = "SAVE_AUTH";
export const SAVE_TOKEN = "SAVE_TOKEN";
export const SAVE_USERID = "SAVE_USERID";

export const saveOnboarding = basicInfo => ({
  type: SAVE_ONBOARDING,
  basic: basicInfo
});

export const saveAuth = key => ({ type: SAVE_AUTH, authkey: key });

export const saveToken = token => ({ type: SAVE_TOKEN, token: token });

export const saveCurrentUserId = user_id => ({
  type: SAVE_USERID,
  user_id: user_id
});
