import { View, StyleSheet } from "react-native";

const SkeletonBox = ({ style }: { style?: any }) => (
  <View style={[styles.skeleton, style]} />
);

export default function DocCheSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <SkeletonBox style={styles.title} />
          <SkeletonBox style={styles.subtitle} />
        </View>

        <SkeletonBox style={styles.button} />
      </View>

      {/* Cards Grid */}
      <View style={styles.grid}>
        {[1, 2, 3, 4].map((_, i) => (
          <View key={i} style={styles.card}>
            <SkeletonBox style={styles.cardTitle} />
            <SkeletonBox style={styles.cardValue} />
            <SkeletonBox style={styles.cardDesc} />
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "#f8f9fa",
  },

  skeleton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginBottom: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  title: {
    width: "80%",
    height: 28,
  },

  subtitle: {
    width: "60%",
    height: 16,
  },

  button: {
    width: 160,
    height: 46,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    width: "70%",
    height: 14,
  },

  cardValue: {
    width: "40%",
    height: 24,
  },

  cardDesc: {
    width: "60%",
    height: 12,
  },
});
