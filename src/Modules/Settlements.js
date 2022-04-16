import { RandInt } from './Calculators';
import SettlementsList from './data/settlements.json';

// CHECK THAT THERE IS NO DUPLICATES IN THE SET
function Duplicates(setts, j) {
  let duplicate = false;
  for (let i = 1; i < j; i++) {
    if (setts[i] == setts[j]) duplicate = true;
  }

  return duplicate;
}

// CHECK THAT NO SETTLEMENTS APPEARED IN THE LAST ROUND
function Unfresh(sett, lastRound) {
  if (lastRound[0] == null)
    return false;
  else {
    let refreshed = false;
    for (let i = 0; i < lastRound.length; i++) {
      if (sett == lastRound[i]) refreshed = true;
    }

    return refreshed;
  }
}

// GET ONE SETTLEMENT
function getCity(list) {
  return list[RandInt(list.length)];
}

// GET A LIST OF RANDOM SETTLEMENTS AND A PAIR OF CLOSE ONES
function GetSettlement(lastRound, score, lastSetts, minPop, pairsList) {
  const minDist = 0.04 + score / 1000;
  const maxDist = 0.06 + score / 1000;
  const list = SettlementsList;

  let setts = [], mostClosest, longt1, longt2, lat1, lat2;

  if (score > 50)
    score = 50;

  let toSubstract = score * 1000;
  if (toSubstract < minPop) toSubstract = minPop;

  do {
    setts[0] = getCity(list);
  }
  while (setts[0].population < 50000 - toSubstract || Unfresh(setts[0], lastRound) || Unfresh(setts[0], lastSetts))

  for (let j = 1; j < 7; j++) {
    do {
      do {
        setts[j] = getCity(list);
      }
      while (setts[j].population < 50000 - toSubstract || Duplicates(setts, j) || Unfresh(setts[j], lastRound))

      longt1 = setts[0].gps.split(" ")[1].replace(")", "");
      longt2 = setts[j].gps.split(" ")[1].replace(")", "");

      lat1 = setts[0].gps.split("(")[1].split(" ")[0];
      lat2 = setts[j].gps.split("(")[1].split(" ")[0];

    }
    while (Math.abs(longt1 - longt2) < maxDist || Math.abs(lat1 - lat2) < maxDist)
  }

  mostClosest = getClosest(setts[0], list, minDist, score, pairsList);

  let index;
  index = setts.indexOf(mostClosest);
  if (index == -1) {
    index = RandInt(4) + 1
    setts[index] = mostClosest;
  }

  return [setts, index];
}

// CHECK IF CLOSEST SETTLEMENT ISNT IN LIST OF PAIRS
function pairsCheck(list, pair) {
  let valid = true;
  for (let i = 0; i < list.length && valid; i++) {
    if ((list[i][0] == pair[0] && list[i][1] == pair[1]) ||
      (list[i][1] == pair[0] && list[i][0] == pair[1]))
      valid = false;
  }
  return valid;
}

// GET CLOSEST SETTLEMENT TO GIVEN SETTLEMENT
function getClosest(dest, list, minDist = 0.04, score = 0, pairsList = []) {
  let closest, mostClosest, mostClosestLongt = minDist, mostClosestLat = minDist;
  let longt1, longt2, lat1, lat2;
  let i = 0;
  let distExt = 0;

  if (score > 50)
    score = 50;

  let run = true;
  do {
    closest = list[i];

    if (closest.population > 50000 - score * 1000 && pairsCheck(pairsList, [dest, closest])) {
      longt1 = dest.gps.split(" ")[1].replace(")", "");
      longt2 = closest.gps.split(" ")[1].replace(")", "");

      lat1 = dest.gps.split("(")[1].split(" ")[0];
      lat2 = closest.gps.split("(")[1].split(" ")[0];

      if (Math.abs(longt1 - longt2) < mostClosestLongt && Math.abs(lat1 - lat2) < mostClosestLat && Math.abs(longt1 - longt2) > 0) {
        mostClosest = closest;
        mostClosestLongt = Math.abs(longt1 - longt2);
        mostClosestLat = Math.abs(lat1 - lat2);
      }
    }
    i += 1;
    if (i > list.length - 1) {
      distExt += .01;
      mostClosestLat = minDist + distExt;
      mostClosestLongt = minDist + distExt;
      i = 0;

      if (mostClosest != undefined) {
        run = false;
      }
    }
  }
  while (run)

  return mostClosest;
}




export default { GetSettlement };