export const SET_LOGIN_STATUS = "SET_LOGIN_STATUS";
export const SET_PROMPT = "SET_PROMPT";
export const SET_TEXT = "SET_TEXT";



export function setLoginStatus(payload){
  return {type: SET_LOGIN_STATUS, payload}
}


export function setPrompt(payload){
  console.log("action payload: " + payload);
  return {type: SET_PROMPT, payload}
}


export function setText(payload){
  return {type: SET_TEXT, payload}
}
