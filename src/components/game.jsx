
// Data
import heart from '../data/heart.png';

// Modules
import { useState, useEffect } from 'react'
import { calcCrow, timerHTML } from '../modules/Calculators';
import { GetSettlement } from '../modules/Settlements'
import { useReward } from 'react-rewards';

function Game(props) {
    // Meta game related states
    const [streak, setStreak] = useState(parseInt(props.cookies["Score"]));
    const [time, setTime] = useState(0);
    const [health, setHealth] = useState(props.isHealth ? 3 : 1);
        
    // Game related states
    const [pause, setPause] = useState(false);
    const [pairs, setPairs] = useState([]);
    const [lastSettlements, setLastSetts] = useState([null]);
    const [settlements, setSettlements] = useState(GetSettlement([null], streak, lastSettlements, props.minPop, pairs));
    const [choice, setChoice] = useState(0);
    const [correct, setCorrect] = useState(true);

    // Aesthetics related states
    let rewardConfigConfetti = {
        lifetime: 100,
        spread: 150,
        zIndex: -1,
        decay: 0.95,
    }
    let rewardConfigBalloons = {
        lifetime: 200,
        spread: 100,
        startVelocity: 5,
        elementCount: 50,
        zIndex: -1,
        decay: 0.999,
    }
    const { reward: rewardConfetti, isAnimating: isAnimatingC } = useReward('rewardId', 'confetti', rewardConfigConfetti);
    const { reward: rewardBalloons, isAnimating: isAnimatingB } = useReward('rewardId', 'balloons', rewardConfigBalloons);


    useEffect(() => {
        if (props.timerEnabled || props.isMultiplayer){
            let interval = null;

            if (props.isActive) {
                interval = setInterval(() => {
                    setTime((time) => time + 10);
                    if (time >= 9990){
                        props.setIsActive(false);
                        Choice(7);
                    }

                }, 10);
            } else {
                clearInterval(interval);
            }
            return () => {
                clearInterval(interval);
            };
        }
    }, [props.isActive, props.isMultiplayer, time]);

    function Choice(choice) {
        props.setIsActive(false);
        setChoice(choice);

        let reward = () => {rewardConfetti()};
        if ((streak+1) % 10 == 0){
            reward = () => {rewardBalloons()};
        }

        setCorrect(true)
        if (choice == 1 && settlements[1] == 1) {
            setStreak(streak + 1);
            reward();
        }
        else if (choice == 2 && settlements[1] == 2) {
            setStreak(streak + 1);
            reward();
        }
        else if (choice == 3 && settlements[1] == 3) {
            setStreak(streak + 1);
            reward();
        }
        else if (choice == 4 && settlements[1] == 4) {
            setStreak(streak + 1);
            reward();
        }
        else if (choice == 5 && settlements[1] == 5) {
            setStreak(streak + 1);
            reward();
        }
        else if (choice == 6 && settlements[1] == 6) {
            setStreak(streak + 1);
            reward();
        }
        else {
            setCorrect(false);
        }

        setPause(true);
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

    function addToPairs() {
        let allpairs = pairs;
        allpairs.push([settlements[0][0], settlements[0][settlements[1]]]);
        setPairs(allpairs);
    }

    function nextRound() {
        setTime(0);
        props.setIsActive(true);
        addToPairs();
        setSettlements(GetSettlement(settlements[0], streak, lastSettlements, props.minPop, pairs))
        setPause(false);
        updateLastSettlements(settlements[0][0]);
        if (!correct && health-1 == 0) {
            setPairs([]);
            props.setMenu(true);
            setStreak(0);
            document.cookie = "Score=0";
            setCorrect(true);
        }
        else if (!correct)
            setHealth(health-1);
    }

    let jsx;
    document.cookie = "Score=" + streak;
    if (pause) {
        let sentence = Sentence(settlements[0][0], settlements[0][settlements[1]]);

        let indicator = "fail", answer = "לא נכונה!";
        if (correct) {
            indicator = "success"
            answer = "נכונה!"
        }

        let highscore = ""
        if (indicator == "fail") {
            if (streak > parseInt(props.cookies["Highscore"])) {
                document.cookie = "Highscore=" + streak;
            }
            highscore = "הניקוד הכי גבוה שלך הוא: " + props.cookies["Highscore"];
        }

        const isMobile = props.width <= 520 && props.width < (props.height-200);

        let information;
        if (isMobile) {
            indicator += " indicatorMobile"
            information = "infoMobile";
        }
        else {
            information = "infoHorz";
        }
        
        let indicatorSentence;
        if (choice != 7)
            indicatorSentence = settlements[0][choice].cityLabel+" היא תשובה "+ answer;
        else
            indicatorSentence = "נגמר הזמן.";
        let moreInfo = props.showInfo ? (<div><h1 className={information}>{settlements[0][0].cityLabel} <br></br>{sentence}</h1><br></br> <div className="h1button"><h1>המשך</h1></div></div>) : (<div className="h1button"><h1>המשך</h1></div>)
        jsx = (
            <div onClick={() => { nextRound() }}>
                <div className="streak">
                    <p>הניקוד הכי גבוה: {parseInt(props.cookies["Highscore"])}</p>
                    <p>ניקוד: {streak}</p>
                </div>
                <div className='wrapperPause center'>
                    <p className={indicator}>{indicatorSentence}</p>
                    {moreInfo}
                </div>
            </div>
        )
    }
    else {
        const isMobile = props.width <= 520 && props.width < (props.height-200);
        const mobileHeight = props.height <= 600;

        let firstClass = isMobile ? "top" : "left";
        let secondClass = isMobile ? "middleVert" : "middle";
        let thirdClass = isMobile ? "bottom" : "right";
        let wrapper = isMobile ? "wrapper mobile" : "wrapper horz";
        wrapper += mobileHeight ? " sizeDownText" : "";

        firstClass += " h1button";
        secondClass += " h1button";
        thirdClass += " h1button";

        jsx = (<div>
            <div className="streak">
                <p>הניקוד הכי גבוה: {parseInt(props.cookies["Highscore"])}</p>
                <p>ניקוד: {streak}</p>
            </div>
            {timerHTML(props.timerEnabled || props.isMultiplayer, time)}
            <h1 className="titleCity">איזה יישוב יותר קרוב ל:<br></br> {settlements[0][0].cityLabel}</h1>
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
        </div>);
    }
    let hearts = [];
    if (props.isHealth){
        for (let i = 0; i < health; i++)
            hearts.push(<img src={heart} key={i} className="heart"/>);
    }
    
    return (
        <div>
            <div className="heartDiv">
                {hearts}
            </div>
            <h1 className="title">איזה יישוב יותר קרוב?</h1><br></br>
            {jsx}
            <span id="rewardId" style={{width: 2, height: 2, background: "red"}}/>
        </div>
    )
}

export default Game;