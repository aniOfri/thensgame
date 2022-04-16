// CSS
import './App.css'

// Components
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Switch from 'react-switch/dist/react-switch.dev.js'
import Game from './components/game';

// Data
import settingsLogo from './settings.png';
import closeLogo from './x.png';

// Modules
import { useState } from 'react'
import { checkCookies, createCookies } from './Modules/Cookies';

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


  const [timerEnabled, setTimerEnabled] = useState(COOKIES["Timer"]);
  const [isActive, setIsActive] = useState(false);
  const [minPop, setMinPop] = useState(parseInt(COOKIES["MinPop"]));

  const [settings, setSettings] = useState(false);
  const [menu, setMenu] = useState(true);

  function handleMinPop(e) {
    setMinPop(e.target.value);
    document.cookie = "MinPop=" + minPop;
  }

  function handleTimer(e) {
    setTimerEnabled(e);
    document.cookie = "Score=0";
    document.cookie = "Timer=" + timerEnabled;
  }

  function startGame() {
    setMenu(false);
    if (timerEnabled) {
      setIsActive(true);
    }
  }

  if (settings) {
    document.cookie = "MinPop=" + minPop;
    document.cookie = "Timer=" + timerEnabled;

    return (
      <div dir="rtl" className="App">
        <header className="App-header">
          <img src={closeLogo} className="closeImage" onClick={() => { setSettings(!settings) }}></img>
          <h1>הגדרות</h1>
          <div className="setting">
            <div>אוכלוסיה מינימלית
              <p className="smallText">קביעת האוכלוסיה המינימלית של כל עיר במשחק</p>
            </div>
            <div className="controller">
              <Slider value={minPop} min={0} max={50000} step={1000} valueLabelDisplay="auto" onChange={handleMinPop} />
            </div>
          </div>
          <div className="setting">
            <div>טיימר
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
    if (COOKIES["streak"] > 0)
      mode = "המשך משחק! (ניקוד: " + COOKIES["streak"] + ")";
    return (
      <div dir="rtl" className="App">
        <header className="App-header">
          <img src={settingsLogo} className="settingsImage" onClick={() => { setSettings(!settings) }}></img>
          <h1 className="menuTitle">איזו עיר יותר קרובה?</h1>
          <Button className="startButton" variant="outlined" onClick={() => { startGame() }}> {mode}</Button>
        </header>
      </div>
    )
  }
  else {
    return (
      <div dir="rtl" className="App">
        <header className="App-header">
          <p className="title">איזו עיר יותר קרובה?</p>
          <Game cookies={COOKIES} minPop={minPop} isActive={isActive} timerEnabled={timerEnabled} setIsActive={setIsActive} setMenu={setMenu} />
        </header>
      </div>
    )
  }
}

export default App;
