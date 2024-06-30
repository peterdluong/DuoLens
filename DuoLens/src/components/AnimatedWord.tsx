import { ReactElement } from "react";
import { StyleSheet } from "react-native";
import {
  GestureDetector,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Offset } from "../types/Types";
import { Placeholder } from "./Placeholder";
import {
  Y_OFFSET_TEMP,
  between,
  calculateLayout,
  composeSentence,
  lastOrder,
  remove,
  reorder,
  useVector,
} from "../helper/helpers";

type AnimatedWordProps = {
  offsets: Offset[];
  children: ReactElement<{ word: string }>;
  index: number;
  containerWidth: number;
};

export const AnimatedWord = ({
  offsets,
  children,
  index,
  containerWidth,
}: AnimatedWordProps) => {
  const offset = offsets[index];
  const isGestureActive = useSharedValue(false);
  const translation = useVector();
  const isInBank = useDerivedValue(() => {
    return offset.order.value === -1;
  });

  const onGestureEventHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number; y: number }
  >({
    onStart: (evt, ctx) => {
      if (isInBank.value) {
        translation.x.value = offset.originalX.value;
        translation.y.value = offset.originalY.value + Y_OFFSET_TEMP;
      } else {
        translation.x.value = offset.x.value;
        translation.y.value = offset.y.value;
      }
      ctx.x = translation.x.value;
      ctx.y = translation.y.value;
      isGestureActive.value = true;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      translation.x.value = ctx.x + translationX;
      translation.y.value = ctx.y + translationY;
      if (isInBank.value && translation.y.value < 180) {
        offset.order.value = lastOrder(offsets);
        calculateLayout(offsets, containerWidth);
      } else if (!isInBank.value && translation.y.value > 180) {
        offset.order.value = -1;
        // remove(offsets, offset.order.value);
        remove(offsets, index);
        calculateLayout(offsets, containerWidth);
      }
      for (let i = 0; i < offsets.length; i++) {
        const offsetInstance = offsets[i];
        if (i === index && offsetInstance.order.value !== -1) {
          // ignore currently held offset and words in bank
          continue;
        }
        if (
          between(
            translation.x.value,
            offsetInstance.x.value,
            offsetInstance.x.value + offsetInstance.width.value
          ) &&
          between(
            translation.y.value,
            offsetInstance.y.value,
            offsetInstance.y.value + offsetInstance.height.value
          )
        ) {
          reorder(offsets, offset.order.value, offsetInstance.order.value);
          calculateLayout(offsets, containerWidth);
          break;
        }
      }
    },
    onEnd: () => {
      isGestureActive.value = false;
      translation.x.value = withSpring(offset.x.value, {
        mass: 2,
        damping: 35,
        stiffness: 200,
      });
      translation.y.value = withSpring(offset.y.value, {
        mass: 2,
        damping: 35,
        stiffness: 200,
      });
      const userSentence = composeSentence(offsets);
    },
  });

  const translateX = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.x.value;
    }
    return withSpring(
      isInBank.value ? offset.originalX.value : offset.x.value + 15,
      { mass: 2, damping: 35, stiffness: 200 }
    );
  });

  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.y.value;
    }
    return withSpring(
      isInBank.value
        ? offset.originalY.value + Y_OFFSET_TEMP
        : offset.y.value + 10,
      { mass: 2, damping: 35, stiffness: 200 }
    );
  });

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: isGestureActive.value ? 100 : 0,
      elevation: isGestureActive.value ? 100 : 0,
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
        {/* <GestureDetector gesture={onGestureEventHandler}> */}
        <PanGestureHandler onGestureEvent={onGestureEventHandler}>
          <Animated.View>{children}</Animated.View>
        </PanGestureHandler>
        {/* </GestureDetector> */}
      </Animated.View>
    </>
  );
};
