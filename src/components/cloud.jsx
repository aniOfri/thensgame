// Data
import smallCloud from '../data/smallcloud.png';
import bigCloud from '../data/bigcloud.png';

// Modules
import { useState } from 'react'

function Cloud(){
    const [cloudPos, setCloudPos] = useState(0);

    return (
        <div className="cloud">
            <img src={bigCloud}></img>
        </div>
    );
}


export default Cloud;