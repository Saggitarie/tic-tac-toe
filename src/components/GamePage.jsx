import React, { useEffect, useContext } from "react";
import { WSContext } from "../context/WSState";

import { useHistory } from "react-router-dom";

import GameBoard from "./GameBoard";

import "../styles/main.scss"

export default function GamePage(){
  const history = useHistory();

  const { websocket, clientId, gameId, symbol, setSymbol, isWinnerCheck,
          isWinner, boardInfo, setBoardInfo} = useContext(WSContext);

  useEffect(() => {

    console.log("Triggered");

    const payLoad = {
      "method": "initializeBoard",
      "clientId": clientId,
    }

    websocket.current.send(JSON.stringify(payLoad));

    websocket.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      if(response.method === "initializeBoard" ){
        setBoardInfo(response.board);
      }

      if(response.method === "update"){
        setBoardInfo(response.board);
        isWinnerCheck(0);
      }



      if(response.method === "chooseSymbolCircle" || response.method === "chooseSymbolCross"){
        setSymbol(response.symbol);
      }
    }
  }, []);

  function validateWinner(){
    if(isWinner === 0){
      return (
        <div></div>
      )
    } else {
      if(isWinner === 1){
        return (
        <div className="gamepage__winner-message u-margin-top-medium">You are the winner</div>
        )
      } else if(isWinner === 2) {
        return (
        <div className="gamepage__winner-message u-margin-top-medium">You lost :( Try Again By Pressing Reset Button</div>
        )
      } else {
        return (
          <div className="gamepage__winner-message u-margin-top-medium">Draw! Try Again By Pressing Reset Button</div>
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

    websocket.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      if(response.method === "exit"){
        if(response.symbol === "reset"){
          setSymbol("");
        }
      }
    }

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

      if(response.method === "chooseSymbolCross"){
        setSymbol(response.symbol);
      }
    }
  }

  return (
    <div className="gamepage u-center-text">
      {/* <div className="gamepage__exit" onClick={exitGame}>
        <figure className="gamepage__exit__group u-margin-top-tiny">
            <img src="/logout.svg" alt="Exit Icon" className="gamepage__exit__group--img" />
            <figcaption className="gamepage__exit__group--text">Exit</figcaption>
        </figure>
      </div> */}
      {validateWinner()}
      {!symbol ? <div className="gamepage__warning u-margin-top-medium">Choose your symbol before playing</div>: null}
      <div className="gamepage__symbol u-margin-top-tiny">
        <div className="gamepage__symbol__circle" onClick={chooseSymbolCircle}>
          <div className="gamepage__symbol__circle--icon" >○</div>
          <p className="gamepage__symbol__circle--text">Circle</p>
        </div>
        <div className="gamepage__symbol__cross" onClick={chooseSymbolCross}>
          <div className="gamepage__symbol__cross--icon" >×</div>
          <p className="gamepage__symbol__cross--text">Cross</p>
        </div>
      </div>
      <div className="gamepage__board">
        <GameBoard board={boardInfo} />
      </div>

      {isWinner !== 0 ? <div className="btn-reset u-margin-super-tiny btn-text" onClick={resetGame}>RESET</div>:<div></div>}
    </div>
  )
}