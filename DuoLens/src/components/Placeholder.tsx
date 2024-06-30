import { Dimensions, View } from "react-native";
import { Offset } from "../types/Types";
import { DuoLensNeutralColors } from "../styles/BrandColors";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Y_OFFSET_TEMP } from "../helper/helpers";

type PlaceholderProps = {
  offset: Offset;
};

export const Placeholder = ({ offset }: PlaceholderProps) => {
  const style = useAnimatedStyle(() => {
    return {
      top: offset.originalY.value + Y_OFFSET_TEMP + 2,
      left: offset.originalX.value + 3,
      width: offset.width.value - 6,
      height: offset.height.value - 14,
    };
  });
  return (
    <Animated.View
      style={[
        {
          backgroundColor: DuoLensNeutralColors.swan,
          position: "absolute",
          borderRadius: "12.5%",
        },
        style,
      ]}
    />
  );
};
