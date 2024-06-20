import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DuoLensPrimaryColors } from "../styles/BrandColors";
import { LanguagePressableSmall } from "../components/LanguagePressableSmall";
import { SupportedLanguages } from "../data/SupportedLanguages";

export const LanguageSelectionScreen = ({}) => {
  const languagePressableList = SupportedLanguages.sort().map((item) => (
    <LanguagePressableSmall
      languageName={item}
      key={item}
    ></LanguagePressableSmall>
  ));

  return (
    <View style={[styles.duolingoGreen, { flex: 1 }]}>
      <ScrollView
        contentContainerStyle={[styles.container, styles.duolingoGreen]}
      >
        <View style={styles.viewContainer}>
          <Text style={styles.text}>
            Select a language for a spooky challenge!
          </Text>
          <View style={{ marginBottom: 10 }}></View>
          {languagePressableList}
        </View>
      </ScrollView>
    </View>
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
    marginVertical: 60,
  },
  text: {
    color: "white",
    fontFamily: "Feather-Bold",
    textAlign: "center",
    fontSize: 32,
    marginHorizontal: 24,
  },
  duolingoGreen: {
    backgroundColor: DuoLensPrimaryColors.feathergreen,
  },
});
