import { useState, useEffect } from 'react'
import './App.css'
import SettlementsList from './data/settlements.json';

function RandInt(max) {
  return Math.floor(Math.random() * max);
}

function GetSettlement(settle){
  let newSettlement, top, bottom;
  do{
    newSettlement = SettlementsList[RandInt(SettlementsList.length)];

    top = settle.gps.split(" ")[1].replace(")", "");
    bottom = newSettlement.gps.split(" ")[1].replace(")", "");
  }
  while (Math.abs(top-bottom) < 0.05)


  return [settle, newSettlement];
}

function App() {
  const [settlements, setSettlements] = useState(GetSettlement(SettlementsList[RandInt(SettlementsList.length)]));
  const [streak, setStreak] = useState(0);

  function Choice(north){
    let top = settlements[0].gps.split(" ")[1].replace(")", "");
    let bottom = settlements[1].gps.split(" ")[1].replace(")", "");

    if (!north && top < bottom)
      setStreak(streak + 1);
    else if (north && top > bottom)
      setStreak(streak + 1);
    else
      setStreak(0);

    setSettlements(GetSettlement(settlements[1]))
  }
  
  return (
    <div dir="rtl" className="App">
      <header className="App-header">
        <p className="title">משחק הצפון-דרום</p>
        <p className="streak">ניקוד: {streak}</p>
        <div className='wrapper'>
          <div className="left">
            <h1 onClick={() => {Choice(true)}}>{settlements[0].cityLabel}  </h1>
          </div>
          <div className="right">
              <h1 onClick={() => {Choice(false)}}>{settlements[1].cityLabel}</h1>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
