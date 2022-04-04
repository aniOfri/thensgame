import { useState, useEffect } from 'react'
import './App.css'
import SettlementsList from './data/data.json';

function RandInt(max) {
  return Math.floor(Math.random() * max);
}

function GetSettlement(){
  let newSettlement1, newSettlement2, top, bottom;
  do{
    newSettlement1 = SettlementsList[RandInt(SettlementsList.length)];
    newSettlement2 = SettlementsList[RandInt(SettlementsList.length)];

    top = newSettlement1.gps.split(" ")[1].replace(")", "");
    bottom = newSettlement2.gps.split(" ")[1].replace(")", "");
  }
  while (Math.abs(top-bottom) < 0.05)


  return [newSettlement1, newSettlement2];
}

function App() {
  const [settlements, setSettlements] = useState(GetSettlement());
  const [chosen, setChosen] = useState(null);
  const [streak, setStreak] = useState(0);
  const [pause, setPause] = useState(false);

  function Choice(north){
    let top = settlements[0].gps.split(" ")[1].replace(")", "");
    let bottom = settlements[1].gps.split(" ")[1].replace(")", "");

    if (north)
      setChosen(settlements[0])
    else
      setChosen(settlements[1])

    if (!north && top < bottom)
      setStreak(streak + 1);
    else if (north && top > bottom)
      setStreak(streak + 1);
    else
      setStreak(0);

    setPause(true);
  }

  function nextRound(){
    setSettlements(GetSettlement())
    setPause(false);
  }

  if (pause){
    return (
      <div dir="rtl" className="App">
      <header className="App-header">
        <p className="title">משחק הצפון-דרום</p>
        <p className="streak">ניקוד: {streak}</p>
        <div className='wrapper'>
          <h1  onClick={()=>{
        nextRound()}}>{chosen.cityLabel}</h1>
        </div>
          <p href={"https://he.wikipedia.org/wiki/"+chosen.cityLabel}>{chosen.info}</p>
      </header>
    </div>
    )
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
