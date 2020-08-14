import React, { useEffect, useRef, useContext } from "react";
import {WSContext} from "../context/WSState";

import { useHistory } from "react-router-dom";

export default function MainPage(){
  const history = useHistory();

  const {clientId, gameId, setClientId, setGameId} = useContext(WSContext);

  const client = useRef(null);

  useEffect(() => {
    client.current = new WebSocket('ws://localhost:8000');
    client.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      console.log(JSON.stringify(response.gameId));
      setClientId(response.clientId);

      if(JSON.stringify(response.gameId) !== "{}"){
        const gameId = Object.entries(response.gameId);
        console.log("GameID >>>>", gameId[0][0]);
        setGameId(gameId[0][0]);
      }
  }
  }, []);

  const onStartGameClick = () => {
    const payLoad = {
      "method": "start",
      "clientId": clientId
    }

    client.current.send(JSON.stringify(payLoad));

    client.current.onmessage = (message) => {
      const response = JSON.parse(message.data);

      console.log("Game Successfull Created with id", response.game.id);

      setGameId(response.game.id);
    }
  }

  const onJoinGameClick = () => {
    const payLoad = {
      "method": "join",
      "clientId": clientId,
      "gameId": gameId
    }

    client.current.send(JSON.stringify(payLoad));

    client.current.onmessage = (message) => {
      const response = JSON.parse(message.data);
      console.log(response);

      history.push("/game");
    }
  }

  return (
    <div>
      <div>
        <img src="/tic-tac-toe.svg" />
      </div>
      <div>
      Tic Tac Toe
      </div>
      <div onClick={onStartGameClick}>START</div>
      <div onClick={onJoinGameClick}>JOIN</div>
    </div>
  )
}