import React, { useEffect, useContext } from "react";
import { WSContext } from "../context/WSState";

import { useHistory } from "react-router-dom";

import GameBoard from "./GameBoard";

export default function GamePage(){
const history = useHistory();
const { websocket, clientId, gameId, isWinner, boardInfo, setBoardInfo} = useContext(WSContext);

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

  function resetGame(){
    const payLoad = {
      "method": "reset",
      "clientId": clientId,
      "gameId": gameId
    }

    websocket.current.send(JSON.stringify(payLoad));

    websocket.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      console.log("New Game Board", response.board)

      if(response.method === "update"){
        setBoardInfo(response.board);
      }
    }
  }

  function exitGame(){
    const payLoad = {
      "method": "exit",
      "clientId": clientId,
      "gameId": gameId
    }

    websocket.current.send(JSON.stringify(payLoad));

    history.push("/");
  }

  useEffect(() => {
    const payLoad = {
      "method": "initializeBoard",
      "clientId": clientId,
    }

    websocket.current.send(JSON.stringify(payLoad));

    websocket.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      if(response.method === "initializeBoard"){
        setBoardInfo(response.board);
      }

      if(response.method === "update"){
        setBoardInfo(response.board);
      }
    }
  }, []);

  return (
    <div>
      <div onClick={exitGame}>
        Exit
      </div>
      {validateWinner()}
      <GameBoard board={boardInfo} />
      {isWinner !== 0 ? <div onClick={resetGame}>RESET</div>:<div></div>}
    </div>
  )
}