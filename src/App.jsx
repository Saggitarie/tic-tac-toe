
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import GamePage from "./components/GamePage";
import MainPage from "./components/MainPage";

import { WSProvider } from "./context/WSState";

import "./styles/main.scss";

export default () => {

  return (
    <>
      <WSProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={MainPage}/>
            <Route exact path="/game" component={GamePage}/>
          </Switch>
        </Router>
      </WSProvider>
    </>
  )
}