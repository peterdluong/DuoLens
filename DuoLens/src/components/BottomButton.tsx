import { Animated, Easing, Pressable, StyleSheet, Text } from "react-native";
import {
  DuoLensNeutralColors,
  DuoLensPrimaryColors,
} from "../styles/BrandColors";
import * as Haptics from "expo-haptics";
import { useState } from "react";

type BottomButtonProps = {
  enabled: boolean;
  text?: string;
  type: string;
  onPressAction(): any;
};

export const BottomButton = (props: BottomButtonProps) => {
  const {
    enabled = false,
    text = "CHECK",
    type = "green",
    onPressAction = () => {
      alert("Dumbo");
    },
  } = props;
  const [offset] = useState(new Animated.Value(4));
  const [topMargin] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.timing(offset, {
      toValue: 0,
      duration: 25,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(topMargin, {
      toValue: 4,
      duration: 25,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.timing(offset, {
      toValue: 4,
      duration: 25,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(topMargin, {
      toValue: 0,
      duration: 25,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  if (enabled) {
    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPressAction}
      >
        <Animated.View
          style={[
            styles.bottomButton,
            {
              backgroundColor:
                type == "green" ? DuoLensPrimaryColors.feathergreen : "#ffc200",
              marginBottom: offset,
              marginTop: topMargin,
              shadowOffset: { width: 0, height: offset },
              shadowOpacity: 1,
              shadowColor: type == "green" ? "#6CA530" : "#f49000",
              shadowRadius: 0,
            },
          ]}
        >
          <Text
            style={[
              styles.bottomButtonText,
              { color: type == "green" ? "white" : "black" },
            ]}
          >
            {text.toUpperCase()}
          </Text>
        </Animated.View>
      </Pressable>
    );
  } else {
    return (
      <Pressable
        style={[
          styles.bottomButton,
          { backgroundColor: DuoLensNeutralColors.swan, marginTop: 4 },
        ]}
      >
        <Text
          style={[
            styles.bottomButtonText,
            { color: DuoLensNeutralColors.hare },
          ]}
        >
          {text.toUpperCase()}
        </Text>
      </Pressable>
    );
  }
};

const styles = StyleSheet.create({
  bottomButton: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10%",
  },
  bottomButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
  },
});
