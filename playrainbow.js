const puppeteer = require('puppeteer');
const dateFormat = require('dateformat');
var colors = require('colors');
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
let rainbow;
let previouseChoice;
let justAppeared = [];
let lastDraw = [];
let twentyMore = [];
let allBalls = [];
let lastThirtyMinutes = [];
let eligibleDraws;
let staked = false;
let drawCounts = 1;
let stakeCount = 1;
let reservedAmount = 0;
let resetValues = false;
let startStaking = false;
let failCount = 0;
let minBankroll; //You must have this amount in your account
let highestAmount, balance,totalBalance, lastThirtyResult, won, wonStake;
Array.min = array => Math.min.apply( Math, array );
Array.max = array => Math.max.apply( Math, array );
const myArgs = process.argv.slice(2);
let stakeAmount = myArgs.length>0?myArgs[0]:50;
const playType = myArgs.length>1? myArgs[1]: 'demo'
console.log('Place',playType,'with',stakeAmount);

(async () => {

  // const browser = await puppeteer.launch(options).catch(err => {console.error(err.message); browser.close()});
  // browser.on('disconnected', ()=> process.exit());
  // let page = await browser.newPage();


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
      await page.type('.h-ml__login-form--input[name="password"]', '7thdaniel'),//Username
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
    // await page.$$eval('.draws', elem => elem[2].click()).catch(err => console.error(err.message));
    await page.$eval('.p-stats__tabs-tab', elem => elem.click()).catch(err => console.error(err.message));
    // await page.waitFor(() => { setTimeout(function () { return true; }, 3000); });
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
      last_draw_id = await details.draw_id;
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
      /*switch (total) {
        case (total >=152 && total<= 279): return 'high';
        case (total >=149 && total<= 151): return 'mid';
        case (total >=21 && total<= 148): return 'low';
        default: return 'none'
      }*/
    }

    async function getBetZeros(presentDraw, lastDraw, _id){
      minBankroll = 100000; //You must have this amount in your account
      const reservePercent = 100;// 10%
      await page.waitFor(1000);
      await page.click('.rs-menu__balance--refresh',{clickCount:5, delay: 200}).catch(err => {console.error(err.message); process.exit()});
      await page.waitFor(1000);
      totalBalance = await page.$eval('.rs-menu__balance-value', elem => parseInt(elem.textContent)).catch(err => console.error(err.message));
      // balance = await page.$eval('.rs-menu__balance-value', elem => parseInt(elem.textContent)).catch(err => console.error(err.message));


      // console.log(presentDraw,lastDraw);
       // const nextDraw = presentDraw.draws;//.sort((a, b) => a - b);
       const minNum = Array.min(lastDraw);
       const maxNum = Array.max(lastDraw);
       const total = await presentDraw.reduce((a, b) => a + b, 0);
       const highlowValue = await highlowResult(total);
       // console.log('Total -> ',total,'Highlow ->',highlowValue);

       let drawColors = {red:0,blue:0,green:0};
       let thisColor;
       for(i in presentDraw){
         thisColor = await checkColor(presentDraw[i]);
         if(thisColor=='blue') drawColors.blue+=1;
         else if(thisColor == 'red') drawColors.red+=1;
         else if(thisColor == 'green') drawColors.green+=1
       }

       eligibleDraws = await lastDrawn(presentDraw);
       won = await fourPlusBalls(presentDraw)//drawColors[rainbow] >= 2;
       wonStake = staked && won;

       reservedAmount = drawCounts===1 && (totalBalance-minBankroll) > reservedAmount+(minBankroll*(reservePercent/100))? totalBalance-minBankroll:reservedAmount;
       if((totalBalance-minBankroll) > (reservedAmount+(minBankroll*(reservePercent/100))) && (totalBalance-reservedAmount) > highestAmount){
         //Due for extraction
         reservedAmount = totalBalance-minBankroll;
         highestAmount = totalBalance - reservedAmount;

         //reset
         resetValues = true;
         startStaking = false;
         console.log('after',drawCounts,'draws, we got =>',reservedAmount);
         if(drawCounts>1)process.exit(); //exit after we get reservePercent increase
       }
       balance = totalBalance - reservedAmount;

       highestAmount = drawCounts===1? balance : balance > highestAmount?
                       balance /*:wonStake? parseInt(balance+(stakeAmount*1.65)) */: highestAmount;
       if(wonStake && balance !== highestAmount){
         console.log('What is happening! I though I won',_id, betzero, presentDraw,'Bal->',balance);
         // process.exit();
       }
       // console.log('highest:',highestAmount,'bal:',balance);
       // reservedCash = drawCounts===1? highestAmount-5500 : reservedCash;
       // stakeAmount = '10000'; //Steady stake amount




       {
         previouseChoice = rainbow;
         rainbow = drawColors.blue >= 2 && rainbow!='blue'? 'blue':
                  drawColors.green >= 2 && rainbow!='green'? 'green':
                  drawColors.red >= 2 && rainbow!='red'? 'red':
                  drawColors.blue==2&&drawColors.green==2&drawColors.blue==2?'none':'none';
         //If a color appears 2+, it will likely re-appear 2+ IFF it was not chosen previousely
       }

       // highlow = highlowValue == 'mid'? 'none' : highlowValue;
       console.log(_id, '-> ', colorIt(presentDraw[0]),colorIt(presentDraw[1]),colorIt(presentDraw[2]),colorIt(presentDraw[3]),colorIt(presentDraw[4]),colorIt(presentDraw[5]), won?'Hit :-)':'Missed :-(');
       // console.log(_id, 'Predicted Color -> ',rainbow,' | Last Color', previouseChoice, won?'Hit :-)':'Missed :-(');
       staked = false;

       if(won /*|| balance === highestAmount*/) failCount=0;
       else failCount += 1;
       console.log('Total fails => ',failCount);
       if(drawCounts>= 0/*(rainbow!='none' &&stakeCount>=0 && won) || startStaking*/){
         // await stakeOnBetzero(betzero);
         // await stakeOnHighlow(highlow);
         rainbow = [3,9,15];
         await stakeOnRainbow(rainbow);
         startStaking = true;
       }

       // else staked = false;

       stakeCount += 1;
       drawCounts += 1;
    }

    function getStakeAmount(balance){
      const lives /*10lives on 3oods =>*/ = [0.0031, 0.0078, 0.0148, 0.0254, 0.0412, 0.0649, 0.1005, 0.1539, 0.2340, 0.3542]
      // const lives /*11lives on 3oods =>*/ = [0.0020, 0.0051, 0.0097, 0.0165, 0.0269, 0.0423, 0.0655, 0.1003, 0.1525, 0.2308, 0.3483]

      switch (stakeReset) {
        case 0: return Math.floor(highestAmount*lives[stakeReset]);
        case 1: return Math.floor(highestAmount*lives[stakeReset]);
        case 2: return Math.floor(highestAmount*lives[stakeReset]);
        case 3: return Math.floor(highestAmount*lives[stakeReset]);
        case 4: return Math.floor(highestAmount*lives[stakeReset]);
        case 5: return Math.floor(highestAmount*lives[stakeReset]);
        case 6: return Math.floor(highestAmount*lives[stakeReset]);
        case 7: return Math.floor(highestAmount*lives[stakeReset]);
        case 8: return Math.floor(highestAmount*lives[stakeReset]);
        case 9: return Math.floor(highestAmount*lives[stakeReset]);
        // case 10: return Math.floor(highestAmount*lives[stakeReset]);
        // case 11: return Math.floor(highestAmount*lives[stakeReset]);
        // case 12: return Math.floor(highestAmount*lives[stakeReset]);
        // case 13: return Math.floor(highestAmount*lives[stakeReset]);
        // case 14: return Math.floor(highestAmount*lives[stakeReset]);
        // case 15: return Math.floor(highestAmount*lives[stakeReset]);
        default: console.log("\007");
                console.log('Bankroll Exhausted after',drawCounts,'draw counts','and we reserved =>', reservedAmount);
                process.exit();
                reservedAmount = reservedAmount>= minBankroll? reservedAmount-minBankroll:process.exit();
                startStaking = false;
                stakeReset = 0;
                return 0;
      }
    }

    async function stakeOnRainbow(stake){

      // stake = stake == 'red'? 1:stake=="blue"?7:13; //2+ staking on rainbow

      stakeReset = highestAmount === balance /*|| wonStake*/ ? 0: stakeReset+1;// To determine if we should increase stake amount
      stakeAmount = await getStakeAmount()//.toString();
      if(stakeAmount==0)return;
      console.log('Stake Amount: '+stakeAmount,'Account Balance -> '+balance,' |::-> highestAmount:',highestAmount);

      await page.waitFor(1000);
      await page.$eval('.stats__toggle.active', elem => elem.click()).catch(err => console.error(err.message));
      await page.waitFor(1000);
      await page.$$eval('.game-nav__item', elem => elem[3].click()).catch(err => console.error(err.message));
      // await page.waitFor(1000);
      // await page.$$eval('.rainbow__ball-value', (elem, {stake}) => elem[stake].click(), {stake}).catch(err => console.error(err.message));
      stakeAmount = await Math.floor(stakeAmount/3).toString();
      for(var ball=0; ball<stake.length; ball++){
        //Here we are staking on 4+ colors to appear
        let stakeBall  = stake[ball];
        // await page.waitFor(1000);//Clear selection
        // await page.$$eval('.rainbow__ball-value', elem => elem[0].click()).catch(err => console.error(err.message));
        await page.waitFor(500); //Select Ball
        await page.$$eval('.rainbow__ball-value', (elem, {stakeBall}) => elem[stakeBall].click(), {stakeBall}).catch(err => console.error(err.message));

        await page.waitFor(500);
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
      }

      //refresh balance and get value
      await page.waitFor(1000);
      await page.click('.rs-menu__balance--refresh').catch(err => {console.error(err.message); process.exit()});

      await page.waitFor(1000);//Reset
      await page.$eval('.available.active', elem => elem.click()).catch(err => console.error(err.message));
      await page.waitFor(5000);
      await page.$eval('.stats__toggle', elem => elem.click()).catch(err => {console.error(err.message); process.exit();});
      return;
    }
    async function checkValue(number){
      let counter = 0;
      let notStackedTogether = false;
      const dff = 7;
      justAppeared = justAppeared.length >11?JSON.parse(JSON.stringify(justAppeared.slice(-12))):justAppeared;
      betzero = JSON.parse(JSON.stringify([slota[0],slotb[0],slotc[0],slotd[0]]));
      number = number > 49? number-49: number;//normalize number
      while(betzero.indexOf(number)>-1 /*|| !notStackedTogether|| justAppeared.indexOf(number)!=-1*/){
        // number = number >= 49? number-48: number+1;
        number = await eligibleDraws.length>counter? eligibleDraws[counter].ball: number >= 49? number-48: number+1;//check this statement
        notStackedTogether = await (number>(betzero[0]+dff)||number<(betzero[0]-dff)) && (number>(betzero[1]+dff)||number<(betzero[1]-dff)) &&
                             (number>(betzero[2]+dff)||number<(betzero[2]-dff)) && (number>(betzero[3]+dff)||number<(betzero[3]-dff))
        counter += 1;
      }
      //console.log('number is > '+number)
      return number;
    }
    function checkColor(value){
      const red = value === 1 || value%3 === 1;
      const blue = value === 2 || value%3 === 1+1;
      const green = value === 3 || value%3 === 1+2;
      return value === 49? 'yellow':red? 'red': blue? 'blue':'green';
    }
    function colorIt(value){
      const red = value === 1 || value%3 === 1;
      const blue = value === 2 || value%3 === 1+1;
      const green = value === 3 || value%3 === 1+2;
      return value === 49? colors.yellow(value):red? colors.red(value): blue? colors.blue(value):colors.green(value);
      // console.log(vall);
    }
    function lastDrawn(values){
      const eligibleDraws = [];
      twentyMore = [];
      for (var i = 0; i < 49; i++) {
        if(allBalls.length == 49){
          allBalls[i].lastDrawn = values.indexOf(i+1) >-1 ? 0 : allBalls[i].lastDrawn+1;
          allBalls[i].totalDraws = values.indexOf(i+1)>-1 ? allBalls[i].totalDraws+1:allBalls[i].totalDraws;
          if(allBalls[i].lastDrawn >= 10 && allBalls[i].lastDrawn <=11) eligibleDraws.push(allBalls[i]);
          // if(allBalls[i].lastDrawn >= 5 && allBalls[i].lastDrawn <=7) eligibleDraws.push(i+1);
          if(allBalls[i].lastDrawn >19) twentyMore.push(allBalls[i].ball);

          /*if(drawCounts%6 == 0){
            if(i==0) lastThirtyResult = lastThirtyMinutes.sort((a,b) => b.totalDraws-a.totalDraws).splice(0,4);
            console.log('Highest drawn ball past thirty minutes',lastThirtyResult);
            lastThirtyMinutes[i].lastDrawn = 0;
            lastThirtyMinutes[i].totalDraws = 0;
          }
          {//lastThirtyMinutes
            lastThirtyMinutes[i].lastDrawn = values.indexOf(i+1) >-1 ? 0 : lastThirtyMinutes[i].lastDrawn+1;
            lastThirtyMinutes[i].totalDraws = values.indexOf(i+1)>-1 ? lastThirtyMinutes[i].totalDraws+1:lastThirtyMinutes[i].totalDraws;
          }*/
        }else{
          // lastThirtyMinutes.push({ball:i+1, lastDrawn:0, totalDraws:0});
          allBalls.push({ball:i+1, lastDrawn:0, totalDraws:0});
        }
      }
      // eligibleDraws.sort((a,b) => a.totalDraws - b.totalDraws);
      return eligibleDraws;
    }
    function getBestInTime(hourHistory, period){
      hourHistory = hourHistory.length>=period? hourHistory.slice(-period) : hourHistory;
      const fourtyNineBals = [];
      for(var i = 0; i<49; i++) fourtyNineBals.push({ball:i+1, lastDrawn:0, totalDraws:0});//create 49 ball

      for (var i = 0; i < hourHistory.length; i++) {
        for (var j = 0; j < fourtyNineBals.length; j++) {
          fourtyNineBals[j].totalDraws = hourHistory[i].draws.indexOf(fourtyNineBals[j].ball)>-1 ?
                                         fourtyNineBals[j].totalDraws+1 : fourtyNineBals[j].totalDraws;
        }
      }
      return fourtyNineBals.sort((a,b)=> b.totalDraws - a.totalDraws).splice(0,4);
    }
    function fourPlusBalls(arr){
      //checks the occurrence of equal colors
      var counts = {};
      for (var i = 0; i < arr.length; i++) {
        var num = checkColor(arr[i]);
         counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
      // red = !counts.red? red+1:0;
      // blue = !counts.blue? blue+1:0;
      // green = !counts.green? green+1:0;
      // console.log(counts);
      const uptoFourColors = counts.red >= 4 || counts.blue >= 4 || counts.green >= 4;
      return 	uptoFourColors;
   }


    return details;
  }
  setInterval(get_draw_details, 1000);

  const html = await page.content();
  // await browser.close();
  // return html;
})();
