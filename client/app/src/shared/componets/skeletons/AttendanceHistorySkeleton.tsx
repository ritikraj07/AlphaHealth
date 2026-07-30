import React from "react";
import { View, StyleSheet } from "react-native";

const SkeletonBox = ({
  width,
  height,
  style,
}: {
  width: number | string;
  height: number;
  style?: any;
}) => (
  <View
    style={[
      styles.skeleton,
      {
        width,
        height,
      },
      style,
    ]}
  />
);

const AttendanceHistorySkeleton = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <SkeletonBox width="60%" height={18} />
              <SkeletonBox width="40%" height={12} style={{ marginTop: 8 }} />
            </View>

            <SkeletonBox width={70} height={28} style={{ borderRadius: 20 }} />
          </View>

          {/* Date */}
          <SkeletonBox width="45%" height={14} style={{ marginBottom: 18 }} />

          {/* Time Row */}
          <View style={styles.row}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.box}>
                <SkeletonBox width={55} height={10} />
                <SkeletonBox width={65} height={16} style={{ marginTop: 8 }} />
              </View>
            ))}
          </View>

          {/* Locations */}
          <View style={styles.location}>
            <SkeletonBox width="35%" height={12} />
            <SkeletonBox width="95%" height={12} style={{ marginTop: 10 }} />
            <SkeletonBox width="70%" height={12} style={{ marginTop: 6 }} />
          </View>

          <View style={styles.location}>
            <SkeletonBox width="40%" height={12} />
            <SkeletonBox width="90%" height={12} style={{ marginTop: 10 }} />
            <SkeletonBox width="65%" height={12} style={{ marginTop: 6 }} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default AttendanceHistorySkeleton;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  skeleton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  box: {
    alignItems: "center",
    flex: 1,
  },

  location: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
    marginTop: 12,
  },
});
