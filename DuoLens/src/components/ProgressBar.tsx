import { DimensionValue, StyleSheet, View } from "react-native";
import { DuoLensNeutralColors } from "../styles/BrandColors";

const clampValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

type ProgressBarProps = {
  percentage: number;
};

export const ProgressBar = (props: ProgressBarProps) => {
  const percentage = `${clampValue(
    props.percentage,
    0,
    100
  )}%` as DimensionValue;
  return (
    <View style={styles.progressBar}>
      <View style={[styles.progressBarProgress, { width: percentage }]}>
        <View style={styles.progressBarProgressShine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: 18,
    width: "100%",
    backgroundColor: DuoLensNeutralColors.swan,
    borderRadius: "20%",
  },
  progressBarProgress: {
    height: "100%",
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
});
