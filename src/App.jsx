import { useState, useEffect } from 'react'
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Switch from 'react-switch/dist/react-switch.dev.js'
import './App.css'
import SettlementsList from './data/settlements.json';
import LargeSettlementsList from './data/largesettlements.json';
import settingsLogo from './settings.png';
import closeLogo from './x.png';

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

function getClosest(dest, list, minDist=0.04, score=0){
  let closest, mostClosest, mostClosestLongt=minDist, mostClosestLat=minDist;
  let longt1, longt2, lat1, lat2;
  let i = 0;
  let distExt = 0;

  if (score > 50)
    score = 50;

  let run = true;
  do{
    closest = list[i];

    if (closest.population > 50000 - score*1000){
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
function GetSettlement(lastRound, score, lastSetts, minPop){
  const minDist = 0.04+score/1000;
  const maxDist = 0.06+score/1000;
  const list = SettlementsList;

  let setts=[], mostClosest, longt1, longt2, lat1, lat2;

  if (score > 50)
    score = 50;

  do{
    setts[0] = getCity(list);
  }
  while(setts[0].population < minPop - score*1000 || Unfresh(setts[0], lastRound) || Unfresh(setts[0], lastSetts))

  for (let j = 1; j < 7; j++){
  do{
      do{
        setts[j] = getCity(list);
      }
      while(setts[j].population < 50000 - score*1000 || Duplicates(setts, j) || Unfresh(setts[j], lastRound))

      longt1 = setts[0].gps.split(" ")[1].replace(")", "");
      longt2 = setts[j].gps.split(" ")[1].replace(")", "");
      
      lat1 = setts[0].gps.split("(")[1].split(" ")[0];
      lat2 = setts[j].gps.split("(")[1].split(" ")[0];

    }
    while (Math.abs(longt1-longt2) < maxDist || Math.abs(lat1-lat2) < maxDist)
  }

  mostClosest = getClosest(setts[0], list, minDist, score);

  let index;
  index = setts.indexOf(mostClosest);
  if (index == -1)
  {
      index = RandInt(4)+1
      setts[index] = mostClosest;
  }

  return [setts, index];
}

function checkCookies(){
  const COOKIES = ["Score", "Highscore", "MinPop", "Timer"];

  return COOKIES.some(v => !document.cookie.includes(v));
}

function createCookies(){
  document.cookie = "Score=0";
  document.cookie = "Highscore=0";
  document.cookie = "Timer=false";
  document.cookie = "MinPop=0";
}

function App() {
  if (checkCookies())
  createCookies();

  const COOKIES = document.cookie
                  .split(';')
                  .reduce((res, c) => {
                    const [key, val] = c.trim().split('=').map(decodeURIComponent)
                    try {
                      return Object.assign(res, { [key]: JSON.parse(val) })
                    } catch (e) {
                      return Object.assign(res, { [key]: val })
                    }
                  }, {})

  
  let lastscore = parseInt(COOKIES["Score"]);
  const [streak, setStreak] = useState(lastscore);
  const [lastSettlements, setLastSetts] = useState([null]);
  const [timerEnabled, setTimerEnabled] = useState(COOKIES["Timer"]);
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [minPop, setMinPop] = useState(0);
  const [settlements, setSettlements] = useState(GetSettlement([null], streak, lastSettlements, minPop));
  const [choice, setChoice] = useState(0);
  const [correct, setCorrect] = useState(true);
  const [pause, setPause] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [settings, setSettings] = useState(false);
  const [menu, setMenu] = useState(true);


function handleWindowSizeChange() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
}

useEffect(() => {
  window.addEventListener('resize', handleWindowSizeChange);
  return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
  }
}, []);

useEffect(() => {
  let interval = null;

  if (isActive) {
    interval = setInterval(() => {
      setTime((time) => time + 10);
    }, 10);
  } else {
    clearInterval(interval);
  }
  return () => {
    clearInterval(interval);
  };
}, [isActive]);

function updateLastSettlements(lastPlay){
  let lastSetts = lastSettlements;
  if (lastSetts[0] == null)
    lastSetts[0] = lastPlay;
  else
    lastSetts.push(lastPlay);

  if (lastSetts.length > 20)
    lastSetts.shift();
  
  setLastSetts(lastSetts);
}

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
      setCorrect(false);
      setIsActive(false);
    }

    setPause(true);
  }

  function nextRound(){
    setSettlements(GetSettlement(settlements[0], streak, lastSettlements, minPop))
    setPause(false);
    updateLastSettlements(settlements[0][0]);
    if (!correct){
      setMenu(true);
      setStreak(0);
      document.cookie = "Score=0";
      setCorrect(true);
    }
  }

  function handleMinPop(e){
    setMinPop(e.target.value);
    document.cookie = "MinPop="+minPop;
  }

  function handleTimer(e){
    setTimerEnabled(e);
    setStreak(0);
    document.cookie = "Score=0";
    document.cookie = "Timer="+timerEnabled;
  }

  function Sentence(orig, dest){
    let longt1 = orig.gps.split(" ")[1].replace(")", "");
    let longt2 = dest.gps.split(" ")[1].replace(")", "");
    let vert = longt1-longt2;

    let lat1 = orig.gps.split("(")[1].split(" ")[0];
    let lat2 = dest.gps.split("(")[1].split(" ")[0];
    let horz = lat1-lat2;

    let slope = vert/horz;
    let keyword = "";
    
    if (longt2 > longt1){ 
      if (slope > 0 && slope < 0.2)
        keyword = "מערבה";
      else if (slope > 0.2 && slope < 5)
        keyword = "דרום מערבה";
      else if (slope > 5 || slope < -5)
        keyword = "דרומה";
      else if (slope > -5 && slope < -0.2)
        keyword = "דרום מזרחה";
      else if (slope > -0.2 && slope < 0)
        keyword = "מזרחה"
    }
    else{
      if (slope > 0 && slope < 0.2)
        keyword = "מזרחה";
      else if (slope > 0.2 && slope < 5)
        keyword = "צפון מזרחה";
      else if (slope > 5 || slope < -5)
        keyword = "צפונה";
      else if (slope > -5 && slope < -0.2)
        keyword = "צפון מערבה";
      else if (slope > -0.2 && slope < 0)
        keyword = "מערבה"
    }

    return "נמצאת בערך "+Math.round(calcCrow(lat1, longt1, lat2, longt2))+" ק\"מ " +keyword+" מ"+dest.cityLabel;
  }

  function startGame(){
    setMenu(false);
    if (timerEnabled){
      setTime(0);
      setIsActive(true);
    }
  }

  if (!timerEnabled)
    document.cookie = "Score="+streak;
  document.cookie = "MinPop="+minPop;
  document.cookie = "Timer="+timerEnabled;

  if (settings){
    let popValue = parseInt(COOKIES["MinPop"]);
    return (
      <div dir="rtl" className="App">
      <header className="App-header">
      <img src={closeLogo} className="closeImage" onClick={() => {setSettings(!settings)}}></img>
        <h1>הגדרות</h1>
        <div className="setting">
          <div className="text">
            אוכלוסיה מינימלית
            <p className="smallText">קביעת האוכלוסיה המינימלית של כל עיר במשחק</p>
          </div>
          <div className="controller">
            <Slider value={popValue} min={0} max={50000} step={1000} valueLabelDisplay="auto" onChange={handleMinPop}/>
          </div>
        </div>
        <div className="setting"><br></br>
          <div className="text">
            טיימר
            <p className="smallText">שחק את המשחק על זמן ובדוק כמה אתה מהיר</p>
            <p className="smallText">(בשימוש בטיימר הניקוד לא ישמר וכל ניקוד שמור יתאפס)</p>
          </div>
          <div className="controller">
          <Switch onColor="#86d3ff" onHandleColor="#2693e6" uncheckedIcon={false} checkedIcon={false} checked={timerEnabled} onChange={handleTimer}/>
          </div>
        </div>
        <div className="footer">
          <p dir="ltr" >© 2022 Ofri Gutman</p>
      </div>
      </header>
    </div>
    )
  }
  else if (menu){
    let mode = "התחל משחק!";
    if (streak > 0)
      mode = "המשך משחק! (ניקוד: " +streak+")";
    return (
      <div dir="rtl" className="App" onClick={()=>{
        nextRound()}}>
      <header className="App-header">
        <img src={settingsLogo} className="settingsImage" onClick={() => {setSettings(!settings)}}></img>
        <h1 className="menuTitle">איזו עיר יותר קרובה?</h1>
        <Button className="startButton" variant="outlined" onClick={() => {startGame()}}> {mode}</Button>
      </header>
    </div>
    )
  }
  else if (pause){
    let closestLargeSettlement = getClosest(settlements[0][0], LargeSettlementsList, 0.04, streak)
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

    let highscore = ""
    let timeShow = ""
    if (indicator == "fail"){
      if (streak > parseInt(COOKIES["Highscore"])){
        document.cookie = "Highscore="+streak;
      }
      highscore = "הניקוד הכי גבוה שלך הוא: "+COOKIES["Highscore"];
      if (timerEnabled)
      {
          timeShow = (
            <div className="timer">
              זמנים: 
            <span className="digits">
                {" "+("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
            </span>
            <span className="digits">
              {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
            </span>
            <span className="digits mili-sec">
              {("0" + ((time / 10) % 100)).slice(-2)}
            </span>
          </div>
          )
      }
      else{
        timeShow = "";
      }
    }

    const isMobile = width <= 520;

    let information;
    if (isMobile){
        indicator += " indicatorMobile"
        information = "infoMobile";
    }
    else{
      information = "infoHorz";
    }
  
  return (
      <div dir="rtl" className="App" onClick={()=>{
        nextRound()}}>
      <header className="App-header">
        <p className="title">איזו עיר יותר קרובה?</p>
        <p className="streak">{highscore} <br></br>  ניקוד:  {streak} <br></br>  {timeShow}</p>

        <div className='wrapperPause center'>
          <p className={indicator}>{settlements[0][choice].cityLabel} היא תשובה {answer}</p>
          <h1 className={information}>{settlements[0][0].cityLabel}.. <br></br>{sentence2}<br></br> {sentence1}</h1><br></br>
        </div>
      </header>
    </div>
    )
  }
else{
  const isMobile = width <= 520;
  const mobileHeight = height <= 600;

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

  if (mobileHeight){
    wrapper += " sizeDownText";
  }

  let timeShow;
  if (timerEnabled)
  {
      timeShow = (
        <div className="timer">
        <span className="digits">
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
        </span>
        <span className="digits">
          {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
        </span>
        <span className="digits mili-sec">
          {("0" + ((time / 10) % 100)).slice(-2)}
        </span>
      </div>
      )
  }
  else{
    timeShow = ("");
  }

  return (
    <div dir="rtl" className="App">
      <header className="App-header">
        
        <p className="title">איזו עיר יותר קרובה?</p>
        <p className="streak">ניקוד: {streak}</p>
        {timeShow}
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
