import { useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import * as Haptics from "expo-haptics";
import { DuoLensNeutralColors } from "../styles/BrandColors";

type LanguagePressableSmallProps = {
  languageName?: string;
  selected: boolean;
  onSelect(): any;
};

export const LanguagePressableSmall = (props: LanguagePressableSmallProps) => {
  const {
    languageName = "English",
    selected = false,
    onSelect = () => {
      alert("Dumbo");
    },
  } = props;
  const shadowHeight = 2;
  const [offset] = useState(new Animated.Value(shadowHeight));
  const [topMargin] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.timing(offset, {
      toValue: 0,
      duration: 25,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(topMargin, {
      toValue: shadowHeight,
      duration: 25,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.timing(offset, {
      toValue: shadowHeight,
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
      unstable_pressDelay={100}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onSelect}
      style={{ margin: 9 }}
    >
      <Animated.View
        style={[
          styles.pressableView,
          {
            marginBottom: offset,
            marginTop: topMargin,
            shadowOffset: { width: 0, height: offset },
            backgroundColor:
              selected == true ? "#E1F3FE" : DuoLensNeutralColors.snow,
            borderColor:
              selected == true ? "#97D5FB" : DuoLensNeutralColors.swan,
            shadowColor:
              selected == true ? "#97D5FB" : DuoLensNeutralColors.swan,
          },
        ]}
      >
        <Text
          style={[
            styles.pressableText,
            { color: selected == true ? "#4897D1" : "black" },
          ]}
        >
          {languageName}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableView: {
    width: Dimensions.get("window").width * 0.9,
    height: 46,
    borderWidth: 2,
    shadowOpacity: 1,
    shadowRadius: 0,
    borderRadius: "10%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
  pressableText: {
    fontFamily: "Nunito_800ExtraBold",
    textAlign: "center",
    fontSize: 22,
  },
});
