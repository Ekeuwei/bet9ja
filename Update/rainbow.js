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
let lastGuessValues = [];
let staked = false;
let drawCounts = 1;
let stakeCount = 1;
let reservedAmount = 0;
let stakeReset = 0;
let startStaking = false;
let minBankroll; //You must have this amount in your account
let highestAmount, balance,totalBalance, won, wonStake;
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
      last_draw_id = await details.draw_id;
    }
    //check for date difference
    if(date !== dateFormat(new Date(), 'yyyymmdd')){
      date = dateFormat(new Date(), 'yyyymmdd');
      data = [];
    }


    async function getBetZeros(presentDraw, lastDraw, _id){
      
      minBankroll = 100000; //You must have this amount in your account
      
      const reservePercent = 100;// 10%
      
      await page.waitFor(1000);
      await page.click('.rs-menu__balance--refresh',{clickCount:5, delay: 200}).catch(err => {console.error(err.message); process.exit()});
      await page.waitFor(1000);

      // wallet balance
      totalBalance = await page.$eval('.rs-menu__balance-value', elem => parseInt(elem.textContent)).catch(err => console.error(err.message));

       const drawNumbersInLastGuess = intersection(presentDraw, lastGuessValues);
       //const drawNumbersInLastGuess = presentDraw.filter(element => lastGuessValues.includes(element));
       won = drawNumbersInLastGuess.length == 0; //We won when our guess was not among the las draw

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


       if((stakeCount>=0 && won) || startStaking){
        if(won){
            // await stakeOnBetzero(false)
        }else{
            // await stakeOnBetzero(lastGuessValues);
        }
            await stakeOnBetzero([1,11,39,49])
         startStaking = true;
       }

       // else staked = false;

       stakeCount += 1;
       drawCounts += 1;
    }
    function intersection (a, b) {
        const setA = new Set(a);
        return b.filter(value => setA.has(value));
    }
    function getStakeAmount(reset){
        const getInvestmentSteps = require('./soccervestment');
        // Steps, Odds, Amount
        const steps = getInvestmentSteps(4, 1.65, highestAmount);

        if(reset > 2){
            console.log('Bankroll Exhausted after',drawCounts,'draw counts','and we reserved =>', reservedAmount);
            // process.exit();
            reservedAmount = reservedAmount>= minBankroll? reservedAmount-minBankroll : process.exit();
            highestAmount = minBankroll;
            startStaking = false;
            stakeReset = 0;

            return Math.floor(steps[0]);
        }

        return Math.floor(steps[reset])
    }

    async function stakeOnBetzero(stake){

      stakeAmount = getStakeAmount(stakeReset).toString();
      if(stakeAmount==0)return;
      console.log('Stake Amount: '+stakeAmount,'Account Balance -> '+balance,' |::-> highestAmount:',highestAmount);

      await page.waitFor(1000);

      await page.$eval('.stats__toggle.active', elem => elem.click()).catch(err => console.error(err.message));
      await page.waitFor(1000);
      await page.$$eval('.game-nav__item', elem => elem[5].click()).catch(err => console.error(err.message));
      await page.waitFor(1000);
      await page.click('.g-ctrl__row:nth-child(2)').catch(err => console.error(err.message));
      await page.waitFor(500);

      if(!stake){
        // Lucky dip (Get random numbers)
        await page.$eval('.g-btn', elem => elem.click()).catch(err => console.error(err.message));
      } else{
        // Before you stake

        let ballOne  = stake[0]-1;
        let ballTwo  = stake[1]-1;
        let ballThree  = stake[2]-1;
        let ballFour  = stake[3]-1;
      
        await page.$$eval('.ball-grid__item', (elem, {ballOne}) => elem[ballOne].click(), {ballOne}).catch(err => console.error(err.message));
        await page.waitFor(500);
        await page.$$eval('.ball-grid__item', (elem, {ballTwo}) => elem[ballTwo].click(), {ballTwo}).catch(err => console.error(err.message));
        await page.waitFor(500);
        await page.$$eval('.ball-grid__item', (elem, {ballThree}) => elem[ballThree].click(), {ballThree}).catch(err => console.error(err.message));
        await page.waitFor(500);
        await page.$$eval('.ball-grid__item', (elem, {ballFour}) => elem[ballFour].click(), {ballFour}).catch(err => {console.error(err.message); process.exit()});
      }

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

      let stakedVaues = await page.$$eval('.bets__stake-txt', elem => elem[0].textContent).catch(err => console.error(err.message));
      lastGuessValues = [parseInt(stakedVaues.split(',')[0]), parseInt(stakedVaues.split(',')[1]), parseInt(stakedVaues.split(',')[2]), parseInt(stakedVaues.split(',')[3])]

      console.log('Staked ', staked, lastGuessValues);

      //refresh balance and get value
      await page.waitFor(1000);
      await page.click('.rs-menu__balance--refresh').catch(err => {console.error(err.message); process.exit()});

      // await page.$$('.g-ctrl__item', elem => elem[2].click()).catch(err => console.error(err.message));//clear btn
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
