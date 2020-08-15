import React, { createContext, useReducer } from "react";
import WSReducer from "./WSReducer";
import { 
  SET_CLIENT_ID,
  SET_GAME_ID,
  HAS_ACTIVE_GAME,
  SET_WEBSOCKET,
  SET_BOARD_INFO 
} from "./WSTypes";

const initialState = {
  clientId: "",
  gameId: "",
  boardInfo: [],
  websocket: null,
  hasActiveGame: false
}

// Create Store
export const WSContext = createContext(initialState);

// Provider content
export const WSProvider = ({children}) => {
  const [state, dispatch] = useReducer(WSReducer, initialState);

  // Actions
  function setClientId(str){
    console.log(`parameter str  ${str}`)
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

  function toggleActiveGameState(){
    dispatch({
      type: HAS_ACTIVE_GAME
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

  return (
    <WSContext.Provider value={{
      clientId: state.clientId,
      gameId: state.gameId,
      websocket: state.websocket,
      boardInfo: state.boardInfo,
      hasActiveGame: state.hasActiveGame,
      setClientId,
      setGameId,
      setWebSocket,
      setBoardInfo,
      toggleActiveGameState
    }}>
      {children}
    </WSContext.Provider>
  )
}
