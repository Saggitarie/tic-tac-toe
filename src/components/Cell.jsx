import React, { useContext, useEffect } from "react";
import {WSContext} from "../context/WSState";

import "../styles/main.scss";

export default function Cell(props){
  const {websocket, clientId, gameId, isWinner, symbol, checkPlayerTurn,
         boardInfo, setBoardInfo, isWinnerCheck} = useContext(WSContext);

  useEffect(() => {
    websocket.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      console.log("Turn>>>>>", response.turn);
      console.log("This Client >>>>", clientId);

      checkPlayerTurn(response.turn === clientId);

      if(response.method === "update"){
        setBoardInfo(response.board);

        if(response.winner !== "" && response.winner === clientId){
          isWinnerCheck(1)
        } 

        if(response.winner !== "" && response.winner !== clientId){
          isWinnerCheck(2);
        }

        if(response.winner !== "" && response.winner === "Draw"){
          isWinnerCheck(3);
        }
      }
    }     
  }, [boardInfo, isWinner])

  function onSelectCell(){
    const payLoad = {
      "method": "playerMove",
      "clientId": clientId,
      "cellNo": props.cellNo,
      "gameId": gameId,
      "symbol": symbol
    }

    websocket.current.send(JSON.stringify(payLoad));

    websocket.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      console.log("Turn>>>>>", response.turn);
      console.log("This Client >>>>", clientId);

      if(response.method === "update"){
        setBoardInfo(response.board);

        if(response.winner !== "" && response.winner !== "Draw" && response.winner === clientId){
          isWinnerCheck(1)
        } 

        if(response.winner !== "" && response.winner !== "Draw" && response.winner !== clientId){
          isWinnerCheck(2);
        }

        if(response.winner !== "" && response.winner === "Draw"){
          isWinnerCheck(3);
        }
      }
    }
  }

  return (
    <div onClick={onSelectCell} className="board__cell">
      {props.symbol === "Circle" ? 
      (<div>
        <img className="board__cell--circle" src="/circle.svg" />
      </div>) : props.symbol === "Cross" ?
        (<div>
          <img className="board__cell--cross"  src="/cross.svg" />  
        </div>):
        null
      }
    </div>
  )
}