export default (state, action) => {
  switch(action.type){
    case "SET_CLIENT_ID":
      return {...state, clientId: action.payload};
    case "SET_GAME_ID":
      return {...state, gameId: action.payload};
    case "SET_WEBSOCKET":
      return {...state, websocket: action.payload};
    case "SET_BOARD_INFO":
      return {...state, boardInfo: action.payload};
    case "SET_SYMBOL":
      return {...state, symbol: action.payload};
    case "IS_WINNER":
      return {...state, isWinner: action.payload}
    case "HAS_ACTIVE_GAME":
      return {...state, hasActiveGame: !state.hasActiveGame}
    default:
      return state;
  }
}