import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DuoLensPrimaryColors } from "../styles/BrandColors";

export const ChallengeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.viewContainer}>
      <View style={styles.headerContainer}>
        <Ionicons name="settings-outline" size={30} color="#A6A6A7" />
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressBarProgress}>
              <View style={styles.progressBarProgressShine} />
            </View>
          </View>
        </View>
        <Ionicons
          name="heart"
          size={30}
          color={DuoLensPrimaryColors.cardinal}
        />
        <Text style={styles.livesText}>5</Text>
      </View>
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Translate this sentence, dumbo
        </Text>
      </View>
      <View style={styles.translatePromptContainer}></View>
      <View style={styles.ruledContainer}></View>
      <View style={styles.wordSelectionContainer}></View>
      <View style={styles.checkButtonContainer}>
        <Pressable style={styles.checkButton}>
          <Text style={styles.checkButtonText}> CHECK</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "5%",
    marginTop: 20,
    paddingHorizontal: "4%",
  },
  progressBarContainer: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  progressBar: {
    height: 18,
    width: "100%",
    backgroundColor: "#E6E6E6",
    borderRadius: "20%",
  },
  progressBarProgress: {
    height: "100%",
    width: "50%",
    backgroundColor: "#79CA3D",
    borderRadius: "20%",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  progressBarProgressShine: {
    height: "30%",
    width: "100%",
    backgroundColor: "#90D453",
    borderRadius: "20%",
    marginTop: 18 * 0.25,
  },
  livesText: {
    fontFamily: "Nunito_800ExtraBold",
    color: DuoLensPrimaryColors.cardinal,
    marginLeft: 5,
    fontSize: 20,
  },
  instructionContainer: {
    height: "6%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "5%",
    // borderWidth: 1,
  },
  instructionText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    color: "#4D4D4C",
    flexWrap: "wrap",
    flexShrink: 1,
    flex: 1,
  },
  translatePromptContainer: {
    // borderWidth: 1,
    height: "25%",
  },
  ruledContainer: {
    // borderWidth: 1,
    height: "24%",
  },
  wordSelectionContainer: {
    // borderWidth: 1,
    height: "28%",
    flex: 1,
  },
  checkButtonContainer: {
    height: "8%",
    paddingHorizontal: "5%",
  },
  checkButton: {
    height: 48,
    // backgroundColor: "#E6E6E6",
    backgroundColor: DuoLensPrimaryColors.feathergreen,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10%",
  },
  checkButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    // color: "#AFAFAF",
    color: "white",
    fontSize: 16,
  },
});
