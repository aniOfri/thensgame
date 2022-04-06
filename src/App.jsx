import { useState, useEffect } from 'react'
import './App.css'
import SettlementsList from './data/data2.json';

function RandInt(max) {
  return Math.floor(Math.random() * max);
}

function GetSettlement(){
  let newSettlement1, newSettlement2,   newSettlement3, closest, mostClosest, mostClosestLongt=0.04, mostClosestLat=0.04, longt1, longt2, lat1, lat2;

  do{
    do
      newSettlement1 = SettlementsList[RandInt(SettlementsList.length)];
    while(newSettlement1.population < 10000)

    do
    newSettlement2 = SettlementsList[RandInt(SettlementsList.length)];
    while(newSettlement2.population < 10000)

    longt1 = newSettlement1.gps.split(" ")[1].replace(")", "");
    longt2 = newSettlement2.gps.split(" ")[1].replace(")", "");
    
    lat1 = newSettlement1.gps.split("(")[1].split(" ")[0];
    lat2 = newSettlement2.gps.split("(")[1].split(" ")[0];

  }
  while (Math.abs(longt1-longt2) < 0.06 || Math.abs(lat1-lat2) < 0.06)

  let i = 0;
  let distExt = 0;
  do{
    closest = SettlementsList[i];

    if (closest.population < 10000){
        
      longt1 = newSettlement1.gps.split(" ")[1].replace(")", "");
      longt2 = closest.gps.split(" ")[1].replace(")", "");

      lat1 = newSettlement1.gps.split("(")[1].split(" ")[0];
      lat2 = closest.gps.split("(")[1].split(" ")[0];

      if (Math.abs(longt1-longt2) < mostClosestLongt && Math.abs(lat1-lat2) < mostClosestLat && Math.abs(longt1-longt2) > 0)
      {
          mostClosest = closest;
          mostClosestLongt = Math.abs(longt1-longt2);
          mostClosestLat = Math.abs(lat1-lat2);
      }
    }
    i+=1;
    if (i > SettlementsList.length-1){
      distExt += 0.01;
      mostClosestLat = 0.04+distExt;
      mostClosestLongt = 0.04+distExt;
      i=0
    }
    console.log(i)
  }
  while ((Math.abs(longt1-longt2) > 0.04+distExt || Math.abs(lat1-lat2) > 0.04+distExt || longt1==longt2))

  console.log(Math.abs(longt1-longt2),  Math.abs(lat1-lat2))
  let rnd = RandInt(2)+1
  if (rnd == 1){
    newSettlement3 = newSettlement2;
    newSettlement2 = mostClosest;
  }
  else newSettlement3 = closest;


  return [newSettlement1, newSettlement2, newSettlement3, rnd];
}

function App() {
  const [settlements, setSettlements] = useState(GetSettlement());
  //const [chosen, setChosen] = useState(null);
  const [streak, setStreak] = useState(0);
  //const [pause, setPause] = useState(false);

  function Choice(first){

    console.log(settlements[3])
    if (first && settlements[3] == 1)
      setStreak(streak + 1);
    else if (!first && settlements[3] == 2)
      setStreak(streak + 1);
    else
      setStreak(0);

      
    setSettlements(GetSettlement())
    //setPause(true);
  }


  /*if (pause){
    return (
      <div dir="rtl" className="App" onClick={()=>{
        nextRound()}}>
      <header className="App-header">
        <p className="streak">ניקוד: {streak}</p>
        <div className='wrapper'>
          <h1  >{chosen.cityLabel}</h1>
        </div>
          <p href={"https://he.wikipedia.org/wiki/"+chosen.cityLabel}>{chosen.info}</p>
      </header>
    </div>
    )
  }*/

  return (
    <div dir="rtl" className="App">
      <header className="App-header">
        <p className="title">איזה עיר יותר קרובה?</p>
        <p className="streak">ניקוד: {streak}</p>
        <h1 className="titleCity">{settlements[0].cityLabel}</h1>
        <div className='wrapper'>
          <div className="left">
            <h1 onClick={() => {Choice(true)}}>{settlements[1].cityLabel}  </h1>
            
          </div>
          <div className="right">
              <h1 onClick={() => {Choice(false)}}>{settlements[2].cityLabel}</h1>
            
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
