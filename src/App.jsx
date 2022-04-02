import { useState, useEffect } from 'react'
import './App.css'
import SettlementsList from './data/settlements.json';

function randInt(max) {
  return Math.floor(Math.random() * max);
}

function getSettlement(){
  let newSettlement;
  newSettlement = SettlementsList[randInt(SettlementsList.length)];

  return newSettlement;
}

function App() {
  const [firstSettlement, setSettlement1] = useState(SettlementsList[0]);
  const [secondSettlement, setSettlement2] = useState(SettlementsList[0]);
  
  return (
    <div className="App">
      <header className="App-header">
        <p>The Souther Norther Game</p>
        <p>
          <button type="button" onClick={() => {setSettlement1(getSettlement())}}>
            Settlement
          </button>
        </p>
        <h1>{firstSettlement.cityLabel}</h1>
        <h1>{firstSettlement.gps.split(" ")[1].replace(")", "")}</h1>
      </header>
    </div>
  )
}

export default App
