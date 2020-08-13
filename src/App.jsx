
import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import GamePage from "./components/GamePage";
import MainPage from "./components/MainPage";

import "./styles/main.scss";

export default () => {
  const client = useRef(null);

  useEffect(() => {
    client.current = new WebSocket('ws://localhost:8000');
    console.log(client)
    client.current.onopen = () => {
      console.log("WebSocket Client is Open");
    };

    client.current.onmessage = (message) => {
      console.log(message);
    }
  }, [])

  return (
    <Router>
      <Switch>
        <Route exact path="/"
        render={(props) => <MainPage {...props} ws={client} />}
        />
        <Route exact path="/game"
        render={(props) => <GamePage {...props} ws={client} />}
        />
      </Switch>
    </Router>
  )
}