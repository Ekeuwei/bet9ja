'use strict'
// const fs = require('fs');
// const fourBalls = fs.readFileSync('./fourballs.txt').toString('utf-8').split("\n");
// const time = Date.now();
// const ballLength = fourBalls.length;
// const index = (time*time)%ballLength;

// console.log(fourBalls[index].trim().split(' ').map(x=>+x));

function soccervestment(totalDays, odds, bankroll){
  const invArray = [];
  for(let i = 1; i<=totalDays; i++){
    // =((1*((1*G4)-1))+F13)/G4
    //=((2*((F13*G4)-F13))+F13+F14)/G4
    const total = invArray.reduce((a, b) => a + b, 0);
    const tempA = i===1? (i*(odds-1)+1)/odds : (i*(odds-1)+total)/odds;
    const tempB = (i*(odds-1)+total+tempA)/odds;
    invArray.push(tempA);
  }
  console.log(invArray);
}

function recursiveMethod(n, odds){
  // let total = 1;
  if(n === 16){
    // total = (n*(odds-1)+1)/odds;
    return (n*(odds-1)+1)/odds;
  }

  // total = (n*(odds-1)+recursiveMethod(n+1, odds))/odds;
  console.log((n*(odds-1)+recursiveMethod(n+1, odds))/odds);
  return (n*(odds-1)+recursiveMethod(n+1, odds))/odds;

}

soccervestment(4, 2, 100000);
// recursiveMethod(1, 4);
