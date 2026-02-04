import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

const SkeletonBox = ({
  width = "100%",
  height = 20,
  radius = 6,
}: {
  width?: any;
  height?: number;
  radius?: number;
}) => (
  <View style={[styles.skeleton, { width, height, borderRadius: radius }]} />
);

export default function EmployeesSkeleton() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search */}
      <SkeletonBox height={42} radius={10} />

      {/* Filter buttons */}
      <View style={styles.filterRow}>
        <SkeletonBox width={60} height={30} radius={16} />
        <SkeletonBox width={90} height={30} radius={16} />
        <SkeletonBox width={100} height={30} radius={16} />
      </View>

      {/* Employee Cards */}
      {Array.from({ length: 6 }).map((_, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              {/* Name */}
              <SkeletonBox width={"70%"} height={18} />
              {/* Email */}
              <SkeletonBox width={"55%"} height={14} radius={4} />
            </View>

            <View style={styles.rightInfo}>
              <SkeletonBox width={70} height={18} radius={6} />
              <SkeletonBox width={50} height={14} radius={4} />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#f8f9fb",
  },
  skeleton: {
    backgroundColor: "#e3e3e3",
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    marginVertical: 8,
    gap: 8,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    borderColor: "#eee",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
  },
  rightInfo: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});
