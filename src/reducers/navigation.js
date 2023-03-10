import { CHANGE_SIDEBAR_VISIBILITY, SET_CHECKING, CHANGE_SIDEBAR_POSITION, OPEN_SIDEBAR, CLOSE_SIDEBAR, CHANGE_ACTIVE_SIDEBAR_ITEM, CHANGE_THEME_COLOR } from '../actions/navigation';

const initialState = {
  sidebarOpened: false,
  activeItem: window.location.pathname,
  sidebarPosition: 'left',
  sidebarVisibility: 'show',
  themeColor: 'dark',
  checking: false,
};

export default function runtime(state = initialState, action) {
  switch (action.type) {
    case OPEN_SIDEBAR:
      return Object.assign({}, state, {
        sidebarOpened: true,
      });
    case CLOSE_SIDEBAR:
      return Object.assign({}, state, {
        sidebarOpened: false,
      });
    case CHANGE_SIDEBAR_POSITION:
      return Object.assign({}, state, {
        sidebarPosition: action.payload,
      });
    case CHANGE_SIDEBAR_VISIBILITY:
      return Object.assign({}, state, {
        sidebarVisibility: action.payload,
      });
    case CHANGE_ACTIVE_SIDEBAR_ITEM:
      return {
        ...state,
        activeItem: action.activeItem,
      };
    case CHANGE_THEME_COLOR:
      return {
        ...state,
        themeColor: action.payload,
      };
    case SET_CHECKING: {
      return {
          ...state,
          checking: action.payload,
        }
    }
    default:
      return state;
  }
}
