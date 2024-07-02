import Animated, { SharedValue, useSharedValue } from "react-native-reanimated";
import { Offset } from "../types/Types";

export const Y_OFFSET_TEMP = 210;

export const clampValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const randomizeArray = (array: string[]) => {
  let tempArray = array;
  for (let i = tempArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let k = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = k;
  }
  return tempArray;
};

export const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
};

export const removePunctuation = (text: string) => {
  return text.replace(/[\.,?!]/g, "");
};

const isNotInWordbank = (offset: Offset) => {
  "worklet";
  return offset.order.value !== -1;
};

const byOrder = (a: Offset, b: Offset) => {
  "worklet";
  return a.order.value < b.order.value ? -1 : 1;
};

const move = <T,>(input: T[], from: number, to: number) => {
  "worklet";
  const offsets = input.slice();
  while (from < 0) {
    from += offsets.length;
  }
  while (to < 0) {
    to += offsets.length;
  }
  if (to >= offsets.length) {
    let k = to - offsets.length;
    while (k-- + 1) {
      offsets.push();
    }
  }
  offsets.splice(to, 0, offsets.splice(from, 1)[0]);
  return offsets;
};

export const remove = (input: Offset[], index: number) => {
  "worklet";
  const offsets = input
    .filter((_, i) => i != index)
    .filter(isNotInWordbank)
    .sort(byOrder);
  offsets.map((offset, newIndex) => (offset.order.value = newIndex));
};

export const reorder = (
  input: Offset[],
  fromPosition: number,
  toPosition: number
) => {
  "worklet";
  const offsets = input.filter(isNotInWordbank).sort(byOrder);
  const newOffset = move(offsets, fromPosition, toPosition);
  newOffset.map((offset, index) => (offset.order.value = index));
};

// function calculates layout everytime change is made to the order
export const calculateLayout = (input: Offset[], containerWidth: number) => {
  "worklet";
  // console.log("calculating layout");
  // isolate the words that are currently in ruled area and sort
  const offsets = input.filter(isNotInWordbank).sort(byOrder);
  if (offsets.length === 0) {
    return;
  }
  let lineNumber = 0;
  let lineBreak = 0;
  const height = offsets[0].height.value;

  // iterate through each item in offset array
  offsets.forEach((offset, index) => {
    // slice array from previous line break to current offset item
    // and calculate total width. if total width exceeds screen width,
    // indicate line break and move the current offset item to next
    // line row (with x value of 0)
    const totalWidth = offsets
      .slice(lineBreak, index)
      .reduce((accWidth, item) => accWidth + item.width.value, 0);
    if (totalWidth + offset.width.value > containerWidth) {
      lineNumber += 1;
      lineBreak = index;
      offset.x.value = 0;
    } else {
      offset.x.value = totalWidth;
    }
    // height is constant height * current line number
    offset.y.value = height * lineNumber;

    // console.log(
    //   `index: ${index} offset.x: ${totalWidth} offset.y: ${height * lineNumber}`
    // );
  });
  // console.log("done calculating layout");
};

interface Vector<T = number> {
  x: T;
  y: T;
}

export const useVector = (x1 = 0, y1?: number): Vector<SharedValue<number>> => {
  const x = useSharedValue(x1);
  const y = useSharedValue(y1 ?? x1);
  return { x, y };
};

export const lastOrder = (input: Offset[]) => {
  "worklet";
  return input.filter(isNotInWordbank).length;
};

export const between = (
  value: number,
  lowerBound: number,
  upperBound: number,
  inclusive = true
) => {
  "worklet";
  if (inclusive) {
    return value >= lowerBound && value <= upperBound;
  }
  return value > lowerBound && value < upperBound;
};

export const composeSentence = (input: Offset[]) => {
  "worklet";
  const offsets = input.filter(isNotInWordbank).sort(byOrder);
  let accumulatedSentence = "";
  offsets.forEach((item, index) => {
    if (index == 0) {
      accumulatedSentence = item.text.value;
    } else {
      accumulatedSentence += ` ${item.text.value}`;
    }
  });
  // console.log(accumulatedSentence);
  return accumulatedSentence;
};
