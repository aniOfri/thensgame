import { useState } from 'react'
import './App.css'
import SettlementsList from './data/settlements.json';
import LargeSettlementsList from './data/largesettlements.json';

function RandInt(max) {
  return Math.floor(Math.random() * max);
}

function Duplicates(setts, j){
  let duplicate = false;
  for (let i = 1; i < j; i++){
    if (setts[i] == setts[j]) duplicate = true;
  }

  return duplicate;
}

function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

  function toRad(Value) 
  {
      return Value * Math.PI / 180;
  }

function getCity(list){
  return list[RandInt(list.length)];
}
function GetSettlement(){
  const minDist = 0.04;
  const maxDist = 0.06;
  let list = SettlementsList;

  let setts=[], closest, mostClosest, mostClosestLongt=minDist, mostClosestLat=minDist, longt1, longt2, lat1, lat2;

  setts[0] = getCity(list);
  
  for (let j = 1; j < 7; j++){
  do{
      do{
        setts[j] = getCity(list);
      }
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

  let index;
  index = setts.indexOf(mostClosest);
  if (index == -1)
  {
      index = RandInt(4)+1
      setts[index] = mostClosest;
  }

  return [setts, index];
}

function App() {
  const [settlements, setSettlements] = useState(GetSettlement());
  //const [chosen, setChosen] = useState(null);
  const [streak, setStreak] = useState(0);
  const [pause, setPause] = useState(false);

  function Choice(choice){

    if (choice==1 && settlements[1] == 1)
      setStreak(streak + 1);
    else if (choice==2 && settlements[1] == 2)
      setStreak(streak + 1);
    else if (choice==3 && settlements[1] == 3)
      setStreak(streak + 1);
    else if (choice==4 && settlements[1] == 4)
      setStreak(streak + 1);
    else if (choice==5 && settlements[1] == 5)
      setStreak(streak + 1);
    else if (choice==6 && settlements[1] == 6)
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
    let longt1 = settlements[0][0].gps.split(" ")[1].replace(")", "");
    let longt2 = settlements[0][settlements[1]].gps.split(" ")[1].replace(")", "");
    let vert = longt1-longt2;

    let lat1 = settlements[0][0].gps.split("(")[1].split(" ")[0];
    let lat2 = settlements[0][settlements[1]].gps.split("(")[1].split(" ")[0];
    let horz = lat1-lat2;

    let keyword = ""
    if (vert > 0){
      keyword = "צפונה";
      if (Math.abs(vert) < Math.abs(horz) && horz > 0){
        keyword="מזרחה";
      }
      else if (Math.abs(vert) < Math.abs(horz) && horz < 0)
      {
        keyword="מערבה";
      }
    }
    else{
      keyword="דרומה";
      if (Math.abs(vert) < Math.abs(horz) && horz > 0){
        keyword="מזרחה";
      }
      else if (Math.abs(vert) < Math.abs(horz) && horz < 0)
      {
        keyword="מערבה";
      }
    }
  
    return (
      <div dir="rtl" className="App" onClick={()=>{
        nextRound()}}>
      <header className="App-header">
        <p className="title">איזה עיר יותר קרובה?</p>
        <p className="streak">ניקוד: {streak}</p>
        <div className='wrapper center'>
          <h1>{settlements[0][0].cityLabel} {keyword} בערך {calcCrow(lat1, longt1, lat2, longt2).toFixed(2)} ק"מ מ{settlements[0][settlements[1]].cityLabel}</h1><br></br>
          <p>{}</p>
        </div>
      </header>
    </div>
    )
  }
else{
  console.log(settlements[0])
  
  return (
    <div dir="rtl" className="App">
      <header className="App-header">
        <p className="title">איזה עיר יותר קרובה?</p>
        <p className="streak">ניקוד: {streak}</p>
        <h1 className="titleCity">{settlements[0][0].cityLabel}</h1>
        <div className='wrapper'>
          <div className="left">
            <h1 onClick={() => {Choice(1)}}>{settlements[0][1].cityLabel}  </h1><br></br>
            <h1 onClick={() => {Choice(2)}}>{settlements[0][2].cityLabel}  </h1>
          </div>
          <div className="middle">
            <h1 onClick={() => {Choice(3)}}>{settlements[0][3].cityLabel}  </h1><br></br>
            <h1 onClick={() => {Choice(4)}}>{settlements[0][4].cityLabel}  </h1>
          </div>
          <div className="right">
              <h1 onClick={() => {Choice(5)}}>{settlements[0][5].cityLabel}</h1><br></br>
              <h1 onClick={() => {Choice(6)}}>{settlements[0][6].cityLabel}</h1>
          </div>
        </div>
      </header>
    </div>
  )
}
}

export default App
