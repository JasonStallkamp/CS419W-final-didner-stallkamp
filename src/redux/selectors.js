

export function getLoginStatus(state){

  return state.login;
}

export function getPrompt(state){
  console.log("in get prompt");
  console.log(state)
  return state.prompt;
}

export function getText(state){
  return state.text;
}
