const puppeteer = require('puppeteer');
const dateFormat = require('dateformat');
var colors = require('colors');
const getInvestionSteps = require('./soccervestment');
const args = [
      '--no-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
  ];

const options = {
    args,
    headless: false,
    defaultViewport: null,
    ignoreHTTPSErrors: true
    // userDataDir: './tmp'
};


class BrowserHandler {
  constructor() {
    const launch_browser = async () => {
      this.browser = false;
      this.browser = await puppeteer.launch(options);
      this.browser.on('disconnected', launch_browser);
    };

    (async () => {
      await launch_browser();
    })();
  }
}

/**
 * Function: wait_for_browser
 *     Wait for Browser to Finish Launching
 */
const wait_for_browser = browser_handler => new Promise((resolve, reject) => {
  const browser_check = setInterval(() => {
    if (browser_handler.browser !== false) {
      clearInterval(browser_check);
      resolve(true);
    }
  }, 100 );
});


const demoUrl = 'https://logigames.bet9ja.com/Games/Launcher?gameId=11000&provider=0&sid=&pff=1&skin=201';
const realUrl = 'https://casino.bet9ja.com/casino/category/all';
const url = demoUrl;
let date = dateFormat(new Date(), 'yyyymmdd');
let slota = [];
let slotb = [];
let slotc = [];
let slotd = [];
let intersection = [];
let betzero = [];
let highlow;
let justAppeared = [];
let lastDraw = [];
let twentyMore = [];
let allBalls = [];
let lastThirtyMinutes = [];
let eligibleDraws;
let last_played_id = 0;
let last_staked_type = '';
let staked = false;
let drawCounts = 0;
let stakeCount = 1;
let reservedAmount = 0;
let resetValues = false;
let startStaking = false;
let highStakesReset = 0;
let lowStakesReset = 0;
let minBankroll; //You must have this amount in your account
let highestAmount, balance,totalBalance, lastThirtyResult, won, wonStake;
Array.min = array => Math.min.apply( Math, array );
Array.max = array => Math.max.apply( Math, array );
const myArgs = process.argv.slice(2);
let stakeAmount = myArgs.length>0? myArgs[0]:50;
const playType = myArgs.length>1? myArgs[1]: 'demo'
console.log('Place',playType,'with', stakeAmount);

const players = [];
let thisPlayerId;
let lastPlayerId;
for(let i = 0; i < 4; i+=1){
  players.push({highStakesReset: 0, last_staked_type: "", bankrollExhausted: false})
}
      
