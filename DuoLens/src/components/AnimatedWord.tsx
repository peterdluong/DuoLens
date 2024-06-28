import { ReactElement } from "react";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { Offset, Y_OFFSET_TEMP } from "../types/Types";
import { Placeholder } from "./Placeholder";

type AnimatedWordProps = {
  offsets: Offset[];
  children: ReactElement<{ id: number }>;
  index: number;
  containerWidth?: number;
};

export const AnimatedWord = ({
  offsets,
  children,
  index,
  containerWidth,
}: AnimatedWordProps) => {
  const offset = offsets[index];
  const isInBank = useDerivedValue(() => {
    return offset.order.value === -1;
  });
  const translateX = useDerivedValue(() => {
    if (isInBank) {
      return offset.originalX.value;
    } else {
      return offset.x.value;
    }
  });

  const translateY = useDerivedValue(() => {
    if (isInBank) {
      return offset.originalY.value + Y_OFFSET_TEMP;
    } else {
      return offset.y.value;
    }
  });

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: offset.width.value,
      height: offset.height.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <>
      <Placeholder offset={offset} />
      <Animated.View style={style}>
        <PanGestureHandler>
          <Animated.View>{children}</Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </>
  );
};
