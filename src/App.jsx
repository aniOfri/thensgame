import { useState, useEffect } from 'react'
import './App.css'
import SettlementsList from './data/settlements.json';
import LargeSettlementsList from './data/largesettlements.json';

function RandInt(max) {
  return Math.floor(Math.random() * max);
}


function Duplicates(setts, j){
  let duplicate = false;
  for (let i = 0; i < j; i++)
    if (setts[i] == setts[j]) duplicate = true;

  return duplicate;
}

function getCity(list){
  return list[RandInt(list.length)];
}
function GetSettlement(){
  const minDist = 0.04;
  const maxDist = 0.06;
  let list = LargeSettlementsList;

  let setts=[], closest, mostClosest, mostClosestLongt=minDist, mostClosestLat=minDist, longt1, longt2, lat1, lat2;

  setts[0] = getCity(list);
  
  for (let j = 1; j < 5; j++){
  do{
      do
        setts[j] = getCity(list);
      while(setts[j].population < 10000 || Duplicates(setts, j))

      longt1 = setts[0].gps.split(" ")[1].replace(")", "");
      longt2 = setts[j].gps.split(" ")[1].replace(")", "");
      
      lat1 = setts[0].gps.split("(")[1].split(" ")[0];
      lat2 = setts[j].gps.split("(")[1].split(" ")[0];

    }
    while (Math.abs(longt1-longt2) < maxDist || Math.abs(lat1-lat2) < maxDist)
  }

  let i = 0;
  let distExt = 0;
  do{
    closest = list[i];

    if (closest.population > 10000){
        
      longt1 = setts[0].gps.split(" ")[1].replace(")", "");
      longt2 = closest.gps.split(" ")[1].replace(")", "");

      lat1 = setts[0].gps.split("(")[1].split(" ")[0];
      lat2 = closest.gps.split("(")[1].split(" ")[0];

      if (Math.abs(longt1-longt2) < mostClosestLongt && Math.abs(lat1-lat2) < mostClosestLat && Math.abs(longt1-longt2) > 0)
      {
          mostClosest = closest;
          mostClosestLongt = Math.abs(longt1-longt2);
          mostClosestLat = Math.abs(lat1-lat2);
      }
    }
    i+=1;
    if (i > list.length-1){
      distExt += .01;
      mostClosestLat = minDist+distExt;
      mostClosestLongt = minDist+distExt;
      i=0
    }
  }
  while ((Math.abs(longt1-longt2) > minDist+distExt || Math.abs(lat1-lat2) > minDist+distExt || longt1==longt2))

  let rnd = RandInt(4)+1
  setts[rnd] = mostClosest;

  return [setts[0], setts[1], setts[2], setts[3], setts[4], rnd];
}

function App() {
  const [settlements, setSettlements] = useState(GetSettlement());
  //const [chosen, setChosen] = useState(null);
  const [streak, setStreak] = useState(0);
  const [pause, setPause] = useState(false);

  function Choice(choice){

    if (choice==1 && settlements[5] == 1)
      setStreak(streak + 1);
    else if (choice==2 && settlements[5] == 2)
      setStreak(streak + 1);
    else if (choice==3 && settlements[5] == 3)
      setStreak(streak + 1);
    else if (choice==4 && settlements[5] == 4)
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
      <div dir="rtl" className="App" onClick={()=>{
        nextRound()}}>
      <header className="App-header">
        <p className="title">איזה עיר יותר קרובה?</p>
        <p className="streak">ניקוד: {streak}</p>
        <div className='wrapper center'>
          <h1>{settlements[0].cityLabel} ⟷ {settlements[settlements[5]].cityLabel}</h1>
        </div>
      </header>
    </div>
    )
  }

  return (
    <div dir="rtl" className="App">
      <header className="App-header">
        <p className="title">איזה עיר יותר קרובה?</p>
        <p className="streak">ניקוד: {streak}</p>
        <h1 className="titleCity">{settlements[0].cityLabel}</h1>
        <div className='wrapper'>
          <div className="left">
            <h1 onClick={() => {Choice(1)}}>{settlements[1].cityLabel}  </h1><br></br>
            <h1 onClick={() => {Choice(2)}}>{settlements[2].cityLabel}  </h1>
          </div>
          <div className="right">
              <h1 onClick={() => {Choice(3)}}>{settlements[3].cityLabel}</h1><br></br>
              <h1 onClick={() => {Choice(4  )}}>{settlements[4].cityLabel}</h1>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