(async () => {

  const browser_handler = new BrowserHandler;
  await wait_for_browser(browser_handler);
  let page = await browser_handler.browser.newPage(); // Open New Page


  const navigationPromise = page.waitForNavigation({waitUntil: 'networkidle0',timeout:0});
  await page.goto(url,  {waitUntil: 'load', timeout:0}).catch(err =>{console.error(err.message); process.exit()});
  await navigationPromise;
  // await page.$eval('.stats__toggle-txt', elem => elem.click()).catch(err => console.error(err.message));
  let last_draw_id = '';

  if(url !== demoUrl){
    await Promise.all([
      //login promise
      await page.type('.h-ml__login-form--input[name="username"]', '7thpriest'),//Username
      await page.type('.h-ml__login-form--input[name="password"]', '7thdaniel'),//Password
      await page.click('.h-ml__login-btn'),//Login
      await page.waitForNavigation({waitUntil: 'networkidle0',timeout:10000}).catch(err => console.error(err.message))
    ]);
    await page.hover('.game[id="11000"]');
    if(playType === 'demo'){
      await page.click('.game[id="11000"]>.game__tile>.game__info>.btn-transparent-xxs').
        catch(err => {console.error(err.message); process.exit()});//Play Demo
    }else  await page.click('.game[id="11000"]>.game__tile>.game__info>.btn-primary-xxs').
                catch(err => {console.error(err.message); process.exit()});//Play Game
    // await page.click('.game[id="11000"]>.game__tile>.game__info>.btn-primary-xxs');//Play Now
    // await page.click('.game[id="11000"]>.game__tile>.game__info>.btn-transparent-xxs');//Play Demo

    await page.waitForNavigation({waitUntil: 'networkidle0',timeout:20000}).catch(err => console.error(err.message));

    let pages = await browser_handler.browser.pages();
    console.log("total pages "+pages.length);
    page = await pages[2];
    await pages[0].close();
    await pages[1].close();
  }


  await page.$eval('.stats__toggle', elem => elem.click()).catch(err => {console.error(err.message); process.exit()});;


  async function get_draw_details(){

    if (browser_handler.browser === false) {
      console.log('The browser has been disconnected.');
      await wait_for_browser(browser_handler);
    }


    const details = {};
    await page.$eval('.p-stats__tabs-tab', elem => elem.click()).catch(err => console.error(err.message));
    details.draw_id = await page.$$eval('.statistics>tbody>tr>td', elem => elem[0].textContent).catch(err => console.error(err.message));
    const first_draw = await page.$$eval('.statistics>tbody>tr>td>.balls>span', elem => elem[0].textContent).catch(err => console.error(err.message));//array of 6 elements
    const second_draw = await page.$$eval('.statistics>tbody>tr>td>.balls>span', elem => elem[1].textContent).catch(err => console.error(err.message));//array of 6 elements
    const third_draw = await page.$$eval('.statistics>tbody>tr>td>.balls>span', elem => elem[2].textContent).catch(err => console.error(err.message));//array of 6 elements
    const fourth_draw = await page.$$eval('.statistics>tbody>tr>td>.balls>span', elem => elem[3].textContent).catch(err => console.error(err.message));//array of 6 elements
    const fifth_draw = await page.$$eval('.statistics>tbody>tr>td>.balls>span', elem => elem[4].textContent).catch(err => console.error(err.message));//array of 6 elements
    const sixth_draw = await page.$$eval('.statistics>tbody>tr>td>.balls>span', elem => elem[5].textContent).catch(err => console.error(err.message));//array of 6 elements

    const first_draw_1 = await page.$$eval('.statistics>tbody>tr>td>.balls>span', elem => elem[6].textContent).catch(err => console.error(err.message));//array of 6 elements
    const second_draw_1 = await page.$$eval('.statistics>tbody>tr>td>.balls>span', elem => elem[7].textContent).catch(err => console.error(err.message));//array of 6 elements
    const third_draw_1 = await page.$$eval('.statistics>tbody>tr>td>.balls>span', elem => elem[8].textContent).catch(err => console.error(err.message));//array of 6 elements
    const fourth_draw_1 = await page.$$eval('.statistics>tbody>tr>td>.balls>span', elem => elem[9].textContent).catch(err => console.error(err.message));//array of 6 elements
    const fifth_draw_1 = await page.$$eval('.statistics>tbody>tr>td>.balls>span', elem => elem[10].textContent).catch(err => console.error(err.message));//array of 6 elements
    const sixth_draw_1 = await page.$$eval('.statistics>tbody>tr>td>.balls>span', elem => elem[11].textContent).catch(err => console.error(err.message));//array of 6 elements
    details.draws = [];
    // details.draw_id = parseInt(details.draw_id);
    details.draws.push(parseInt(first_draw), parseInt(second_draw), parseInt(third_draw), parseInt(fourth_draw), parseInt(fifth_draw), parseInt(sixth_draw));
    const draw2 = [parseInt(first_draw_1), parseInt(second_draw_1), parseInt(third_draw_1), parseInt(fourth_draw_1), parseInt(fifth_draw_1), parseInt(sixth_draw_1)];
    details.time = dateFormat(new Date(), 'yyyy-mm-dd  "GMT"o --> HH:MM');
    
    if(last_draw_id != details.draw_id && details.draw_id != 'undefined'){
      getBetZeros(details.draws, draw2, details.draw_id);
      // groupPlay(details.draws, draw2, details.draw_id);
      last_draw_id = JSON.parse(JSON.stringify(await details.draw_id));
    }
    //check for date difference
    if(date !== dateFormat(new Date(), 'yyyymmdd')){
      date = dateFormat(new Date(), 'yyyymmdd');
      data = [];
    }

    async function highlowResult(total){
      if(total >=152 && total<= 279){
        return 'high'
      }else if(total >=149 && total<= 151){
        return 'mid'
      }else if(total >=21 && total<= 148){
        return 'low'
      }
    }

    async function groupPlay(presentDraw, lastDraw, _id){
      minBankroll = 100000/players.length; //You must have this amount in your account
      const reservePercent = 100;// e.g 100% raise the bankroll by this percent before restarting
      await page.waitFor(1000);
      await page.click('.rs-menu__balance--refresh',{clickCount:3, delay: 500}).catch(err => {console.error(err.message); process.exit()});
      await page.waitFor(1000);
      totalBalance = await page.$eval('.rs-menu__balance-value', elem => parseInt(elem.textContent)).catch(err => console.error(err.message));
      
      const total = presentDraw.reduce((a, b) => a + b, 0);
      const last_high_low_outcome = await highlowResult(total);
      
      thisPlayerId = drawCounts==0? 0:(drawCounts % players.length==0? players.length : drawCounts % players.length)-1; // this is the last player
      lastPlayerId = (thisPlayerId-1==-1?players.length:thisPlayerId)-1;
      console.log('this player id:::::::::', thisPlayerId);

      players[lastPlayerId].won = players[lastPlayerId].last_staked_type === last_high_low_outcome;
      players[lastPlayerId].wonStake = players[lastPlayerId].staked && players[lastPlayerId].won;
      players[lastPlayerId].highStakesReset = players[lastPlayerId].wonStake ? 0 : players[lastPlayerId].staked? 
                            players[lastPlayerId].highStakesReset + 1 : players[lastPlayerId].highStakesReset;

      // won = last_staked_type === last_high_low_outcome;
      // wonStake = staked && won;
      // highStakesReset = wonStake ? 0 : staked? highStakesReset + 1 : highStakesReset; //Increment iff there was a lost stake

      reservedAmount = drawCounts===1 && (totalBalance-minBankroll) > reservedAmount+(minBankroll*(reservePercent/100))? totalBalance-minBankroll:reservedAmount;
      if((totalBalance-minBankroll) > (reservedAmount+(minBankroll*(reservePercent/100))) && (totalBalance-reservedAmount) > highestAmount){
        //Due for extraction
        reservedAmount = totalBalance-minBankroll;
        highestAmount = totalBalance - reservedAmount;

        /*/reset
        resetValues = true;
        startStaking = false;
        console.log('after',drawCounts,'draws, we got =>',reservedAmount);
        if(drawCounts>1)process.exit(); *///exit after we get reservePercent increase
      }
      balance = totalBalance - reservedAmount;

      highestAmount = drawCounts===1? balance : balance > highestAmount?
                      balance : highestAmount;
      if(wonStake && balance !== highestAmount){
        console.log(`Opps! I though I won! ID:${_id}, Stake:${last_high_low_outcome}, Bal->${balance}`);
        // process.exit();
      }
      // console.log('highest:',highestAmount,'bal:',balance);
      // reservedCash = drawCounts===1? highestAmount-5500 : reservedCash;
      // stakeAmount = '10000'; //Steady stake amount

      highlow = last_high_low_outcome == 'mid'? 'none' : last_high_low_outcome;
      console.log(_id, '-> last result', last_high_low_outcome,' | ', highlow, won?'Hit :-)':'Missed :-(');
      
      staked = false;
      
      const highStakeAmount = getStakeAmount(players[thisPlayerId].highStakesReset).toString();
      const skip = players.length; //Number of players is skip+1
      // if(drawCounts>0 && (parseInt(last_played_id)+skip >= parseInt(_id) || last_played_id == 0)) {
      if(drawCounts>0 && !players[thisPlayerId].bankrollExhausted) {
          //We only want to stake after three count
        // console.log('We are staking now',parseInt(last_played_id), parseInt(_id)+3);
        await stakeOnHighlow(stakeRule(last_high_low_outcome), highStakeAmount); // args; high, stakeAmount
        last_played_id = JSON.parse(JSON.stringify(_id))
      }

      stakeCount += 1;
      drawCounts += 1;
    }

    async function getBetZeros(presentDraw, lastDraw, _id){
      minBankroll = 100000; //You must have this amount in your account
      const reservePercent = 30;// e.g 100% raise the bankroll by this percent before restarting
      await page.waitFor(1000);
      await page.click('.rs-menu__balance--refresh',{clickCount:5, delay: 200}).catch(err => {console.error(err.message); process.exit()});
      await page.waitFor(1000);
      totalBalance = await page.$eval('.rs-menu__balance-value', elem => parseInt(elem.textContent)).catch(err => console.error(err.message));
      
      const total = presentDraw.reduce((a, b) => a + b, 0);
      const last_high_low_outcome = await highlowResult(total);

      won = last_staked_type == last_high_low_outcome;
      wonStake = staked && won;
      highStakesReset = wonStake ? 0 : staked? highStakesReset + 1 : highStakesReset; //Increment iff there was a lost stake

      reservedAmount = drawCounts===1 && (totalBalance-minBankroll) > reservedAmount+(minBankroll*(reservePercent/100))? totalBalance-minBankroll:reservedAmount;
      if((totalBalance-minBankroll) > (reservedAmount+(minBankroll*(reservePercent/100))) && (totalBalance-reservedAmount) > highestAmount){
        //Due for extraction
        reservedAmount = totalBalance-minBankroll;
        highestAmount = totalBalance - reservedAmount;

        /*/reset
        resetValues = true;
        startStaking = false;
        console.log('after',drawCounts,'draws, we got =>',reservedAmount);
        if(drawCounts>1)process.exit(); *///exit after we get reservePercent increase
      }
      balance = totalBalance - reservedAmount;

      highestAmount = drawCounts===1? balance : balance > highestAmount?
                      balance : highestAmount;
      if(wonStake && balance !== highestAmount){
        console.log(`Opps! I though I won! ID:${_id}, Stake:${last_high_low_outcome}, Bal->${balance}`);
        // process.exit();
      }
      // console.log('highest:',highestAmount,'bal:',balance);
      // reservedCash = drawCounts===1? highestAmount-5500 : reservedCash;
      // stakeAmount = '10000'; //Steady stake amount


      if(highlowResult(total) == 'high'){
        //TODO: workout out a stking modality
      }
      highlow = last_high_low_outcome == 'mid'? 'none' : last_high_low_outcome;
      console.log(_id, '-> last result', last_high_low_outcome,' | ', highlow, won?'Hit :-)':'Missed :-(');
      staked = false;
      

      const highStakeAmount = getStakeAmount(highStakesReset, 5, minBankroll).toString();
      const skip = 3; //Number of players is skip+1
      if(drawCounts>1 /*&& (parseInt(last_played_id)+skip >= parseInt(_id) || last_played_id == 0)*/) {
        await stakeOnHighlow(stakeRule(last_staked_type, last_high_low_outcome), highStakeAmount); // args; high, stakeAmount
        last_played_id = JSON.parse(JSON.stringify(_id))
      }

      stakeCount += 1;
      drawCounts += 1;
    }
    function getStakeAmount(step, steps, bankroll){
      // if(players[thisPlayerId].bankrollExhausted) return Math.floor(highestAmount*.03846);
      
      let invSt = getInvestionSteps(steps, 2, bankroll);

      // console.log('bnkr', invSt, step, invSt[step]);

      if(step > steps){
        console.log("\007");
        console.log(`Player ${thisPlayerId+1} Bankroll Exhausted after ${drawCounts} draw counts`);
        reservedAmount = reservedAmount>= minBankroll? reservedAmount-minBankroll : process.exit();
        highestAmount = minBankroll;
        startStaking = false;
        stakeReset = 0;
        highStakesReset = 0;
        lowStakesReset = 0;
        players[thisPlayerId].bankrollExhausted = true;
        
        return Math.floor(getInvestionSteps(steps, 2, bankroll)[0])
      }
      
      return Math.floor(getInvestionSteps(steps, 2, bankroll)[step])
     
    }

    function stakeRule(lastStake, lastResult){
      // We stake on only one outome, however, the outcome changes whenever there's mid
      if(lastResult==='mid') //swap stake
        return lastStake==='high'? 'low' : 'high';
      
      return lastStake;
    }
    async function stakeOnHighlow(stake, stakeAmount){
      last_staked_type = JSON.parse(JSON.stringify(stake));
      const stakeOnHigh = 0;
      const stakeOnLow = 2;

      //Group play
      // players[thisPlayerId].stake = JSON.parse(JSON.stringify(last_staked_type));


      stake = stake == 'high'? stakeOnHigh:stakeOnLow;
      // stake = stakeOnHigh;

      stakeReset = highestAmount === balance /*|| wonStake*/ ? 0: stakeReset+1;// To determine if we should increase stake amount
      // stakeAmount = stakeAmountValue? stakeAmountValue : getStakeAmount().toString();
      if(stakeAmount==0)return;
      console.log('Stake Amount: '+stakeAmount,'Account Balance -> '+balance,' |::-> highestAmount:',highestAmount);

      await page.waitFor(1000);
      await page.$eval('.stats__toggle.active', elem => elem.click()).catch(err => console.error(err.message));
      await page.waitFor(1000);
      await page.$$eval('.game-nav__item', elem => elem[1].click()).catch(err => console.error(err.message));
      await page.waitFor(1000);
      await page.$$eval('.g-hi-lo__item', (elem, {stake}) => elem[stake].click(), {stake}).catch(err => console.error(err.message));

      await page.click('.input-group>input[max="2000000"]',{clickCount:2}).catch(err => console.error(err.message));
      await page.type('.input-group>input[max="2000000"]',stakeAmount, {delay: 100}).catch(err => console.error(err.message));


      await page.focus('.dib').catch(err => console.error(err.message));
      await page.waitFor(1000);
      await page.click('.dib').catch(err => {console.error(err.message); process.exit()});

      staked = await page.waitForSelector('.bets__item', {timeout: 30000}).then( ()=>true)
        .catch(async (err) => {
          console.error(err.message)
          await page.click('.dib').catch(err => {console.error(err.message); process.exit()});
          staked = await page.waitForSelector('.bets__item', {timeout: 10000}).then( ()=>true).catch(err => console.error(err.message));
        });

      //Group play
      // players[thisPlayerId].staked = JSON.parse(JSON.stringify(staked));


      //refresh balance and get value
      await page.waitFor(1000);
      await page.click('.rs-menu__balance--refresh').catch(err => {console.error(err.message); process.exit()});

      await page.waitFor(1000);//Reset
      await page.$eval('.g-hi-lo__wrap.active', elem => elem.click()).catch(err => console.error(err.message));
      await page.waitFor(5000);
      await page.$eval('.stats__toggle', elem => elem.click()).catch(err => {console.error(err.message); process.exit();});
      return;
    }

    return details;
  }
  
  setInterval(get_draw_details, 1000);

  const html = await page.content();
  // await browser.close();
  // return html;
})();
