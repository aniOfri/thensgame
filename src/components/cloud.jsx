// Data
import smallCloud from '../data/cloud2.png';
import bigCloud from '../data/cloud.png';

// Modules
import { RandInt } from '../modules/Calculators';
import { useEffect, useState } from 'react'

function Cloud(props){
    const [cloudPosY, setCloudPosY] = useState(0);

    useEffect(()=>{
        let interval = null;

		interval = setInterval(() => {
				if (cloudPosY == 0)
					setCloudPosY(15);
				else
					setCloudPosY(0);
					
            }, RandInt(200)+900);
		
        return () => {
            clearInterval(interval);
        };
    }, [cloudPosY]);

    let cloudImg = smallCloud;
    if (props.big)
        cloudImg = bigCloud;

    const styles = {
            top: props.y_offset,
            right: props.x_offset,
            transform: "scale("+props.size+") translateY("+cloudPosY+"px)"
        };
        
    return (
        <div style={styles} className="cloud">
            <img src={cloudImg}></img>
        </div>
    );
}


export default Cloud;