import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DuoLensPrimaryColors } from "../styles/BrandColors";
import { WithLocalSvg } from "react-native-svg/css";
import { ProgressBar } from "../components/ProgressBar";
import { ChallengePageButton } from "../components/ChallengePageButton";

export const ChallengeScreen = ({}) => {
  const duoOwlAvatar = require("../../assets/duo-owl-angry.svg");

  const translationText = "You are very stupid and you smell like toe fungus";
  const wordArray = translationText.trim().split(" ");

  const wordSelectList = wordArray.map((item, index) => (
    <View style={styles.wordSelect} key={index}>
      <Text style={styles.wordSelectText} key={index}>
        {item}
      </Text>
    </View>
  ));
  return (
    <SafeAreaView style={styles.viewContainer}>
      <View style={styles.headerContainer}>
        <Ionicons name="settings-outline" size={30} color="#A6A6A7" />
        <View style={styles.progressBarContainer}>
          <ProgressBar percentage={50} />
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
      <View style={styles.translatePromptContainer}>
        <View style={styles.translateAvatarContainer}>
          <WithLocalSvg asset={duoOwlAvatar} height={"85%"} width={"90%"} />
        </View>
        <View style={styles.translateTextContainer}>
          <View style={styles.textSpeechBubble}>
            <Text style={styles.foreignText}>Dōmo arigatō misutā Robotto.</Text>
          </View>
        </View>
      </View>
      <View style={styles.ruledContainer}>
        <View style={styles.ruledLine}></View>
        <View style={styles.ruledLine}></View>
        <View style={styles.ruledLine}></View>
        <View style={styles.ruledLine}></View>
      </View>
      <View style={styles.wordSelectionContainer}>{wordSelectList}</View>
      <View style={styles.checkButtonContainer}>
        <ChallengePageButton enabled={true} />
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
    flexDirection: "row",
  },
  translateAvatarContainer: {
    width: "40%",
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  translateTextContainer: {
    // backgroundColor: "gray",
    flex: 1,
    height: "100%",
    justifyContent: "center",
    paddingLeft: "2%",
  },
  textSpeechBubble: {
    width: "90%",
    borderWidth: 2,
    borderRadius: "15%",
    borderColor: "#E6E6E6",
    padding: "7.5%",
    justifyContent: "center",
  },
  foreignText: {
    fontFamily: "Nunito_500Medium",
    fontSize: 16,
  },
  ruledContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    // borderWidth: 1,
    height: "24%",
    paddingHorizontal: "5%",
  },
  ruledLine: {
    backgroundColor: "#E6E6E6",
    height: 2,
    width: "100%",
    borderRadius: "50%",
  },
  wordSelectionContainer: {
    // borderWidth: 1,
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "5%",
    overflow: "hidden",
  },
  wordSelect: {
    paddingVertical: "2.5%",
    paddingHorizontal: "2%",
    borderRadius: "12.5%",
    borderColor: "#E6E6E6",
    borderWidth: 2,
    marginHorizontal: 3,
    marginVertical: 5,
    backgroundColor: "white",

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowColor: "#E6E6E6",
    shadowRadius: 0,
  },
  wordSelectText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 20,
  },
  checkButtonContainer: {
    paddingHorizontal: "5%",
    paddingBottom: 10,
  },
});
