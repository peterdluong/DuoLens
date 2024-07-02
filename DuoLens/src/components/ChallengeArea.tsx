import { Dimensions, StyleSheet, View } from "react-native";
import { DuoLensNeutralColors } from "../styles/BrandColors";
import { ReactElement, useState } from "react";
import { runOnUI, useSharedValue } from "react-native-reanimated";
import { AnimatedWord } from "./AnimatedWord";
import { calculateLayout } from "../helper/helpers";

type ChallengeAreaProps = {
  //   scrambledTextArray: string[];
  children: ReactElement<{ word: string }>[];
  updateSentence(input: string): any;
};

export const ChallengeArea = ({
  children,
  updateSentence,
}: ChallengeAreaProps) => {
  const [ready, setReady] = useState(false);
  const offsets = children.map(() => ({
    order: useSharedValue(0),
    width: useSharedValue(0),
    height: useSharedValue(0),
    x: useSharedValue(0),
    y: useSharedValue(0),
    originalX: useSharedValue(0),
    originalY: useSharedValue(0),
    text: useSharedValue(""),
  }));
  const numLines = 4;
  const containerWidth = Dimensions.get("window").width - 30;
  // if (1) {
  if (!ready) {
    return (
      <View style={styles.wordSelectionContainer}>
        {children.map((child, index) => {
          return (
            <View
              key={index}
              onLayout={({
                nativeEvent: {
                  layout: { x, y, width, height },
                },
              }) => {
                // console.log(
                //   `index: ${index} x: ${x} y: ${y} width: ${width} height: ${height}`
                // );
                offsets[index].order.value = -1;
                offsets[index].originalX.value = x;
                offsets[index].originalY.value = y;
                offsets[index].width.value = width;
                offsets[index].height.value = height;
                offsets[index].text.value = child.props.word;

                if (
                  offsets.filter((item) => item.order.value != -1).length == 0
                ) {
                  //   console.log(`containerWidth: ${containerWidth}`);
                  //   calculateLayout(offsets, containerWidth);
                  setReady(true);
                }
              }}
            >
              {child}
            </View>
          );
        })}
      </View>
    );
  } else {
    return (
      <View
        style={[styles.wordSelectionContainer, { paddingHorizontal: "5%" }]}
      >
        {[...Array(numLines)].map((item, index) => (
          <View
            key={index}
            style={[
              styles.ruledLine,
              StyleSheet.absoluteFill,
              {
                top: index * 63,
                left: Dimensions.get("window").width * 0.05,
              },
            ]}
          ></View>
        ))}
        {children.map((child, index) => (
          <AnimatedWord
            key={index}
            offsets={offsets}
            index={index}
            containerWidth={containerWidth}
            updateSentence={updateSentence}
          >
            {child}
          </AnimatedWord>
        ))}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  ruledContainer: {
    // flex: 1,
    flexDirection: "column",
    // justifyContent: "space-between",
    // borderWidth: 1,
    // height: "45%",
    paddingHorizontal: "5%",
  },
  ruledLine: {
    backgroundColor: DuoLensNeutralColors.swan,
    height: 2,
    width: "100%",
    borderRadius: "50%",
  },
  wordSelectionContainer: {
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    width: "100%",
    // alignContent: "center",
    // alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "5%",
    // overflow: "hidden",
    top: 9,
  },
});
