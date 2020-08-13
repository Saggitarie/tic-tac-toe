import React, { useEffect, useRef } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import "./styles/main.scss";

export default () => {
  const client = useRef(null);

  useEffect(() => {
    client.current = new W3CWebSocket('ws://localhost:8000');
    client.current.onopen = () => {
      console.log("WebSocket Client is Open");
    };

    client.current.onmessage = (message) => {
      console.log(message);
    }
  }, [])

  return (
    <div>
      Practical Intro to WebSockets
    </div>
  )
}