import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    image: require("../../../assets/images/pay.png"),
    title: "Instant Global Payment",
    description:
      "Skip the long queues, network issues and lost of funds. Experience lightning-fast international transaction with Nippyy",
  },
  {
    id: 2,
    image: require("../../../assets/images/cheap.png"),
    title: "The cheapest rates",
    description:
      "We charges little to low costs to ensure you have a sweet and good financial experience",
  },
];

export default function Welcome() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  //access the theme from context
  const { theme } = useTheme();

  const nav = useNavigation();

  useEffect(() => {
    // Animate slide content on mount
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate buttons with delay
    Animated.timing(buttonAnimation, {
      toValue: 1,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const slideSize = event.nativeEvent.contentOffset.x / width;
        setCurrentIndex(Math.round(slideSize));
      },
    }
  );

  const renderSlide = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const imageScale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    const textTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, -50],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.slide} key={item.id}>
        <Animated.View
          style={[
            styles.imageContainer,
            {
              transform: [{ scale: imageScale }],
              opacity: opacity,
            },
          ]}
        >
          <Image source={item.image} style={styles.image} />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: textTranslateY }],
              opacity: opacity,
            },
          ]}
        >
          <Text style={[styles.title, { color: "#fff", fontFamily: "bold" }]}>
            {item.title}
          </Text>
          <Text style={[styles.description, { color: "#eee" }]}>
            {item.description}
          </Text>
        </Animated.View>
      </View>
    );
  };

  const renderIndicators = () => {
    return (
      <View style={styles.indicatorContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 30, 10],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                {
                  width: dotWidth,
                  opacity: opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: "#0B0D47" }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: slideAnimation,
            transform: [
              {
                translateY: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {onboardingData.map((item, index) => renderSlide({ item, index }))}
        </ScrollView>

        {renderIndicators()}
      </Animated.View>

      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonAnimation,
            transform: [
              {
                translateY: buttonAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            nav.navigate("SignUp");
          }}
          style={[
            styles.signUpButton,
            { backgroundColor: theme.colors.skyblue },
          ]}
          activeOpacity={0.8}
        >
          <Text style={[styles.signUpText, { color: theme.colors.text }]}>
            Sign Up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            alignItems: "center",
            alignSelf: "center",
            marginBottom: 25,
          }}
          onPress={() => nav.navigate("SignIn")}
        >
          <Text style={styles.signInText}>
            Already have an account?{" "}
            <Text style={{ color: theme.colors.skyblue }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: height * 0.08,
    paddingBottom: 20,
  },
  imageContainer: {
    marginBottom: height * 0.06,
  },
  image: {
    width: 350,
    height: 350,
    borderRadius: 20,
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: height * 0.02,
    lineHeight: Math.min(width * 0.08, 34),
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: Math.min(width * 0.055, 24),
    paddingHorizontal: 5,
    flexShrink: 1,
    fontFamily: "medium",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.03,
    paddingHorizontal: 20,
  },
  indicator: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: height * 0.06,
    gap: 16,
  },
  signUpButton: {
    paddingVertical: height * 0.02,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  signUpText: {
    fontSize: Math.min(width * 0.045, 18),
    fontFamily: "bold",
  },
  signInButton: {
    backgroundColor: "transparent",
    paddingVertical: height * 0.02,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 1.9,
    borderColor: "#ffff",
    minHeight: 50,
    justifyContent: "center",
  },
  signInText: {
    color: "#fff",
    fontSize: Math.min(width * 0.045, 16),
    fontFamily: "medium",
  },
});
