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

export { clampValue, randomizeArray };
