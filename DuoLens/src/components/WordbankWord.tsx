import { Animated, Easing, Pressable, StyleSheet, Text } from "react-native";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { DuoLensNeutralColors } from "../styles/BrandColors";

type WordbankWordProps = {
  word: string;
};

export const WordbankWord = ({ word }: WordbankWordProps) => {
  const [offset] = useState(new Animated.Value(2));
  const [topMargin] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.timing(offset, {
      toValue: 0,
      duration: 25,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(topMargin, {
      toValue: 2,
      duration: 25,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.timing(offset, {
      toValue: 2,
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

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ marginHorizontal: 3, marginBottom: 12 }}
    >
      <Animated.View
        style={[
          styles.wordbankWord,
          {
            shadowOffset: { width: 0, height: offset },
            marginTop: topMargin,
            marginBottom: offset,
          },
        ]}
      >
        <Text style={styles.wordbankWordText}>{word}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wordbankWord: {
    paddingVertical: 9,
    paddingHorizontal: 7,
    borderRadius: "12.5%",
    borderColor: DuoLensNeutralColors.swan,
    borderWidth: 2,
    backgroundColor: DuoLensNeutralColors.snow,

    shadowOpacity: 1,
    shadowColor: DuoLensNeutralColors.swan,
    shadowRadius: 0,
  },
  wordbankWordText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 20,
  },
});
