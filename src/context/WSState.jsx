import React, { createContext, useReducer } from "react";
import WSReducer from "./WSReducer";
import { SET_CLIENT_ID, SET_GAME_ID } from "./WSTypes";

const initialState = {
  clientId: "",
  gameId: ""
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

  return (
    <WSContext.Provider value={{
      clientId: state.clientId,
      gameId: state.gameId,
      setClientId,
      setGameId
    }}>
      {children}
    </WSContext.Provider>
  )
}
