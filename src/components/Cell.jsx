import React, { useContext } from "react";
import {WSContext} from "../context/WSState";

import "../styles/main.scss";
import { useEffect } from "react";

export default function Cell(props){
  const {websocket, clientId, gameId, isWinner,
         boardInfo, setBoardInfo, isWinnerCheck} = useContext(WSContext);

  useEffect(() => {
    websocket.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      if(response.method === "update"){
        console.log("Updated ", response);

        setBoardInfo(response.board);

        if(response.winner !== "" && response.winner === clientId){
          isWinnerCheck(1)
        } 

        if(response.winner !== "" && response.winner !== clientId){
          isWinnerCheck(2);
        }
      }
    }     
  }, [boardInfo, isWinner])

  function onSelectCell(){
    const payLoad = {
      "method": "playerMove",
      "clientId": clientId,
      "cellNo": props.cellNo,
      "gameId": gameId
    }

    websocket.current.send(JSON.stringify(payLoad));

    websocket.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      if(response.method === "update"){
        console.log("Updated ", response);

        setBoardInfo(response.board);

        if(response.winner !== "" && response.winner === clientId){
          isWinnerCheck(1)
        } 

        if(response.winner !== "" && response.winner !== clientId){
          isWinnerCheck(2);
        }
      }
    }
  }

  console.log("In Cell", props);
  return (
    <div onClick={onSelectCell} className="temp-border">
      <p>CellNo: {props.cellNo}</p>
      <p>IsSelected: {String(props.isSelected)}</p>
      <p>ClientId: {props.clientId}</p>
    </div>
  )
}