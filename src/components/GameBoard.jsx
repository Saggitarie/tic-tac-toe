import React, { useEffect } from "react";

import Cell from "./Cell";

export default function GamePage(props){
  return (
    <div>
      {props.board.map(cell => {
        return <Cell key={cell.cellNo} cellNo={cell.cellNo} isSelected={cell.isSelected} clientId={cell.clientId} symbol={cell.symbol}/>
      })}
    </div>
  )
}