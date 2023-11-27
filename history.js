const rp = require('request-promise');
var options = {
    method: "POST",
    uri: "https://logigames.bet9ja.com/Games/Balls49/PlaceBet",
    body: {
        "stage": 2,
        "pff": 1,
        "gameId": 11000,
        "bt":"3298022"
    },
    json: true // Automatically parses the JSON string in the response
  };
const gameHistory = [];

async function getHistory (){
    const playTime = 50;
    currentStatus = await rp(options).then(result =>{
        const referenceID = result.data.drawData.id;
        const timeLeft = result.data.drawData.timeLeft;
        lastDrawnID = parseInt(referenceID) + Math.abs(parseInt(timeLeft/playTime))
        nextDrawTime = playTime - Math.abs(timeLeft%playTime); //In seconds

        options.body.bt = lastDrawnID; //Update the request gameID
        return {lastDrawnID, nextDrawTime}
    })


    for(let i=0; i<10; i+=1){
        options.body.bt = currentStatus.lastDrawnID - i
        await rp(options).then(result => gameHistory.push({id:options.body.bt, draw:result.data.drawData.draw}))
        // console.log(move);
        // "bt": "3277468",
    }

    console.log(gameHistory);

}

function soccervestmentSteps(steps){
    //Method A: Ensures we make a steady profit based on the first stake amount
    const odds = 1.8;
    const bankroll = 100;
    let all = []

    for(let i=1; i<=steps+1; i++){
        all.push(1)
    }

    for(i=1; i<all.length; i+=1){
        let sumPrev = 0;
        for(j=2; j<=i; j++){
            sumPrev += all[j]
        }
        all[i] = ((i*all[1]) + sumPrev )/ (odds -1)
    }

    all = all.splice(1)
    const total = all.reduce((a, b) => a+b, 0)
    const profit = []

    for(i in all){
        // console.log(prev);
        all[i] = (all[i]/total)*1000
        const prev = all.slice(0,i)
        profit.push(((all[i]/total)*100*odds) - prev.reduce((a, b) => a+b, 0))
    }

    console.log(all, all.reduce((a,b)=>a+b, 0));

    
    

}

function soccervestmentStepsB(steps, odds, bankroll){
    //Method B: Maintains a steady profit based on the first realized profit
    bankroll = !bankroll || bankroll == 0 ? 100:bankroll
    let all = []

    for(let i=1; i<=steps; i++) all.push(1)

    for(let i=0; i<steps; i++){
        let sum = 0;
        for(let j=0; j<i; j++){
            sum += all[j]/(odds-1)
        }
        all[i] = (i+1)+sum //We can add a multiple here
    }

    const total = all.reduce((a,b)=> a+b, 0)

    for(i in all) all[i] = (all[i]/total)*bankroll

    const profit = ((all[all.length-1])*odds - all.reduce((a,b)=>a+b,0))/all.length;

    console.log(all, all.reduce((a,b)=> a+b, 0),`profit per step: $${profit}`);
}


soccervestmentStepsB(5, 2, 5000)