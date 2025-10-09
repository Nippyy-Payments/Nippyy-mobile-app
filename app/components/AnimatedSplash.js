import React, { useEffect } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

export const AnimatedSplash = ({ onAnimationComplete, children }) => {
  const animation = new Animated.Value(1);

  useEffect(() => {
    // Prevent the splash screen from auto-hiding
    SplashScreen.preventAutoHideAsync();

    // Start animation after a delay
    const startAnimation = async () => {
      await SplashScreen.hideAsync(); // Hide the native splash screen
      
      // Animate the custom splash screen
      Animated.sequence([
        // Wait for 1 second
        Animated.delay(1000),
        // Fade out and scale up over 800ms
        Animated.parallel([
          Animated.timing(animation, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Animation complete callback
        onAnimationComplete();
      });
    };

    startAnimation();
  }, []);

  return (
    <View style={styles.container}>
      {children}
      <Animated.View
        style={[
          styles.splashScreen,
          {
            opacity: animation,
            transform: [
              {
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.5, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.Image
          source={require('../../assets/splash-icon.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0B0D47',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: {
    width: width * 0.8,
    height: height * 0.8,
  },
}); 