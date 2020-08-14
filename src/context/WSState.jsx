import React, { createContext, useReducer } from "react";
import WSReducer from "./WSReducer";
import { SET_CLIENT_ID, SET_GAME_ID, HAS_ACTIVE_GAME } from "./WSTypes";

const initialState = {
  clientId: "",
  gameId: "",
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

  return (
    <WSContext.Provider value={{
      clientId: state.clientId,
      gameId: state.gameId,
      hasActiveGame: state.hasActiveGame,
      setClientId,
      setGameId,
      toggleActiveGameState
    }}>
      {children}
    </WSContext.Provider>
  )
}
