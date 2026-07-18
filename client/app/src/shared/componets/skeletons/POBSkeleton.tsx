import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");

export default function POBSkeleton() {
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
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const Shimmer = ({ style }: any) => {
    const translateX = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });

    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.2, 0.65, 0.2],
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}

      <View style={styles.header}>
        <View style={{ width: "65%" }}>
          <Shimmer style={styles.title} />
          <Shimmer style={styles.subtitle} />
          <Shimmer style={[styles.subtitle, { width: "70%" }]} />
        </View>

        <Shimmer style={styles.button} />
      </View>

      {/* Purchase Overview */}

      <Shimmer style={styles.sectionTitle} />

      <View style={styles.row}>
        <Shimmer style={styles.categoryCard} />
        <Shimmer style={styles.categoryCard} />
      </View>

      {/* Dashboard Cards */}

      <View style={styles.row}>
        <Shimmer style={styles.statCard} />
        <Shimmer style={styles.statCard} />
      </View>

      <View style={styles.row}>
        <Shimmer style={styles.statCard} />
        <Shimmer style={styles.statCard} />
      </View>

      {/* History */}

      <View style={styles.historyCard}>
        <Shimmer style={styles.historyTitle} />
        <Shimmer style={styles.historySubtitle} />

        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.historyRow}>
            <Shimmer style={styles.historyLine1} />
            <Shimmer style={styles.historyLine2} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },

  skeleton: {
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
    borderRadius: 12,
  },

  shimmer: {
    position: "absolute",
    width: "60%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.6)",
  },

  header: {
    marginTop: 5,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    height: 26,
    width: "90%",
    marginBottom: 10,
  },

  subtitle: {
    height: 14,
    width: "100%",
    marginBottom: 8,
  },

  button: {
    width: 120,
    height: 48,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  sectionTitle: {
    height: 22,
    width: "45%",
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  categoryCard: {
    width: "48%",
    height: 140,
    borderRadius: 12,
  },

  statCard: {
    width: "48%",
    height: 110,
    borderRadius: 12,
  },

  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 80,
  },

  historyTitle: {
    width: "55%",
    height: 20,
    marginBottom: 12,
  },

  historySubtitle: {
    width: "70%",
    height: 14,
    marginBottom: 20,
  },

  historyRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },

  historyLine1: {
    width: "55%",
    height: 16,
    marginBottom: 10,
  },

  historyLine2: {
    width: "30%",
    height: 12,
  },
});
