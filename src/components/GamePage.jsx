import React, { useEffect, useContext } from "react";
import { WSContext } from "../context/WSState";

import { useHistory } from "react-router-dom";

import GameBoard from "./GameBoard";

export default function GamePage(){

  const { websocket, clientId, gameId, symbol, setSymbol, isWinnerCheck,
          isWinner, boardInfo, setBoardInfo} = useContext(WSContext);
  const history = useHistory();

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

      if(response.method === "chooseSymbolCircle"){
        setSymbol(response.symbol);
      }

      if(response.method === "chooseSymbolCross"){
        setSymbol(response.symbol);
      }
    }
  },[]);

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
      } else if(isWinner === 2) {
        return (
        <div>You lost :( </div>
        )
      } else {
        return (
          <div>Draw</div>
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
        isWinnerCheck(0);
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

  function chooseSymbolCircle(){
    const payLoad = {
      "method": "chooseSymbolCircle",
      "clientId": clientId,
      "gameId": gameId
    }

    websocket.current.send(JSON.stringify(payLoad));

    websocket.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      console.log("ChooseSymbolCircle Response>>>", response);

      if(response.method === "chooseSymbolCircle"){
        setSymbol(response.symbol);
      }
    }
  }

  function chooseSymbolCross(){
    const payLoad = {
      "method": "chooseSymbolCross",
      "clientId": clientId,
      "gameId": gameId
    }

    websocket.current.send(JSON.stringify(payLoad));

    websocket.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      console.log("ChooseSymbolCross Response>>>", response);

      if(response.method === "chooseSymbolCross"){
        setSymbol(response.symbol);
      }
    }
  }

  return (
    <div>
      <div onClick={exitGame}>
        Exit
      </div>
      {validateWinner()}
      {!symbol ? <div>Choose your symbol</div>: null}
      <div onClick={chooseSymbolCircle}>○</div>
      <div onClick={chooseSymbolCross}>×</div>
      <GameBoard board={boardInfo} />
      {isWinner !== 0 ? <div onClick={resetGame}>RESET</div>:<div></div>}
    </div>
  )
}