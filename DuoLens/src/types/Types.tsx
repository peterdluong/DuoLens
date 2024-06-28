import { SharedValue } from "react-native-reanimated";

type SharedValues<T extends Record<string, string | number | boolean>> = {
  [K in keyof T]: SharedValue<T[K]>;
};

type Offset = SharedValues<{
  order: number;
  width: number;
  height: number;
  x: number;
  y: number;
  originalX: number;
  originalY: number;
}>;

const Y_OFFSET_TEMP = 210;

export { Offset, Y_OFFSET_TEMP };
