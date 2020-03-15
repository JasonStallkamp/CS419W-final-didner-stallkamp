import { combineReducers } from 'redux';

import {SET_LOGIN_STATUS,SET_PROMPT,SET_TEXT} from "./actions";


const initialState = {
  prompt: "",
  login: false,
  text: ""
};

export default function rootReducer(state = initialState, action){
  switch (action.type){
    case SET_LOGIN_STATUS:
      return {
        ...state,
        login: action.payload
      };
    case SET_PROMPT:
      console.log("in set prompt");
      console.log(action)
      console.log({
        ...state,
        prompt: action.payload
      });
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
}
