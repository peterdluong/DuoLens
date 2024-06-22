import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  DuoLensNeutralColors,
  DuoLensPrimaryColors,
} from "../styles/BrandColors";
import { LanguagePressableSmall } from "../components/LanguagePressableSmall";
import { SupportedLanguages } from "../data/SupportedLanguages";
import { ChallengePageButton } from "../components/ChallengePageButton";

export const LanguageSelectionScreen = ({}) => {
  const languagePressableList = SupportedLanguages.sort().map((item) => (
    <LanguagePressableSmall
      languageName={item}
      key={item}
    ></LanguagePressableSmall>
  ));

  return (
    <SafeAreaView style={[styles.duolingoGreen, { flex: 1 }]}>
      <View style={{ backgroundColor: DuoLensPrimaryColors.feathergreen }}>
        <Text style={styles.headerText}>duolens</Text>
      </View>
      <View>
        <Text style={styles.instructionText}>
          Select a language for a spooky challenge!
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          borderWidth: 3,
          marginHorizontal: 10,
          marginVertical: 20,
        }}
      >
        <ScrollView contentContainerStyle={[styles.container]}>
          <View style={styles.viewContainer}>
            <View style={{ marginBottom: 10 }}></View>
            {languagePressableList}
          </View>
        </ScrollView>
      </View>
      <View style={styles.checkButtonContainer}>
        <ChallengePageButton
          enabled={true}
          text="Confirm"
          type="orange"
          navScreen="ChallengeScreen"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  viewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  headerText: {
    color: DuoLensNeutralColors.snow,
    fontFamily: "Feather-Bold",
    textAlign: "center",
    fontSize: 40,
    marginHorizontal: 24,
  },
  instructionText: {
    color: DuoLensNeutralColors.snow,
    fontFamily: "Nunito_800ExtraBold",
    textAlign: "center",
    fontSize: 32,
    marginHorizontal: 24,
    marginTop: 24,
  },
  duolingoGreen: {
    backgroundColor: DuoLensPrimaryColors.feathergreen,
  },
  checkButtonContainer: {
    paddingHorizontal: "5%",
    paddingBottom: 10,
  },
});
