import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions, Easing } from "react-native";

const { width } = Dimensions.get("window");

export default function EmployeeDashboardSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0, // 👈 instant reset
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const Shimmer = ({ style }: { style: any }) => {
    const translateX = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });

    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.2, 0.6, 0.2],
    });

    return (
      <View style={[styles.skeleton, style]}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX }],
              opacity,
            },
          ]}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <Shimmer style={styles.header} />

      {/* Stats Cards */}
      <View style={styles.row}>
        <Shimmer style={styles.card} />
        <Shimmer style={styles.card} />
      </View>

      <View style={styles.row}>
        <Shimmer style={styles.card} />
        <Shimmer style={styles.card} />
      </View>

      {/* Attendance Box */}
      <Shimmer style={styles.attendanceBox} />

      {/* List Header */}
      <Shimmer style={styles.sectionTitle} />

      {/* List Rows */}
      {[...Array(6)].map((_, i) => (
        <Shimmer key={i} style={styles.listRow} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F5F6FA",
    flex: 1,
  },

  skeleton: {
    backgroundColor: "#E1E3E8",
    overflow: "hidden",
    borderRadius: 10,
  },

  shimmer: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "60%", // 👈 must be large
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  header: {
    height: 26,
    width: "55%",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  card: {
    height: 90,
    width: "48%",
  },

  attendanceBox: {
    height: 120,
    width: "100%",
    marginVertical: 16,
  },

  sectionTitle: {
    height: 20,
    width: "40%",
    marginBottom: 12,
  },

  listRow: {
    height: 56,
    width: "100%",
    marginBottom: 10,
  },
});
