import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function StartupScreen({ step }: { step: string }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <LinearGradient colors={["#fdf2f8", "#ffffff"]} style={styles.container}>
      <Animated.View
        style={[styles.loaderCircle, { transform: [{ scale: scaleAnim }] }]}
      />

      <Text style={styles.title}>Getting Things Ready</Text>
      <Text style={styles.step}>{step}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loaderCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e91e62",
    marginBottom: 30,
    shadowColor: "#e91e62",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    letterSpacing: 0.5,
  },
  step: {
    marginTop: 10,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
});
