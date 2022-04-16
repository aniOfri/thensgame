function RandInt(max) {
    return Math.floor(Math.random() * max);
}

function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function toRad(Value) {
    return Value * Math.PI / 180;
}

function timerHTML(timerEnabled) {
    let timeShow;
    if (timerEnabled) {
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
    else {
        timeShow = ("");
    }
    return timeShow;
}

export default { RandInt, calcCrow, timerHTML };