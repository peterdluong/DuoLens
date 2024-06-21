import { Animated, Easing, Pressable, StyleSheet, Text } from "react-native";
import { DuoLensPrimaryColors } from "../styles/BrandColors";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

type ChallengePageButtonProps = {
  enabled: boolean;
  text?: string;
};

export const ChallengePageButton = (props: ChallengePageButtonProps) => {
  const { enabled = false, text = "CHECK" } = props;
  const [offset] = useState(new Animated.Value(4));
  const [topMargin] = useState(new Animated.Value(0));
  const navigation = useNavigation();

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
        onPress={() => {
          // navigation.navigate("LanguageSelectionScreen");
        }}
      >
        <Animated.View
          style={[
            styles.checkButton,
            {
              backgroundColor: DuoLensPrimaryColors.feathergreen,
              marginBottom: offset,
              marginTop: topMargin,
              shadowOffset: { width: 0, height: offset },
              shadowOpacity: 1,
              shadowColor: "#6CA530",
              shadowRadius: 0,
            },
          ]}
        >
          <Text style={[styles.checkButtonText, { color: "white" }]}>
            {text.toUpperCase()}
          </Text>
        </Animated.View>
      </Pressable>
    );
  } else {
    return (
      <Pressable
        style={[
          styles.checkButton,
          { backgroundColor: "#E6E6E6", marginTop: 4 },
        ]}
      >
        <Text style={[styles.checkButtonText, { color: "#AFAFAF" }]}>
          {text.toUpperCase()}
        </Text>
      </Pressable>
    );
  }
};

const styles = StyleSheet.create({
  checkButton: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10%",
  },
  checkButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
  },
});
