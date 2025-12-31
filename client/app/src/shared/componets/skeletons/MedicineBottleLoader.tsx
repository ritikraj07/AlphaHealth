// components/MedicineBottleLoader.js
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";

const MedicineBottleLoader = ({message}: {message: string}) => {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Liquid filling animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(fillAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(fillAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Shake animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const heightInterpolate = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["10%", "80%"],
  });

  const rotateInterpolate = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-5deg", "0deg", "5deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.bottle, { transform: [{ rotate: rotateInterpolate }] }]}
      >
        <View style={styles.bottleNeck} />
        <View style={styles.bottleBody}>
          <Animated.View
            style={[
              styles.liquid,
              {
                height: heightInterpolate,
                backgroundColor: "#e91e62",
              },
            ]}
          />
          <View style={styles.bottleLabel}>
            <Text style={styles.labelText}>PharmaPrime</Text>
          </View>
        </View>
        <View style={styles.bottleCap} />
      </Animated.View>
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  bottle: {
    alignItems: "center",
  },
  bottleNeck: {
    width: 30,
    height: 20,
    backgroundColor: "#e91e62",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  bottleBody: {
    width: 100,
    height: 120,
    backgroundColor: "#ffffffff",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#e91e62",
    overflow: "hidden",
    position: "relative",
  },
  liquid: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  bottleLabel: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingVertical: 5,
    alignItems: "center",
  },
  labelText: {
    color: "#e91e62",
    fontSize: 12,
    fontWeight: "bold",
  },
  bottleCap: {
    width: 40,
    height: 15,
    backgroundColor: "#e91e62",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 14,
    color: "#15cf1fff",
    fontWeight: "500",
  },
});

export default MedicineBottleLoader;
