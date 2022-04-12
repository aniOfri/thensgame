import { useState, useEffect } from 'react'
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

function Unfresh(sett, lastRound){
  if (lastRound[0] == null)
    return false;
  else{
    let refreshed = false;
    for (let i=0; i<lastRound.length; i++){
      if (sett == lastRound[i]) refreshed = true;
    }

    return refreshed;
  }
}

function calcCrow(lat1, lon1, lat2, lon2) {
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

function toRad(Value)  {
      return Value * Math.PI / 180;
}

function getClosest(dest, list, minDist=0.04){
  let closest, mostClosest, mostClosestLongt=minDist, mostClosestLat=minDist;
  let longt1, longt2, lat1, lat2;
  let i = 0;
  let distExt = 0;

  let run = true;
  do{
    closest = list[i];

    if (closest.population > 10000){
      longt1 = dest.gps.split(" ")[1].replace(")", "");
      longt2 = closest.gps.split(" ")[1].replace(")", "");

      lat1 = dest.gps.split("(")[1].split(" ")[0];
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
      i=0;

      if (mostClosest != undefined){
        run = false;
      }
    }
  }
  while (run)

  return mostClosest;
}

function getCity(list){
  return list[RandInt(list.length)];
}
function GetSettlement(lastRound){
  const minDist = 0.04;
  const maxDist = 0.06;
  const list = SettlementsList;

  let setts=[], mostClosest, longt1, longt2, lat1, lat2;

  do{
    setts[0] = getCity(list);
  }
  while(setts[0].population < 10000 || Unfresh(setts[0], lastRound))

  for (let j = 1; j < 7; j++){
  do{
      do{
        setts[j] = getCity(list);
      }
      while(setts[j].population < 10000 || Duplicates(setts, j) || Unfresh(setts[j], lastRound))

      longt1 = setts[0].gps.split(" ")[1].replace(")", "");
      longt2 = setts[j].gps.split(" ")[1].replace(")", "");
      
      lat1 = setts[0].gps.split("(")[1].split(" ")[0];
      lat2 = setts[j].gps.split("(")[1].split(" ")[0];

    }
    while (Math.abs(longt1-longt2) < maxDist || Math.abs(lat1-lat2) < maxDist)
  }

  mostClosest = getClosest(setts[0], list, minDist);

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
  const [settlements, setSettlements] = useState(GetSettlement([null]));
  const [choice, setChoice] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [pause, setPause] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
}

useEffect(() => {
  window.addEventListener('resize', handleWindowSizeChange);
  return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
  }
}, []);

function Choice(choice){
    setChoice(choice);

    setCorrect(true)
    if (choice==1 && settlements[1] == 1){
      setStreak(streak + 1);
    }
    else if (choice==2 && settlements[1] == 2){
      setStreak(streak + 1);
    }
    else if (choice==3 && settlements[1] == 3){
      setStreak(streak + 1);
    }
    else if (choice==4 && settlements[1] == 4){
      setStreak(streak + 1);
    }
    else if (choice==5 && settlements[1] == 5){
      setStreak(streak + 1);
    }
    else if (choice==6 && settlements[1] == 6){
      setStreak(streak + 1);
    }
    else{
      setCorrect(false)
    }

    setPause(true);
  }

  function nextRound(){
    setSettlements(GetSettlement(settlements[0]))
    setPause(false);
    if (!correct)
      setStreak(0);
  }

  function Sentence(orig, dest){
    let longt1 = orig.gps.split(" ")[1].replace(")", "");
    let longt2 = dest.gps.split(" ")[1].replace(")", "");
    let vert = longt1-longt2;

    let lat1 = orig.gps.split("(")[1].split(" ")[0];
    let lat2 = dest.gps.split("(")[1].split(" ")[0];
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

    return "נמצאת "+keyword+" בערך "+Math.round(calcCrow(lat1, longt1, lat2, longt2))+" ק\"מ מ"+dest.cityLabel;
  }

  if (pause){
    let closestLargeSettlement = getClosest(settlements[0][0], LargeSettlementsList)
    let sentence1;
    if (closestLargeSettlement.cityLabel != settlements[0][settlements[1]].cityLabel)
      sentence1 = "ו"+ Sentence(settlements[0][0], closestLargeSettlement);
    else
      sentence1 = "";
    
    let sentence2 = Sentence(settlements[0][0], settlements[0][settlements[1]]);
  
    let indicator = "fail", answer = "לא נכונה.. נפסלת.";
    if (correct){
      indicator = "success"
      answer = "נכונה! +נקודה!"
    }

    const isMobile = width <= 768;

    let information;
    if (isMobile){
        indicator += " indicatorMobile";
        information = "infoMobile";
    }
    else{
      information = "infoHorz";
    }

    return (
      <div dir="rtl" className="App" onClick={()=>{
        nextRound()}}>
      <header className="App-header">
        <p className="title">איזה עיר יותר קרובה?</p>
        <p className="streak">ניקוד: {streak}</p>
        <div className='wrapper center'>
          <p className={indicator}>{settlements[0][choice].cityLabel} היא תשובה {answer}</p>
          <h1 className={information}>{settlements[0][0].cityLabel}.. <br></br>{sentence2}<br></br> {sentence1}</h1><br></br>
          <p>{}</p>
        </div>
      </header>
    </div>
    )
  }
else{
  const isMobile = width <= 768;

  let firstClass, secondClass, thirdClass, wrapper;
  if (isMobile){
      firstClass = "top";
      secondClass = "middleVert";
      thirdClass = "bottom";
      wrapper = "wrapper mobile";
  }
  else{
    firstClass = "left";
    secondClass = "middle";
    thirdClass = "right";
    wrapper = "wrapper horz";
  }
  return (
    <div dir="rtl" className="App">
      <header className="App-header">
        <p className="title">איזה עיר יותר קרובה?</p>
        <p className="streak">ניקוד: {streak}</p>
        <h1 className="titleCity">איזה עיר יותר קרובה ל:<br></br> {settlements[0][0].cityLabel}</h1>
        <div className={wrapper}>
          <div className={firstClass}>
            <h1 onClick={() => {Choice(1)}}>{settlements[0][1].cityLabel}  </h1><br></br>
            <h1 onClick={() => {Choice(2)}}>{settlements[0][2].cityLabel}  </h1>
          </div>
          <div className={secondClass}>
            <h1 onClick={() => {Choice(3)}}>{settlements[0][3].cityLabel}  </h1><br></br>
            <h1 onClick={() => {Choice(4)}}>{settlements[0][4].cityLabel}  </h1>
          </div>
          <div className={thirdClass}>
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
