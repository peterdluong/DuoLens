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
  text: string;
}>;

export { Offset };
