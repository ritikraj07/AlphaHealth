import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function AttendanceSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const Shimmer = ({ style }: { style: any }) => {
    const translateX = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });
    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.25, 0.6, 0.25],
    });

    return (
      <View style={[styles.skeleton, style]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.shimmer, { transform: [{ translateX }], opacity }]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <Shimmer style={styles.greeting} />

      {/* Location Card */}
      <Shimmer style={styles.locationCard} />

      {/* Attendance Card */}
      <View style={styles.attendanceCard}>
        <Shimmer style={styles.attendanceBtn} />
        <Shimmer style={styles.bottomText} />
      </View>

      {/* Summary Card */}
      <Shimmer style={styles.summaryCard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingTop: 15,
  },

  skeleton: {
    backgroundColor: "#E1E3E8",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
  },

  shimmer: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "60%",
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  greeting: {
    height: 22,
    width: "50%",
  },

  locationCard: {
    height: 80,
    width: "100%",
    borderRadius: 12,
  },

  attendanceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },

  attendanceBtn: {
    height: 45,
    width: "85%",
    borderRadius: 10,
    marginBottom: 12,
  },

  bottomText: {
    height: 14,
    width: "60%",
    borderRadius: 6,
  },

  summaryCard: {
    height: 120,
    width: "100%",
    borderRadius: 12,
  },
});
