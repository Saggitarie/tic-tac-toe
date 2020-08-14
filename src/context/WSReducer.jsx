export default (state, action) => {
  switch(action.type){
    case "SET_CLIENT_ID":
      return {...state, clientId: action.payload};
    case "SET_GAME_ID":
      return {...state, gameId: action.payload};
    default:
      return state;
  }
}