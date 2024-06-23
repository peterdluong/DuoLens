import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  DuoLensNeutralColors,
  DuoLensPrimaryColors,
} from "../styles/BrandColors";
import { LanguagePressableSmall } from "../components/LanguagePressableSmall";
import { SupportedLanguages } from "../data/SupportedLanguages";
import { BottomButton } from "../components/BottomButton";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export const LanguageSelectionScreen = ({}) => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null as unknown);
  const onSelect = (selectedLang: string) => {
    setSelected(selectedLang);
  };

  return (
    <SafeAreaView style={[styles.duolingoGreen, { flex: 1 }]}>
      <View style={{ backgroundColor: DuoLensPrimaryColors.feathergreen }}>
        <Pressable
          onPress={() => setSelected(null)}
          style={{ alignSelf: "center" }}
        >
          <Text style={styles.headerText}>duolens</Text>
        </Pressable>
      </View>
      <View>
        <Text style={styles.instructionText}>
          Select a language for a spooky challenge!
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          borderTopColor: "#6CA530",
          borderBottomColor: "#6CA530",
          borderTopWidth: 2,
          borderBottomWidth: 2,
          marginTop: 18,
          marginBottom: 14,
          backgroundColor: DuoLensNeutralColors.snow,
        }}
      >
        <FlatList
          keyExtractor={(item) => item}
          data={SupportedLanguages.sort()}
          renderItem={({ item }) => (
            <LanguagePressableSmall
              languageName={item}
              selected={item === selected}
              onSelect={() => onSelect(item)}
            />
          )}
          contentContainerStyle={[styles.container, styles.viewContainer]}
        />
      </View>
      <View style={styles.confirmButtonContainer}>
        <BottomButton
          enabled={selected != null}
          text="Confirm"
          type="orange"
          onPressAction={() => navigation.navigate("ChallengeScreen")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DuoLensNeutralColors.snow,
  },
  viewContainer: {
    // flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    // marginTop: 30,
    paddingVertical: 10,
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
  confirmButtonContainer: {
    paddingHorizontal: "5%",
    paddingBottom: 10,
  },
});
