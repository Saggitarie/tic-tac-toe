import React, { useEffect, useContext } from "react";

import { WSContext } from "../context/WSState";

import GameBoard from "./GameBoard";

export default function GamePage(){
const { websocket, clientId, isWinner, isWinnerCheck
  ,boardInfo, setBoardInfo} = useContext(WSContext);

  function validateWinner(){
    if(isWinner === 0){
      return (
        <div></div>
      )
    } else {
      if(isWinner === 1){
        return (
        <div>You are the winner</div>
        )
      } else {
        return (
        <div>You lost :( </div>
        )
      }
    }
  }

useEffect(() => {
  const payLoad = {
    "method": "initializeBoard",
    "clientId": clientId,
  }

  console.log(websocket);

  websocket.current.send(JSON.stringify(payLoad));

  websocket.current.onmessage = (message) => {
    const response = JSON.parse(message.data);

    if(response.method === "initializeBoard"){
      setBoardInfo(response.board);
    }

    console.log("GameBoard Response >>>", response);
  }
}, [])

useEffect(() => {
  console.log(boardInfo);
}, [boardInfo, isWinner]);

  return (
    <div>
      {validateWinner()}
      <GameBoard board={boardInfo} />
    </div>
  )
}