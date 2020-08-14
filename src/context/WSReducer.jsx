export default (state, action) => {
  console.log("In Reducer State>>>", state)
  console.log("In Reducer >>>", action);
  switch(action.type){
    case "SET_CLIENT_ID":
      return {...state, clientId: action.payload};
    case "SET_GAME_ID":
      return {...state, gameId: action.payload};
    case "HAS_ACTIVE_GAME":
      return {...state, hasActiveGame: !state.hasActiveGame}
    default:
      return state;
  }
}