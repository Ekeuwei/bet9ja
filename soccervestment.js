
function getInvestmentSteps(steps, odds, bankroll){
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

    return all;

    // console.log(all, all.reduce((a,b)=> a+b, 0),`profit per step: $${profit}`);
}

// const result = getInvestmentSteps(5, 2, 100000);
// console.log(result, result.reduce((a,b)=> a+b, 0));

module.exports = getInvestmentSteps;
