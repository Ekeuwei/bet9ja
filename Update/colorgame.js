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
let date = dateFormat(new Date(), 'yyyymmdd');
let lastGuessValues = [];
let staked = false;
let drawCounts = 1;
let stakeCount = 1;
let reservedAmount = 0;
let stakeReset = 0;
let myColor = 'red';
let pattern = '';
let startStaking = false;
let minBankroll; //You must have this amount in your account
let highestAmount, balance,totalBalance, won, wonStake;
Array.min = array => Math.min.apply( Math, array );
Array.max = array => Math.max.apply( Math, array );
const myArgs = process.argv.slice(2);
let stakeAmount = myArgs.length>0?myArgs[0]:50;
const url = myArgs.length>0? realUrl:demoUrl;
const playType = myArgs.length>1? myArgs[1]: 'demo'
console.log('Place',playType,'with',stakeAmount);

(async () => {

  // const browser = await puppeteer.launch(options).catch(err => {console.error(err.message); browser.close()});
  // browser.on('disconnected', ()=> process.exit());
  // let page = await browser.newPage();


  const browser_handler = new BrowserHandler;
  await wait_for_browser(browser_handler);
  let page = await browser_handler.browser.newPage(); // Open New Page


  // const navigationPromise = page.waitForNavigation({waitUntil: 'networkidle0',timeout:0});
  await page.goto(url,  {waitUntil: 'networkidle0', timeout:0}).catch(err =>{console.error(err.message); process.exit()});
  // await navigationPromise;
  // await page.$eval('.stats__toggle-txt', elem => elem.click()).catch(err => console.error(err.message));
  let last_draw_id = '';

  if(url !== demoUrl){
    // await Promise.all([
      //login promise
      await page.type('.h-ml__login-form--input[name="username"]', '7thpriest'),//Username
      await page.type('.h-ml__login-form--input[name="password"]', '7thdaniel'),//Password
      await page.click('.h-ml__login-btn'),//Login
      await page.waitFor(10000);
      // await page.waitForNavigation({waitUntil: 'networkidle0',timeout:10000}).catch(err => console.error(err.message))
    // ]);
    await page.hover('.game[id="11000"]');
    if(playType === 'demo'){
      await page.click('.game[id="11000"]>.game__tile>.game__info>.btn-transparent-xxs').
        catch(err => {console.error(err.message); process.exit()});//Play Demo
    }else  await page.click('.game[id="11000"]>.game__tile>.game__info>.btn-primary-xxs').
                catch(err => {console.error(err.message); process.exit()});//Play Game
    
    await page.waitFor(20000);
    // await page.waitForNavigation({waitUntil: 'networkidle0',timeout:20000}).catch(err => console.error(err.message));

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

    const RuleTest = async ()=>{
      const drawHistory = [];
      const ruleScore = {leastAppeared:0, mostAppeared:0};
      let draw = [];
      for(let j=0; j<60; j++){
        const ball = await page.$$eval('.statistics>tbody>tr>td>.balls>span', (elem, ballId) => elem[ballId].textContent, j)
                          .catch(err => console.error(err.message));
        if(j%6 === 5){
          // Reset the draw on th sixth ball
          draw.push(ball);
          drawHistory.push(draw);
          draw = [];
        }else{
          draw.push(ball)
        }
      }

      for(let i=drawHistory.length-2; i>-1; i--){
        let { colors } = colorWinRule('red', drawHistory[i+1])
        let leastAppearedRule = colors[2].name==='yellow'? colors[3].name:colors[2].name;
        let mostAppearedRule = colors[0].name;

        let {won: leastAppearedTest} = colorWinRule(leastAppearedRule, drawHistory[i]);
        let {won: mostAppearedTest} = colorWinRule(mostAppearedRule, drawHistory[i]);

        if(leastAppearedTest) ruleScore.leastAppeared +=1;
        if(mostAppearedTest) ruleScore.mostAppeared +=1;
      }

      return ruleScore;
    }

    

    // details.draw_id = parseInt(details.draw_id);
    details.draws.push(parseInt(first_draw), parseInt(second_draw), parseInt(third_draw), parseInt(fourth_draw), parseInt(fifth_draw), parseInt(sixth_draw));
    const draw2 = [parseInt(first_draw_1), parseInt(second_draw_1), parseInt(third_draw_1), parseInt(fourth_draw_1), parseInt(fifth_draw_1), parseInt(sixth_draw_1)];
    details.time = dateFormat(new Date(), 'yyyy-mm-dd  "GMT"o --> HH:MM');

    if(last_draw_id != details.draw_id && details.draw_id != 'undefined'){
      let ruleResult = await RuleTest();
      playColorGame(details.draws, draw2, details.draw_id, ruleResult);
      last_draw_id = await details.draw_id;
    }
    //check for date difference
    if(date !== dateFormat(new Date(), 'yyyymmdd')){
      date = dateFormat(new Date(), 'yyyymmdd');
      data = [];
    }


    async function playColorGame(presentDraw, lastDraw, _id, ruleScores){
      
      minBankroll = 100000; //You must have this amount in your account
      
      const reservePercent = 100;// 10%
      
      await page.waitFor(1000);
      await page.click('.rs-menu__balance--refresh',{clickCount:5, delay: 200}).catch(err => {console.error(err.message); process.exit()});
      await page.waitFor(1000);

      // wallet balance
      totalBalance = await page.$eval('.rs-menu__balance-value', elem => parseInt(elem.textContent)).catch(err => console.error(err.message));

      const result = colorWinRule(myColor, presentDraw);

      

      won = result.won; //We won when our guess was not among the las draw

      wonStake = staked && won;

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
         console.log('What is happening! I though I won',_id, lastGuessValues, presentDraw,'Bal->',balance);
         // process.exit();
      }

      stakeReset = highestAmount === balance||wonStake ? 0: stakeReset+1;// To determine if we should increase stake amount

      staked = false;

      //Two ways color selector
      if(Math.max(ruleScores.mostAppeared, ruleScores.leastAppeared) >5){
        let mostColor = result.colors[0].name; //highest appearing color
        let leastColor = result.colors[2].name==='yellow'? result.colors[3].name : result.colors[2].name; //least appeared color
        
        if(stakeReset === 0){
          pattern = ruleScores.leastAppeared > 3 || ruleScores.leastAppeared >= ruleScores.mostAppeared ?
                        `leastColor` : `mostColor`;
        }

        myColor = pattern === result.colors[1].value != result.colors[2].value ||
                              'leastColor'? leastColor : mostColor;
        // myColor = leastColor;

        console.log(`mostAppeared: ${ruleScores.mostAppeared*10}% Vs leastAppeared: ${ruleScores.leastAppeared*10}% Pattern: ${pattern}`);
        
        await stakeOnRainbow(rainbowStakeColor(myColor, 2))
      }

      /*
      if((stakeCount>=0 && won) || startStaking||true){
        // myColor = won? result.colors[0].name : myColor;
        // myColor = result.colors[0].name; //highest appearing color
        myColor = result.colors[2].name==='yellow'? result.colors[3].name : result.colors[2].name; //least appeared color
        await stakeOnRainbow(rainbowStakeColor(myColor, 2))
         startStaking = true;
      }
      */

       // else staked = false;

       stakeCount += 1;
       drawCounts += 1;
    }

    function colorWinRule(chosenColor, presentDraw){
        const colors = [
          {name:'red',value:0}, 
          {name:'green',value:0}, 
          {name:'blue',value:0}, 
          {name:'yellow',value:0}
        ]

        const getColor = value => {
          const id = value % 3;
          return value === 49 ? 'yellow':
                 id===0? 'green':
                 id===1? 'red' : 'blue'
        }


        presentDraw.forEach(draw =>{
          const color = getColor(parseInt(draw));
          colors.forEach(col => {
            if(col.name === color) col.value += 1;
          });
        });

        let count = 0;
        let won = false;

        colors.sort((a,b)=>b.value - a.value);

        //Check for the highest color
        colors.forEach(color=>{
          if(color.value === colors[0].value) count++;
          if(chosenColor === color.name) won = color.value > 1;
          colors[0].isHighest = count < 2;
        });

        
        return {won, colors};
      }

    function getStakeAmount(reset){
        const getInvestmentSteps = require('../soccervestment');
        const steps = 4;
        const odds = 1.5;
        // Steps, Odds, Amount
        const layers = getInvestmentSteps(steps, odds, highestAmount);

        if(reset === steps){
            console.log('Bankroll Exhausted after',drawCounts,'draw counts','and we reserved =>', reservedAmount);
            // process.exit();
            reservedAmount = reservedAmount>= minBankroll? reservedAmount-minBankroll : process.exit();
            highestAmount = minBankroll;
            startStaking = false;
            stakeReset = 0;

            return Math.floor(layers[0]);
        }

        return Math.floor(layers[reset])
    }

    const rainbowStakeColor = (color, odds) =>{
      //This method returns the dom position for the stake value
      const table = {
        red:{0:0, 2:1, 3:2, 4:3, 5:4, 6:5},
        blue:{0:6, 2:7, 3:8, 4:9, 5:10, 6:11},
        green:{0:12, 2:13, 3:14, 4:15, 5:16, 6:17}
      }
      return table[color][odds];
    }

    async function stakeOnRainbow(stake){

      stakeAmount = getStakeAmount(stakeReset).toString();
      if(stakeAmount==0)return;
      console.log('Stake Amount: '+stakeAmount,myColor,'Account Balance -> '+balance,' |::-> highestAmount:',highestAmount);

      await page.waitFor(1000);
      await page.$eval('.stats__toggle.active', elem => elem.click()).catch(err => console.error(err.message));
      await page.waitFor(1000);
      await page.$$eval('.game-nav__item', elem => elem[3].click()).catch(err => console.error(err.message));
      // await page.waitFor(1000);
      await page.$$eval('.rainbow__ball-value', (elem, {stake}) => elem[stake].click(), {stake}).catch(err => console.error(err.message));
      
      /*
      stakeAmount = await Math.floor(stakeAmount/3).toString();
      for(var ball=0; ball<stake.length; ball++){
        //Here we are staking on 4+ colors to appear
        let stakeBall  = stake[ball];
        // await page.waitFor(1000);//Clear selection
        // await page.$$eval('.rainbow__ball-value', elem => elem[0].click()).catch(err => console.error(err.message));
        await page.waitFor(500); //Select Ball
        await page.$$eval('.rainbow__ball-value', (elem, {stakeBall}) => elem[stakeBall].click(), {stakeBall}).catch(err => console.error(err.message));


      }
      */

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

      //refresh balance and get value
      await page.waitFor(1000);
      await page.click('.rs-menu__balance--refresh').catch(err => {console.error(err.message); process.exit()});

      await page.waitFor(1000);//Reset
      await page.$eval('.available.active', elem => elem.click()).catch(err => console.error(err.message));
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
