import React from "react";

import Cell from "./Cell";

import "../styles/main.scss"

export default function GamePage(props){
  return (
    <div className="board u-margin-super-tiny">
      {props.board.map(cell => {
        return <Cell key={cell.cellNo} cellNo={cell.cellNo} isSelected={cell.isSelected} clientId={cell.clientId} symbol={cell.symbol}/>
      })}
    </div>
  )
}