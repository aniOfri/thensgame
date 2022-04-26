// CSS
import './App.css'

// Components
import Menu from './components/menu';
import Game from './components/game';
import Cloud from './components/cloud';

// Modules
import { useEffect, useState } from 'react'
import { checkCookies, createCookies } from './modules/Cookies';
import io from 'socket.io-client';


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
  const [showInfo, setShowInfo] = useState(COOKIES["ShowInfo"]);
  const [minPop, setMinPop] = useState(parseInt(COOKIES["MinPop"]));
  const [isActive, setIsActive] = useState(false);
  const [menu, setMenu] = useState(true);

  // TEMPORARY
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [users, setUsers] = useState(0);
  const [host, setHost] = useState(false);
  const [dots, setDots] = useState(".");

  let socket;
  if (isMultiplayer)
    socket = io.connect("http://localhost:3000"); 

  async function joinRoom(){
    if (username !== "" && room !== ""){
      const data = {
        name: username,
        room: room
      }
      await socket.emit("join_room", data);
      setWaitingRoom(true);
    }
  }

  useEffect(() => {
    let interval = null;

    if (waitingRoom && users == 0) {
        interval = setInterval(() => {
            if (dots == ".")
              setDots("..");
            else if (dots == "..")
              setDots("...");
            else
              setDots(".");
        }, 1000);
    } else {
          interval = setInterval(() => {
            if (dots == ".")
              setDots("..");
            else if (dots == "..")
              setDots("...");
        }, 1000);
        clearInterval(interval);
    }
    return () => {
        clearInterval(interval);
    };
  }, [waitingRoom, dots]);

  useEffect(()=>{
    if (isMultiplayer){
      socket.on("current_users", (data) =>{
          setUsers(data);
      });
  }
  }, [socket, users]);

  useEffect(()=>{
    return async () =>{
        if (users == 0 && isMultiplayer)
          await socket.emit("request_users", room);
    }
  }, [socket, dots]);

  useEffect(()=>{
    if (isMultiplayer)  {
      if (users == 1)
        setHost(true);
      else if (users == 2)
      startGame();
    }   
  }, [socket, users, dots]);

  function startMultiplayer(){
    setIsMultiplayer(true);
  }

  function startGame() {
    setMenu(false);
    if (timerEnabled) {
      setIsActive(true);
    }
  }
  
  let jsx;
  if (menu) jsx = (<Menu users={users} dots={dots} cookies={COOKIES} waitingRoom={waitingRoom} setUsername={setUsername} setRoom={setRoom} joinRoom={joinRoom} isMultiplayer={isMultiplayer} setIsMultiplayer={setIsMultiplayer} setShowInfo={setShowInfo} startMultiplayer={startMultiplayer} showInfo={showInfo} setMinPop={setMinPop} minPop={minPop} setTimerEnabled={setTimerEnabled} timerEnabled={timerEnabled} startGame={startGame} />)
  else
    jsx = (<Game cookies={COOKIES} isMultiplayer={isMultiplayer} room={room} socket={socket} host={host} setShowInfo={setShowInfo} showInfo={showInfo} minPop={minPop} isActive={isActive} timerEnabled={timerEnabled} setIsActive={setIsActive} setMenu={setMenu} />)

  return (
    <div dir="rtl" className="App">
      <header className="App-header">
        <Cloud/>
        {jsx}
      </header>
    </div>
  );
}

export default App;
