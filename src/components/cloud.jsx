// Data
import smallCloud from '../data/cloud2.png';
import bigCloud from '../data/cloud.png';

// Modules
import { RandInt } from '../modules/Calculators';
import { useEffect, useState } from 'react'

function Cloud(props){
    const [cloudPosY, setCloudPosY] = useState(parseInt(props.y_offset));
    const [cloudUp, setCloudUp] = useState(true);
	const [cloudDir, setCloudDir] = useState(1);

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

		interval = setInterval(() => {
				if (cloudPosY == 0+parseInt(props.y_offset))
					setCloudPosY(15+parseInt(props.y_offset));
				else
					setCloudPosY(0+parseInt(props.y_offset));
					
            }, RandInt(200)+900);
		
        return () => {
            clearInterval(interval);
        };
    }, [cloudPosY]);

	console.log(cloudPosY);
    return (
        <div style={{transform: "scale("+props.size+") translateY("+cloudPosY+"px) translateX("+props.x_offset+"px)"}} className="cloud">
            <img src={bigCloud}></img>
        </div>
    );
}


export default Cloud;