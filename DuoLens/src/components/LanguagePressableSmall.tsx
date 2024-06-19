import { useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

type LanguagePressableSmallProps = {
  languageName?: string;
};

export const LanguagePressableSmall = (props: LanguagePressableSmallProps) => {
  const { languageName = "English" } = props;
  const [scale] = useState(new Animated.Value(1));
  const navigation = useNavigation();

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      unstable_pressDelay={100}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => navigation.navigate("ChallengeScreen")}
    >
      <Animated.View style={[styles.pressableView, { transform: [{ scale }] }]}>
        <Text style={styles.pressableText}>{languageName}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableView: {
    width: Dimensions.get("window").width * 0.9,
    height: 50,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    margin: 10,
  },
  pressableText: {
    color: "black",
    fontFamily: "Nunito_800ExtraBold",
    textAlign: "center",
    fontSize: 22,
  },
});
