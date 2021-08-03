/**
 * @param {number[]} numbers An array of numbers.
 * @return {number[]} An array of unique numbers. 
 */
function findUniqueNumbers(numbers) {
  // Your code goes here
  let resultObject =[];
  for(let i=0; i<numbers.length; i++){
    if(resultObject.hasOwnProperty(numbers[i])){
       resultObject[numbers[i]] = resultObject[numbers[i]] + 1;
       }
    else {
      resultObject[numbers[i]] = 1;
    }
  }
  let result = [];
  for (const iterator of resultObject) {
      if(iterator === 1){
        result.push(iterator);
      }
  }
  
}

let result = findUniqueNumbers([ 1, 2, 1, 3 ]);
console.log(result);