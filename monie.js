const data = require('./monie.json');

for(i in data)
 console.log(
    `Names: ${data[i].firstName}
    Phone No: ${data[i].phoneNumber}
    Address: ${data[i].addressLineOne}\n`);