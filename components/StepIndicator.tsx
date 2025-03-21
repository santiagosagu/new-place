import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "./ThemeContext";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <View
              style={[
                styles.stepCircle,
                {
                  backgroundColor:
                    index <= currentStep ? colors.primary : colors.inactive,
                },
              ]}
            >
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>

            {index < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor:
                      index < currentStep ? colors.primary : colors.inactive,
                  },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      <Text style={[styles.stepText, { color: colors.text }]}>
        {steps[currentStep]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
    zIndex: 10,
    elevation: 10,
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  line: {
    height: 2,
    width: 40,
  },
  stepText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },
});

export default StepIndicator;
