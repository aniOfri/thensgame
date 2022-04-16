// CSS
import './App.css'

// Components
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Switch from 'react-switch/dist/react-switch.dev.js'

// Data
import settingsLogo from './settings.png';
import closeLogo from './x.png';
import LargeSettlementsList from './data/largesettlements.json';

// Modules
import { useState, useEffect } from 'react'
import { checkCookies, createCookies } from './Modules/Cookies';
import { calcCrow, timerHTML } from './Modules/Calculators';
import { GetSettlement, getClosest } from './Modules/Settlements'


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
  const [minPop, setMinPop] = useState(parseInt(COOKIES["MinPop"]));
  const [pairs, setPairs] = useState([]);
  const [settlements, setSettlements] = useState(GetSettlement([null], streak, lastSettlements, minPop, pairs));
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

  function updateLastSettlements(lastPlay) {
    let lastSetts = lastSettlements;
    if (lastSetts[0] == null)
      lastSetts[0] = lastPlay;
    else
      lastSetts.push(lastPlay);

    if (lastSetts.length > 20)
      lastSetts.shift();

    setLastSetts(lastSetts);
  }

  function Choice(choice) {
    setChoice(choice);

    setCorrect(true)
    if (choice == 1 && settlements[1] == 1) {
      setStreak(streak + 1);
    }
    else if (choice == 2 && settlements[1] == 2) {
      setStreak(streak + 1);
    }
    else if (choice == 3 && settlements[1] == 3) {
      setStreak(streak + 1);
    }
    else if (choice == 4 && settlements[1] == 4) {
      setStreak(streak + 1);
    }
    else if (choice == 5 && settlements[1] == 5) {
      setStreak(streak + 1);
    }
    else if (choice == 6 && settlements[1] == 6) {
      setStreak(streak + 1);
    }
    else {
      setCorrect(false);
      setIsActive(false);
    }

    setPause(true);
  }

  function addToPairs() {
    let allpairs = pairs;
    allpairs.push([settlements[0][0], settlements[0][settlements[1]]]);
    setPairs(allpairs);
  }

  function nextRound() {
    addToPairs();
    setSettlements(GetSettlement(settlements[0], streak, lastSettlements, minPop, pairs))
    setPause(false);
    updateLastSettlements(settlements[0][0]);
    if (!correct) {
      setPairs([]);
      setMenu(true);
      setStreak(0);
      document.cookie = "Score=0";
      setCorrect(true);
    }
  }

  function handleMinPop(e) {
    setMinPop(e.target.value);
    document.cookie = "MinPop=" + minPop;
  }

  function handleTimer(e) {
    setTimerEnabled(e);
    setStreak(0);
    document.cookie = "Score=0";
    document.cookie = "Timer=" + timerEnabled;
  }

  function Sentence(orig, dest) {
    let longt1 = orig.gps.split(" ")[1].replace(")", "");
    let longt2 = dest.gps.split(" ")[1].replace(")", "");
    let vert = longt1 - longt2;

    let lat1 = orig.gps.split("(")[1].split(" ")[0];
    let lat2 = dest.gps.split("(")[1].split(" ")[0];
    let horz = lat1 - lat2;

    let slope = vert / horz;
    let keyword = "";

    if (longt2 > longt1) {
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
    else {
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

    return "נמצאת בערך " + Math.round(calcCrow(lat1, longt1, lat2, longt2)) + " ק\"מ " + keyword + " מ" + dest.cityLabel;
  }

  function startGame() {
    setMenu(false);
    if (timerEnabled) {
      setTime(0);
      setIsActive(true);
    }
  }

  if (!timerEnabled)
    document.cookie = "Score=" + streak;
  document.cookie = "MinPop=" + minPop;
  document.cookie = "Timer=" + timerEnabled;

  if (settings) {
    return (
      <div dir="rtl" className="App">
        <header className="App-header">
          <img src={closeLogo} className="closeImage" onClick={() => { setSettings(!settings) }}></img>
          <h1>הגדרות</h1>
          <div className="setting">
            <div className="text">
              אוכלוסיה מינימלית
              <p className="smallText">קביעת האוכלוסיה המינימלית של כל עיר במשחק</p>
            </div>
            <div className="controller">
              <Slider value={minPop} min={0} max={50000} step={1000} valueLabelDisplay="auto" onChange={handleMinPop} />
            </div>
          </div>
          <div className="setting"><br></br>
            <div className="text">
              טיימר
              <p className="smallText">שחק את המשחק על זמן ובדוק כמה אתה מהיר</p>
              <p className="smallText">(בשימוש בטיימר הניקוד לא ישמר וכל ניקוד שמור יתאפס)</p>
            </div>
            <div className="controller">
              <Switch onColor="#86d3ff" onHandleColor="#2693e6" uncheckedIcon={false} checkedIcon={false} checked={timerEnabled} onChange={handleTimer} />
            </div>
          </div>
          <div className="footer">
            <p dir="ltr" >© 2022 Ofri Gutman</p>
          </div>
        </header>
      </div>
    )
  }
  else if (menu) {
    let mode = "התחל משחק!";
    if (streak > 0)
      mode = "המשך משחק! (ניקוד: " + streak + ")";
    return (
      <div dir="rtl" className="App" onClick={() => {
        nextRound()
      }}>
        <header className="App-header">
          <img src={settingsLogo} className="settingsImage" onClick={() => { setSettings(!settings) }}></img>
          <h1 className="menuTitle">איזו עיר יותר קרובה?</h1>
          <Button className="startButton" variant="outlined" onClick={() => { startGame() }}> {mode}</Button>
        </header>
      </div>
    )
  }
  else if (pause) {
    let closestLargeSettlement = getClosest(settlements[0][0], LargeSettlementsList, 0.04, streak)
    let sentence1;
    if (closestLargeSettlement.cityLabel != settlements[0][settlements[1]].cityLabel)
      sentence1 = "ו" + Sentence(settlements[0][0], closestLargeSettlement);
    else
      sentence1 = "";

    let sentence2 = Sentence(settlements[0][0], settlements[0][settlements[1]]);

    let indicator = "fail", answer = "לא נכונה.. נפסלת.";
    if (correct) {
      indicator = "success"
      answer = "נכונה! +נקודה!"
    }

    let highscore = ""
    let timeShow = ""
    if (indicator == "fail") {
      if (streak > parseInt(COOKIES["Highscore"])) {
        document.cookie = "Highscore=" + streak;
      }
      highscore = "הניקוד הכי גבוה שלך הוא: " + COOKIES["Highscore"];
      if (timerEnabled) {
        timeShow = (
          <div className="timer">
            זמנים:
            <span className="digits">
              {" " + ("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
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
      else {
        timeShow = "";
      }
    }

    const isMobile = width <= 520;

    let information;
    if (isMobile) {
      indicator += " indicatorMobile"
      information = "infoMobile";
    }
    else {
      information = "infoHorz";
    }

    return (
      <div dir="rtl" className="App" onClick={() => {
        nextRound()
      }}>
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
  else {
    const isMobile = width <= 520;
    const mobileHeight = height <= 600;

    let firstClass = isMobile ? "top" : "left";
    let secondClass = isMobile ? "middleVert" : "middle";
    let thirdClass = isMobile ? "bottom" : "right";
    let wrapper = isMobile ? "wrapper mobile" : "wrapper horz";
    wrapper += mobileHeight ? " sizeDownText" : "";

    return (
      <div dir="rtl" className="App">
        <header className="App-header">
          <p className="title">איזו עיר יותר קרובה?</p>
          <p className="streak">ניקוד: {streak}</p>
          {timerHTML(timerEnabled)}
          <h1 className="titleCity">איזו עיר יותר קרובה ל:<br></br> {settlements[0][0].cityLabel}</h1>
          <div className={wrapper}>
            <div className={firstClass}>
              <h1 onClick={() => { Choice(1) }}>{settlements[0][1].cityLabel}  </h1><br></br>
              <h1 onClick={() => { Choice(2) }}>{settlements[0][2].cityLabel}  </h1>
            </div>
            <div className={secondClass}>
              <h1 onClick={() => { Choice(3) }}>{settlements[0][3].cityLabel}  </h1><br></br>
              <h1 onClick={() => { Choice(4) }}>{settlements[0][4].cityLabel}  </h1>
            </div>
            <div className={thirdClass}>
              <h1 onClick={() => { Choice(5) }}>{settlements[0][5].cityLabel}</h1><br></br>
              <h1 onClick={() => { Choice(6) }}>{settlements[0][6].cityLabel}</h1>
            </div>
          </div>
        </header>
      </div>
    )
  }
}

export default App
