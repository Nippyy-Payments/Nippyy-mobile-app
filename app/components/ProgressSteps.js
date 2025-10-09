import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const ProgressSteps = ({ currentStep, totalSteps }) => {
  const { theme } = useTheme();
  
  const steps = Array(totalSteps).fill(0);
  const progressWidth = `${(currentStep / (totalSteps - 1)) * 100}%`;

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {steps.map((_, index) => {
          const isCompleted = index <= currentStep;
          const isActive = index === currentStep;

          return (
            <React.Fragment key={index}>
              <View
                style={[
                  styles.step,
                  {
                    backgroundColor: isCompleted ? theme.colors.primary : '#E0E0E0',
                    transform: [{ scale: isActive ? 1.2 : 1 }],
                  },
                ]}
              />
              {index < totalSteps - 1 && (
                <View style={styles.lineContainer}>
                  <View
                    style={[
                      styles.line,
                      { backgroundColor: '#E0E0E0' },
                    ]}
                  />
                  <View
                    style={[
                      styles.progressLine,
                      {
                        backgroundColor: theme.colors.primary,
                        width: index < currentStep ? '100%' : '0%',
                      },
                    ]}
                  />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin:15
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  step: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  lineContainer: {
    flex: 1,
    height: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
  },
  progressLine: {
    position: 'absolute',
    left: 0,
    height: '100%',
    transition: 'width 0.3s ease-in-out',
  },
}); 