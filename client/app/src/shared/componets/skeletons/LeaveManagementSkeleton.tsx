import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions, Easing } from "react-native";

const { width } = Dimensions.get("window");

export default function LeaveManagementSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.linear,
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
      <View style={styles.headerRow}>
        <View style={{ width: "65%" }}>
          <Shimmer style={styles.title} />
          <Shimmer style={styles.subtitle} />
        </View>

        <Shimmer style={styles.button} />
      </View>

      {/* Leave Cards */}
      <View style={styles.grid}>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={styles.card}>
            <Shimmer style={styles.cardTitle} />
            <Shimmer style={styles.cardCount} />
            <Shimmer style={styles.cardDesc} />
          </View>
        ))}
      </View>

      {/* Leave History */}
      <View style={styles.historyBox}>
        <Shimmer style={styles.historyTitle} />
        <Shimmer style={styles.historySubtitle} />

        <View style={styles.emptyBox}>
          <Shimmer style={styles.emptyIcon} />
          <Shimmer style={styles.emptyLine} />
          <Shimmer style={styles.emptyLineSmall} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  skeleton: {
    backgroundColor: "#E1E3E8",
    borderRadius: 10,
    overflow: "hidden",
  },

  shimmer: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "60%",
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  title: {
    height: 26,
    width: "80%",
    marginBottom: 10,
  },

  subtitle: {
    height: 16,
    width: "100%",
  },

  button: {
    height: 46,
    width: 120,
    borderRadius: 10,
  },

  /* Cards */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  cardTitle: {
    height: 14,
    width: "70%",
    marginBottom: 12,
  },

  cardCount: {
    height: 26,
    width: "40%",
    marginBottom: 8,
  },

  cardDesc: {
    height: 12,
    width: "80%",
  },

  /* History */
  historyBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },

  historyTitle: {
    height: 18,
    width: "50%",
    marginBottom: 10,
  },

  historySubtitle: {
    height: 14,
    width: "80%",
    marginBottom: 20,
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 30,
  },

  emptyIcon: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginBottom: 16,
  },

  emptyLine: {
    height: 14,
    width: "70%",
    marginBottom: 10,
  },

  emptyLineSmall: {
    height: 14,
    width: "55%",
  },
});
