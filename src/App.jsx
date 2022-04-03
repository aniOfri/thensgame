import { useState, useEffect } from 'react'
import './App.css'
import SettlementsList from './data/settlements.json';

function RandInt(max) {
  return Math.floor(Math.random() * max);
}

function GetSettlement(settle){
  let newSettlement;
  newSettlement = SettlementsList[RandInt(SettlementsList.length)];
  return [settle, newSettlement];
}

function App() {
  const [settlements, setSettlements] = useState(GetSettlement(SettlementsList[RandInt(SettlementsList.length)]));
  const [streak, setStreak] = useState(0);

  function Choice(north){
    let top = settlements[0].gps.split(" ")[1].replace(")", "");
    let bottom = settlements[1].gps.split(" ")[1].replace(")", "");

    if (north && top < bottom)
      setStreak(streak + 1);
    else if (!north && top > bottom)
      setStreak(streak + 1);
    else
      setStreak(0);

    setSettlements(GetSettlement(settlements[1]))
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <p>The Souther Norther Game</p>
        <p>Streak: {streak}</p>
        <h1>{settlements[0].cityLabel}</h1>
        <p>
        <button type="button" onClick={() => {Choice(true)}}>
            Norther
          </button>
          <button type="button" onClick={() => {Choice(false)}}>
            Souther
          </button>
          </p>
        <h1>{settlements[1].cityLabel}</h1>
      </header>
    </div>
  )
}

export default App
