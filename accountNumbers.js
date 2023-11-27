function generateTransactionId() {
  const transactionIdLength = 30;
  const digits = '0123456789';
  let transactionId = ''; // Start with 2 to ensure that the transaction ID is 30 digits

  for (let i = 0; i < transactionIdLength; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length).toString();
    const digit = digits[randomIndex];
    transactionId += digit;
  }

  console.log(transactionId);
//   return transactionId;
}

for(let i = 0; i < 10; i+=1)
    generateTransactionId(i);