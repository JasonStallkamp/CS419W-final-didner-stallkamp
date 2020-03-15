import { combineReducers } from 'redux';

import {SET_LOGIN_STATUS,SET_PROMPT,SET_TEXT} from "./actions";


const initialState = {
  prompt: "",
  login: false,
  text: ""
};

function rootReducer(state = initialState, action){
  switch (action.type){
    case SET_LOGIN_STATUS:
      return {
        ...state,
        login: action.payload
      };
    case SET_PROMPT:
      return{
        ...state,
        prompt: action.payload
      };
    case SET_TEXT:
      return{
        ...state,
        text: action.payload
      };
    default:
      return state;
}




export default rootReducer;
