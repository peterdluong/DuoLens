import {
  FlatList,
  Pressable,
  SafeAreaView,
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
    <SafeAreaView style={styles.safeAreaContainer}>
      <View>
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
      <View style={styles.centralContainer}>
        <FlatList
          data={SupportedLanguages.sort()}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <LanguagePressableSmall
              languageName={item}
              selected={item === selected}
              onSelect={() => onSelect(item)}
            />
          )}
          contentContainerStyle={styles.flatlistContainer}
        />
      </View>
      <View style={styles.confirmButtonContainer}>
        <BottomButton
          enabled={selected != null}
          text="Confirm"
          type="orange"
          onPressAction={() =>
            navigation.navigate("ChallengeScreen", {
              selectedLanguage: selected,
            })
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: DuoLensPrimaryColors.feathergreen,
    flex: 1,
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
  centralContainer: {
    flex: 1,
    borderTopColor: "#6CA530",
    borderBottomColor: "#6CA530",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    marginTop: 18,
    marginBottom: 14,
    backgroundColor: DuoLensNeutralColors.snow,
  },
  flatlistContainer: {
    backgroundColor: DuoLensNeutralColors.snow,
    alignItems: "center",
    paddingVertical: 10,
  },
  confirmButtonContainer: {
    paddingHorizontal: "5%",
    paddingBottom: 10,
  },
});
