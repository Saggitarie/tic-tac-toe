import React, { useState, useEffect, useContext } from "react";

import { WSContext } from "../context/WSState";

import GameBoard from "./GameBoard";

export default function GamePage(){
const { websocket, clientId, boardInfo, setBoardInfo } = useContext(WSContext);

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
}, [boardInfo]);

  return (
    <div>
      <GameBoard board={boardInfo} />
    </div>
  )
}