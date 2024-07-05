import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  DuoLensNeutralColors,
  DuoLensPrimaryColors,
} from "../styles/BrandColors";
import { WithLocalSvg } from "react-native-svg/css";
import { ProgressBar } from "../components/ProgressBar";
import { BottomButton } from "../components/BottomButton";
import {
  getRandomInt,
  randomizeArray,
  removePunctuation,
} from "../helper/helpers";
import { useNavigation } from "@react-navigation/native";
import { translation_database } from "./../data/TranslationDatabase.json";
import {
  correct_sound_clips_database,
  wrong_sound_clips_database,
} from "../data/SoundClipsDB";
import { ChallengeArea } from "../components/ChallengeArea";
import { WordbankWord } from "../components/WordbankWord";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Audio } from "expo-av";

export const ChallengeScreen = ({ route }) => {
  const navigation = useNavigation();
  const duoOwlAvatar = require("../../assets/duo-owl-angry.svg");
  const { selectedLanguage } = route.params;

  const [sentence, setSentence] = useState("");
  const [continueMode, setContinueMode] = useState(false);

  const randomIndex = useRef(getRandomInt(0, translation_database.length));
  // randomIndex.current = getRandomInt(0, translation_database.length);
  // const randomChallengeTextIndex = randomIndex.current;

  // const randomChallengeTextIndex = getRandomInt(0, translation_database.length);

  // const translationText = "You are very stupid and you smell";
  const translationText = removePunctuation(
    translation_database[randomIndex.current].English
  );
  let wordArray = translationText.trim().split(" ");
  const randomizedWordArray = useRef(randomizeArray(wordArray));

  //////////////////////////////////////////////// AUDIO

  const [correctSound, setCorrectSound] = useState();
  const [wrongSound, setWrongSound] = useState();
  const correctSoundIndex = useRef(0);
  const wrongSoundIndex = useRef(0);

  useEffect(() => {
    correctSoundIndex.current = getRandomInt(
      0,
      correct_sound_clips_database.length
    );
    wrongSoundIndex.current = getRandomInt(
      0,
      wrong_sound_clips_database.length
    );
  }, []);

  useEffect(() => {
    return correctSound
      ? () => {
          correctSound.unloadAsync();
        }
      : undefined;
  }, []);

  useEffect(() => {
    return wrongSound
      ? () => {
          wrongSound.unloadAsync();
        }
      : undefined;
  }, []);

  const playCorrectSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      correct_sound_clips_database[correctSoundIndex.current]["Path"]
    );
    setCorrectSound(correctSound);
    await sound.playAsync();
  };
  const playWrongSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      wrong_sound_clips_database[wrongSoundIndex.current]["Path"]
    );
    setWrongSound(wrongSound);
    await sound.playAsync();
  };

  //////////////////////////////////////////////// AUDIO

  const bottomSheetHeight = 170;
  const bottomSheetVisible = useSharedValue(false);
  const bottomSheetVertOffset = useDerivedValue(() => {
    return withTiming(bottomSheetVisible.value ? 0 : -bottomSheetHeight, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  });
  useSharedValue(-bottomSheetHeight);
  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: sentence === translationText ? "#E1FEC1" : "#FAE0E1",
      position: "absolute",
      height: bottomSheetHeight,
      // width: Dimensions.get("window").width,
      width: "150%",
      zIndex: 2,
      bottom: bottomSheetVertOffset.value,
      marginBottom: -50,
      paddingHorizontal: "5%",
      paddingTop: "4%",
    };
  });

  return (
    <SafeAreaView style={styles.viewContainer}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="settings-outline" size={30} color="#A6A6A7" />
        </Pressable>
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
            <Text style={styles.foreignText}>
              {/* {`You selected ${selectedLanguage}\n`}Dōmo arigatō misutā Robotto. */}
              {translation_database[randomIndex.current][selectedLanguage]}
            </Text>
          </View>
        </View>
      </View>
      {/* <ChallengeArea scrambledTextArray={wordArray} /> */}
      <ChallengeArea updateSentence={setSentence}>
        {randomizedWordArray.current.map((item, index) => (
          <WordbankWord
            word={item}
            key={index}
            // onPressAction={() => {
            //   alert(index);
            // }}
          />
        ))}
      </ChallengeArea>
      <View style={styles.checkButtonContainer}>
        <BottomButton
          enabled={sentence !== "" ? true : false}
          type={continueMode && sentence !== translationText ? "red" : "green"}
          //   onPressAction={() => navigation.navigate("CameraScreen")}
          text={continueMode ? "Continue" : "Check"}
          onPressAction={() => {
            if (continueMode) {
              navigation.navigate("CameraScreen", {
                language: selectedLanguage,
                correctness: sentence === translationText,
              });
            } else {
              sentence === translationText
                ? playCorrectSound()
                : playWrongSound();
              setContinueMode(true);
              bottomSheetVisible.value = true;
            }
            // alert(
            //   sentence === translationText
            //     ? `You're correct! \n\nThe corrected phrase is: ${translationText}`
            //     : `You're wrong!\n\n You entered: ${sentence}\n\nThe correct phrase is: ${translationText}`
            // );
          }}
        />
        <Animated.View style={bottomSheetStyle}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {sentence === translationText ? (
              <Ionicons name="checkmark-circle" size={30} color="#6CA530" />
            ) : (
              <Ionicons name="close-circle" size={30} color="#D63F38" />
            )}
            <Text
              style={{
                fontFamily: "Nunito_800ExtraBold",
                color: sentence === translationText ? "#6CA530" : "#D63F38",
                fontSize: 22,
                marginLeft: 10,
              }}
            >
              {sentence === translationText ? `Great job!` : `Incorrect`}
            </Text>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: DuoLensNeutralColors.snow,
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
    borderColor: DuoLensNeutralColors.swan,
    padding: "7.5%",
    justifyContent: "center",
  },
  foreignText: {
    fontFamily: "Nunito_500Medium",
    fontSize: 16,
  },
  checkButtonContainer: {
    paddingHorizontal: "5%",
    paddingBottom: 10,
  },
});
