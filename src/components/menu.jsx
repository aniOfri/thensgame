// Components
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Switch from 'react-switch/dist/react-switch.dev.js'

// Data
import settingsLogo from '../data/settings.png';
import closeLogo from '../data/x.png';

// Modules
import { useState } from 'react'

function Settings(props) {
    function handleMinPop(e) {
        props.setMinPop(e.target.value);
        document.cookie = "MinPop=" + props.minPop;
    }

    function handleTimer(e) {
        props.setTimerEnabled(e);
        document.cookie = "Score=0";
        document.cookie = "Timer=" + props.timerEnabled;
    }

    function handleInfo(e) {
        props.setShowInfo(e);
        document.cookie = "ShowInfo=" + props.showInfo;
    }

    return (
        <div>
            <img src={closeLogo} className="closeImage" onClick={() => { props.setSettings(!props.settings) }}></img>
            <h1>הגדרות</h1>
            <div className="setting">
                <div>
                    <p className="settingTitle">אוכלוסיה מינימלית</p>
                    <p className="smallText">קביעת האוכלוסיה המינימלית של כל עיר במשחק</p>
                </div>
                <Slider className="controller" value={props.minPop} min={0} max={50000} step={1000} valueLabelDisplay="auto" onChange={handleMinPop} />
            </div>
            <div className="setting">
                <div>
                    <p className="settingTitle">טיימר</p>
                    <p className="smallText">שחק את המשחק על זמן ובדוק כמה אתה מהיר</p>
                    <p className="smallText">(בשימוש בטיימר הניקוד לא ישמר וכל ניקוד שמור יתאפס)</p>
                </div>
                <Switch className="controller" onColor="#86d3ff" onHandleColor="#2693e6" uncheckedIcon={false} checkedIcon={false} checked={props.timerEnabled} onChange={handleTimer} />
            </div>
            <div className="setting">
                <div>
                    <p className="settingTitle">מידע בדף ביניים</p>
                    <p className="smallText">הצג מידע נוסף על העיר בדף הביניים</p>
                </div>
                <Switch className="controller" onColor="#86d3ff" onHandleColor="#2693e6" uncheckedIcon={false} checkedIcon={false} checked={props.showInfo} onChange={handleInfo} />
            </div>
            <div className="footer">
                <p dir="ltr" >© 2022 Ofri Gutman</p>
            </div>
        </div>
    )
}

function Menu(props) {
    const [settings, setSettings] = useState(false);

    if (settings) {
        document.cookie = "MinPop=" + props.minPop;
        document.cookie = "Timer=" + props.timerEnabled;
        document.cookie = "ShowInfo=" + props.showInfo;

        return <Settings setShowInfo={props.setShowInfo} showInfo={props.showInfo} setMinPop={props.setMinPop} minPop={props.minPop} setTimerEnabled={props.setTimerEnabled} timerEnabled={props.timerEnabled} setSettings={setSettings} settings={settings} />
    }
    else {
        let mode = "משחק לבד";
        if (props.cookies["streak"] > 0)
            mode = "המשך משחק לבד (ניקוד: " + props.cookies["streak"] + ")";

        if (!props.isMultiplayer){
            return (
                <div>
                    <img src={settingsLogo} className="settingsImage" onClick={() => { setSettings(!settings) }}></img>
                    <h1 className="menuTitle">איזו עיר יותר קרובה?</h1><br></br>
                    <Button className="startButton" variant="outlined" onClick={() => { props.startGame() }}> {mode}</Button><br></br>
                    <Button className="startButton" variant="outlined" onClick={() => { props.startMultiplayer() }}> משחק רב משתתפים</Button>
                </div>
            );
        }
        else{
            return (
                <div>
                    <img src={closeLogo} className="closeImage" onClick={() => { props.setIsMultiplayer(false) }}></img>
                    <h1 className="menuTitle ">משחק רב משתתפים</h1>
                    <h5 className="menuSubTitle">הכנס שם ומספר חדר</h5>
                    שם:
                    <input type="text" onChange={(event) => {
                    setUsername(event.target.value)
                    }}></input><br></br>
                    חדר:
                    <input type="text" onChange={(event) => {
                    setRoom(event.target.value)
                    }}></input><br></br>
                    <button onClick={props.joinRoom()}>JOIN ROOM</button>
                </div>
            );
        }

    }
}

export default Menu;