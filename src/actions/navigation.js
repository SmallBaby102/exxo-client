/* eslint-disable import/prefer-default-export */

export const OPEN_SIDEBAR = 'OPEN_SIDEBAR';
export const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR';
export const CHANGE_ACTIVE_SIDEBAR_ITEM = 'CHANGE_ACTIVE_SIDEBAR_ITEM';
export const CHANGE_SIDEBAR_POSITION = 'CHANGE_SIDEBAR_POSITION';
export const CHANGE_SIDEBAR_VISIBILITY = 'CHANGE_SIDEBAR_VISIBILITY';
export const CHANGE_THEME_COLOR = 'CHANGE_THEME_COLOR';
export const SET_CHECKING = 'SET_CHECKING';

export function openSidebar() {
  return {
    type: OPEN_SIDEBAR,
  };
}

export function changeSidebarPosition(nextPosition) {
  return {
    type: CHANGE_SIDEBAR_POSITION,
    payload: nextPosition,
  };
}

export function closeSidebar() {
  return {
    type: CLOSE_SIDEBAR,
  };
}

export function changeActiveSidebarItem(activeItem) {
  return {
    type: CHANGE_ACTIVE_SIDEBAR_ITEM,
    activeItem,
  };
}

export function changeSidebarVisibility(nextVisibility) {
  return {
    type: CHANGE_SIDEBAR_VISIBILITY,
    payload: nextVisibility,
  };
}
export function changeThemeColor(nextColor) {
  return {
    type: CHANGE_THEME_COLOR,
    payload: nextColor,
  };
}
export const setChecking = checking => {
  return {
      type: SET_CHECKING,
      payload: checking,
  }
}