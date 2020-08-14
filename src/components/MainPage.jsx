import React, { useMemo, useState, useEffect, useRef, useContext } from "react";
import {WSContext} from "../context/WSState";

export default function MainPage(){
  const {clientId, setClientId} = useContext(WSContext);

  const client = useRef(null);

  useEffect(() => {
    client.current = new WebSocket('ws://localhost:8000');
    client.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      console.log(typeof response.clientId);
      
      setClientId(response.clientId);
      console.log(clientId)
  }
  }, []);

  const onActivateGame = () => {
    console.log(clientId);
    const payLoad = {
      "method": "start",
      "clientId": clientId
    }

    client.current.send(JSON.stringify(payLoad));
  }

  return (
    <div>
      <div>
        <img src="/tic-tac-toe.svg" />
      </div>
      <div>
      Tic Tac Toe
      </div>
      <div onClick={onActivateGame}>START</div>
    </div>
  )
}