const clampValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const randomizeArray = (array: string[]) => {
  let tempArray = array;
  for (let i = tempArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let k = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = k;
  }
  return tempArray;
};

const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
};

export { clampValue, randomizeArray, getRandomInt };
