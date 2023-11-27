'use strict'
//get files
var colors = require('colors');
const files = require('./stats_20201214.json');
let noColorCount = 0;

for(var i = 0; i< files.length; i++){
  const presentDraw = files[i].draws;
  // const won = highestColor(presentDraw) == 'none';
  // const won = fourPlusBalls(presentDraw);
  const won = !presentDraw.filter(element => [1,3].includes(element)).length==0; //intersection
  if(won) noColorCount = 0;
  else noColorCount+=1;
  console.log(files[i].draw_id, '-> ', colorIt(presentDraw[0]),colorIt(presentDraw[1]),colorIt(presentDraw[2]),colorIt(presentDraw[3]),colorIt(presentDraw[4]),colorIt(presentDraw[5]), won?'Hit :-)':'Missed :-(','count:',noColorCount,'      -------'+files[i].time.split('>')[1]);
}
function fourPlusBalls(arr){
  var counts = {};
  for (var i = 0; i < arr.length; i++) {
    var num = checkColor(arr[i]);
     counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  const uptoFourColors = counts.red >= 4 || counts.blue >= 4 || counts.green >= 4;
  return 	uptoFourColors;
}
function colorIt(value){
  const red = value === 1 || value%3 === 1;
  const blue = value === 2 || value%3 === 1+1;
  const green = value === 3 || value%3 === 1+2;
  return value === 49? colors.yellow(value):red? colors.red(value): blue? colors.blue(value):colors.green(value);
  // console.log(vall);
}
function checkColor(value){
  const red = value === 1 || value%3 === 1;
  const blue = value === 2 || value%3 === 1+1;
  const green = value === 3 || value%3 === 1+2;
  return value === 49? 'yellow':red? 'red': blue? 'blue':'green';
}
function highestColor(arr){
  //checks the occurrence of equal colors
  var counts = {};
  for (var i = 0; i < arr.length; i++) {
    var num = checkColor(arr[i]);
     counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  const noWinColor = (counts.red===counts.blue && counts.red === counts.green && counts.blue === counts.green)//They were are all two
                      ||((counts.red===2 && counts.green===2) || (counts.red===2&&counts.blue===2)||(counts.green===2&&counts.blue===2))
                      ||(counts.red==3 && counts.red === counts.blue) || (counts.red==3 && counts.red===counts.green)
                      || (counts.blue==3 && counts.blue===counts.green);
  return 	noWinColor? 'none': counts.red >= 3 ? 'red':counts.blue >= 3 ? 'blue': 'green';
}
