const solution = (A, K) => {
  let res = -1;
  if (A == null || A.length == 0) {
    return res;
  }

  A.sort((a, b) => a - b);
  let l = 0;
  let r = A.length - 1;
  while (l < r) {
    let sum = A[l] + A[r];
    if (sum < K) {
      res = Math.max(res, sum);
      l++;
    } else {
      r--;
    }
  }

  return res;
};

const solution2 = (numbers) => {
  const subsets = [[]];
  //   for (const number of numbers) {
  //     subsets.forEach((subset) => subsets.push([...subset, number]));
  //   }

  //   for (num of numbers) {
  //     subsets.map((elem) => subsets.push([...elem, num]));
  //   }
  //   for (let i = 0; i < numbers.length; i++) {
  //     subsets.map((el) => subsets.push([...el, numbers[i]]));
  //   }

  numbers.map((num) => subsets.map((el) => subsets.push([...el, num])));
  return subsets;
};

const solution3 = (arr, k) => {
  // Given an arrav A of integers and integer K. return the maximum S such that there
  // exists i < j with A[i] + A[j] = S and S < K. If no such i, i exist satisfying this equation
  // return -1
  let sum = -1;
  if (arr.length > 1000 || arr.length < 1) return sum;
  let i = 0;
  let j = arr.length - 1;
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i < j && arr[i] + arr[j] < k) sum = Math.max(arr[i] + arr[j], sum);
    }
  }

  //   while (i < j) {
  //     if (arr[i] + arr[j] < k) {
  //       sum = Math.max(arr[i] + arr[j], sum);
  //       i++;
  //     } else {
  //       j--;
  //     }
  //     count++;
  //   }
  console.log("Count: ", count);
  return sum;
};

const test1 = (arr)=>{
    let solution = [];
    // for(let i = 0; i<arr.length; i++){
    //     let value = '';
    //     if(!isNaN(arr[i])){
    //             value = arr[i];
    //     }
    //     if(arr[i]==='+'){
    //         value = solution[solution.length-1]+solution[solution.length-2];
    //     }
        
    //     if(arr[i]==='D'){
    //         value = solution[solution.length-1]*2;
    //     }
        
    //     if(arr[i]=='C'){
    //         solution.splice(solution.length-1,1);
    //     }else{
    //         solution.push(parseInt(value))
    //     }

    // }

    arr.map(x => {
        if(!isNaN(x)){
            solution.push(parseInt(x));
        }

        if(x === '+'){
            solution.push((solution[solution.length-1]+solution[solution.length-2]))
        }

        if(x==='D'){
            solution.push(solution[solution.length-1]*2)
        }

        if(x==='C'){
            solution.splice(solution.length-1, 1)
        }

    })

    return solution.reduce((a,b)=> a+b,0);
}

const test2 = (s)=>{
    if(s.length < 1 || s.length >104 || s.length%2 != 0){
        return 'Invalid'
    }

    const sArr = [...s]

    for(let i = 0; i < sArr.length; i++){
        // const validElement  = "(){}[]".includes(sArr[i]);
        // console.log(sArr[i], " is ", validElement);

        if(i%2 === 1 && getPair(sArr[i])!=sArr[i-1]){
            return "Invalid"
        }
    }

    return "Valid";
}

function getPair(s){
    switch (s) {
        case "{": return "}";
        case "}": return "{";
        case "(": return ")";
        case ")": return "(";
        case "[": return "]";
        case "]": return "[";
        default: return "";
    }
}

var lengthOfLongestSubstring = function(s) {
    let i = 0;
    let sArr = [...s]
    let sol = 0;
    
    while(i < sArr.length){
        let longest = []
        sArr.map(el => {
            if(!longest.includes(el))
                longest.push(el)
            else {
                sol = Math.max(sol, longest.length)
                sArr.splice(0, 1)
                console.log(sArr);
            }
        })
        i++;
    }
    console.log(sol);
};
lengthOfLongestSubstring("pwwkew")

// console.log(test2("(){{"));
// console.log(test1(["5","2", "C","D","+"]));
// console.log(test1(["5","-2","4", "C","D","9","+","+"]));
// console.log(solution2([1, 2, 3]));
// console.log(solution([34, 23, 54, 3, 1, 24, 2, 33], 6));
// console.log(solution3([34, 23, 54, 3, 1, 24, 2, 33], 6));
