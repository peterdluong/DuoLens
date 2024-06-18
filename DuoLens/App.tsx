import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import { Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { LanguageSelectionScreen } from "./src/screens/LanguageSelectionScreen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Feather-Bold": require("./assets/fonts/feather_bold.ttf"),
    Nunito_800ExtraBold,
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
      <LanguageSelectionScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
});
