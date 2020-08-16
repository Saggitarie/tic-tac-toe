import React, { useContext, useEffect } from "react";
import {WSContext} from "../context/WSState";

import "../styles/main.scss";

export default function Cell(props){
  const {websocket, clientId, gameId, isWinner, symbol,
         boardInfo, setBoardInfo, isWinnerCheck} = useContext(WSContext);

  useEffect(() => {
    websocket.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

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
      {/* <p>CellNo: {props.cellNo}</p>
      // <p>IsSelected: {String(props.isSelected)}</p>
      // <p>ClientId: {props.clientId}</p>
      // <p>Symbol: {props.symbol}</p> */}
      {props.symbol === "Circle" ? 
      (<div>
        {/* <p>CellNo: {props.cellNo}</p> */}
        <img className="board__cell--circle" src="/circle.svg" />
      </div>) : props.symbol === "Cross" ?
        (<div>
          {/* <p>CellNo: {props.cellNo}</p> */}
          <img className="board__cell--cross"  src="/cross.svg" />  
        </div>):
        null
        // <p>CellNo: {props.cellNo}</p>
      }
    </div>
  )
}