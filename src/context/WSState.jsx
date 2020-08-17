import React, { createContext, useReducer } from "react";
import WSReducer from "./WSReducer";
import { 
  SET_CLIENT_ID,
  SET_GAME_ID,
  SET_WEBSOCKET,
  SET_BOARD_INFO,
  SET_SYMBOL,
  IS_PLAYERS_TURN,
  HAS_ACTIVE_GAME,
  IS_WINNER 
} from "./WSTypes";

const initialState = {
  clientId: "",
  gameId: "",
  boardInfo: [],
  symbol: "",
  isPlayerTurn: false,
  websocket: null,
  hasActiveGame: false,
  isWinner: 0
}

// Create Store
export const WSContext = createContext(initialState);

// Provider content
export const WSProvider = ({children}) => {
  const [state, dispatch] = useReducer(WSReducer, initialState);

  // Actions
  function setClientId(str){
    dispatch({
      type: SET_CLIENT_ID,
      payload: str
    })
  }

  function setGameId(str){
    dispatch({
      type: SET_GAME_ID,
      payload: str
    })
  }

  function setWebSocket(obj){
    dispatch({
      type: SET_WEBSOCKET,
      payload: obj
    })
  }

  function setBoardInfo(arr){
    dispatch({
      type: SET_BOARD_INFO,
      payload: arr
    })
  }

  function setSymbol(str){
    dispatch({
      type: SET_SYMBOL,
      payload: str
    })
  }

  function toggleActiveGameState(){
    dispatch({
      type: HAS_ACTIVE_GAME
    })
  }

  function isWinnerCheck(num){
    dispatch({
      type: IS_WINNER,
      payload: num
    })
  }

  function checkPlayerTurn(bool){
    dispatch({
      type: IS_PLAYERS_TURN,
      payload: bool
    });
  }

  return (
    <WSContext.Provider value={{
      clientId: state.clientId,
      gameId: state.gameId,
      websocket: state.websocket,
      boardInfo: state.boardInfo,
      symbol: state.symbol,
      isPlayerTurn: state.isPlayerTurn,
      hasActiveGame: state.hasActiveGame,
      isWinner: state.isWinner,
      setClientId,
      setGameId,
      setWebSocket,
      setBoardInfo,
      setSymbol,
      checkPlayerTurn,
      isWinnerCheck,
      toggleActiveGameState
    }}>
      {children}
    </WSContext.Provider>
  )
}
