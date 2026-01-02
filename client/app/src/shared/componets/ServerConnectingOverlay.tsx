import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Image,
} from "react-native";

export default function ServerConnectingOverlay({ visible,}: {  visible: boolean;}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
          alignItems: "center",
        }}
      >
        <Image
          source={require("../images/icon.png")}
          style={styles.icon}
        />

        <ActivityIndicator size="large" color="#e91f62" />

        <Text style={styles.title}>Connecting to PharmaPrime</Text>
        <Text style={styles.subtitle}>Server is waking up, please wait...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(252,244,249,0.96)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  icon: {
    width: 190,
    height: 190,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "bold",
    color: "#e91f62",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    maxWidth: 240,
  },
});
