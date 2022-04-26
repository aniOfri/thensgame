// Data
import smallCloud from '../data/smallcloud.png';
import bigCloud from '../data/bigcloud.png';

// Modules
import { RandInt } from '../modules/Calculators';
import { useEffect, useState } from 'react'

function Cloud(){
    const [cloudPosX, setCloudPosX] = useState(0);
    const [cloudPosY, setCloudPosY] = useState(0);
    const [cloudSize, setCloudSize] = useState(Math.random());
    const [cloudSpeed, setCloudSpeed] = useState(1);

    // Mobile related States
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

    useEffect(()=>{
        let interval = null;

        if (cloudPosX < width+800/cloudSize){
            interval = setInterval(() => {
                setCloudPosX(cloudPosX + cloudSpeed);
            }, 5);
        }
        else{
            setCloudSpeed(RandInt(2) + 1);
            let size = Math.random() + 0.4;
            if (size > 1) size = 1;
            setCloudSize(size);
            setCloudPosX(-cloudPosX);
            setCloudPosY(RandInt(50));
        }

        return () => {
            clearInterval(interval);
        };
    }, [cloudPosX]);

    return (
        <div style={{transform: "scale("+cloudSize+") translateX("+cloudPosX+"px) translateY("+cloudPosY+"px)"}} className="cloud">
            <img src={bigCloud}></img>
        </div>
    );
}


export default Cloud;