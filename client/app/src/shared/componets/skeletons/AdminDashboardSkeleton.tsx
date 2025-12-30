import { View, StyleSheet } from "react-native";

const SkeletonBox = ({ height = 20 }: { height?: number }) => (
  <View style={[styles.skeleton, { height }]} />
);

export default function AdminDashboardSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <SkeletonBox height={30} />
      <SkeletonBox height={16} />

      {/* Stats */}
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.card}>
          <SkeletonBox height={14} />
          <SkeletonBox height={28} />
          <SkeletonBox height={12} />
        </View>
      ))}

      {/* HQ Section */}
      <View style={styles.section}>
        {[1, 2, 3].map((i) => (
          <SkeletonBox key={i} height={18} />
        ))}
      </View>
    </View>
  );
}const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  skeleton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginVertical: 6,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 0.5,
    marginVertical: 8,
  },
  section: {
    marginTop: 16,
  },
});

