function checkCookies() {
    const COOKIES = ["Score", "Highscore", "MinPop", "Timer"];

    return COOKIES.some(v => !document.cookie.includes(v));
}

function createCookies() {
    document.cookie = "Score=0";
    document.cookie = "Highscore=0";
    document.cookie = "Timer=false";
    document.cookie = "MinPop=0";
}

export { checkCookies, createCookies };