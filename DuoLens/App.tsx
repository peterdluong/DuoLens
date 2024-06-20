import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import {
  Nunito_500Medium,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from "@expo-google-fonts/nunito";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { ChallengeScreen } from "./src/screens/ChallengeScreen";
import { Navigation } from "./src/navigation";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Feather-Bold": require("./assets/fonts/feather_bold.ttf"),
    Nunito_500Medium,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={[styles.container, { flex: 1 }]}>
      {/* <ChallengeScreen /> */}
      <Navigation />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
});
