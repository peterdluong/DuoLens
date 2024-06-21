import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LanguageSelectionScreen } from "../screens/LanguageSelectionScreen";
import { ChallengeScreen } from "../screens/ChallengeScreen";
import { CameraScreen } from "../screens/CameraScreen";

export const Navigation = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

const NativeStack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <NativeStack.Navigator
      initialRouteName="LanguageSelectionScreen"
      screenOptions={{ headerShown: false }}
    >
      <NativeStack.Screen
        name="LanguageSelectionScreen"
        component={LanguageSelectionScreen}
      />
      <NativeStack.Screen name="ChallengeScreen" component={ChallengeScreen} />
      <NativeStack.Screen name="CameraScreen" component={CameraScreen} />
    </NativeStack.Navigator>
  );
};
