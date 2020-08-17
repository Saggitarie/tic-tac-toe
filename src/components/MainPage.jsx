import React, { useEffect, useRef, useContext } from "react";
import {WSContext} from "../context/WSState";

import { useHistory } from "react-router-dom";

import "../styles/main.scss";

export default function MainPage(){
  const history = useHistory();

  const {clientId, gameId, setClientId, setGameId,
    hasActiveGame, toggleActiveGameState, setWebSocket} = useContext(WSContext);

  const client = useRef(null);

  useEffect(() => {
    client.current = new WebSocket('wss://tic-tac-toe-app-2.herokuapp.com/');
    // client.current = new WebSocket('ws://localhost:8000');
    setWebSocket(client);

    client.current.onmessage = (message) => {
      const response = JSON.parse(message.data);
      setClientId(response.clientId);

      if(JSON.stringify(response.gameId) !== "{}"){
        const gameId = Object.entries(response.gameId);
        toggleActiveGameState();
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

      setGameId(response.game.id);
      toggleActiveGameState();
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

      history.push("/game");
    }
  }

  return (
    <div className="mainpage u-center-text">
      <div className="mainpage__logo u-padding-top-medium">
        <img className="mainpage__logo--img" src="/tic-tac-toe.svg" />
      </div>
      <div className="mainpage__title u-padding-top-tiny">
        <p className="mainpage__title--main">Tic Tac Toe</p>
        <p className="mainpage__title--sub">Ready for a Challenge?</p>
      </div>
      <div className="u-padding-top-medium">
        {
        hasActiveGame 
        ? <div className="btn btn-text" onClick={onJoinGameClick}>JOIN GAME</div>
        : <div className="btn btn-text" onClick={onStartGameClick}>CREATE GAME</div>
        } 
      </div>
    </div>
  )
}