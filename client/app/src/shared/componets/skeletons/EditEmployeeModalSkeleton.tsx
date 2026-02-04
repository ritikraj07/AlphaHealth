import { View, StyleSheet } from "react-native";

const SkeletonBox = ({ height = 20 }: { height?: number }) => (
  <View style={[styles.skeleton, { height }]} />
);

export default function EditEmployeeModalSkeleton() {
  return (
    <View style={styles.container}>
      {/* Title */}
      <SkeletonBox height={28} />
      {/* Form Fields */}
      <SkeletonBox height={45} /> {/* Name */}
      <SkeletonBox height={45} /> {/* Phone */}
      <SkeletonBox height={45} /> {/* HQ */}
      <SkeletonBox height={45} /> {/* Manager */}
      <SkeletonBox height={45} /> {/* Email (example) */}
      {/* Buttons */}
      <View style={styles.buttonRow}>
        <SkeletonBox height={40} />
        <SkeletonBox height={40} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  skeleton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginVertical: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
});
