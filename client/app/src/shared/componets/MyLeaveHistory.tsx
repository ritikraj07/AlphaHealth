import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetMyLeavesQuery } from "../store/api/leaveApi";
import { useAppSelector } from "../store/hooks";

const PRIMARY = "#e91e62";

const statusStyle = {
  approved: { bg: "#eafaf1", color: "#2ecc71" },
  rejected: { bg: "#fdecea", color: "#e74c3c" },
  pending: { bg: "#fff4e5", color: "#f39c12" },
};

const STATUS = {
  approved: { text: "#2ecc71", bg: "#eafaf1", icon: "checkmark-circle" },
  rejected: { text: "#e74c3c", bg: "#fdecea", icon: "close-circle" },
  pending: { text: "#f39c12", bg: "#fff4e5", icon: "time" },
};


const formatDate = (date?: string) => {
  if (!date) return "—";

  const d = new Date(date);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};


const MyLeaveHistory = () => {
  const { userId } = useAppSelector((state) => state.auth);

  const { data, isLoading } = useGetMyLeavesQuery({
    employeeId: userId,
  });

  const leaves = data?.data ?? [];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
    }

    
    

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Leave History</Text>
      <Text style={styles.subHeading}>Your recent leave applications</Text>

      {leaves.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={64} color="#bbb" />
          <Text style={styles.emptyTitle}>No Leaves Found</Text>
          <Text style={styles.emptyText}>
            You haven’t applied for any leave yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={leaves}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
             const status = STATUS[item.status];

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.type}>{item.type.toUpperCase()}</Text>

                  <View
                    style={[styles.statusPill, { backgroundColor: status.bg }]}
                  >
                    <Ionicons
                      name={status.icon as any}
                      size={14}
                      color={status.text}
                    />
                    <Text style={[styles.statusText, { color: status.text }]}>
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.date}>
                  {formatDate(item.startDate)} → {formatDate(item.endDate)}
                </Text>

                <Text style={styles.reason} numberOfLines={2}>
                  {item.reason || "No reason provided"}
                </Text>

                <View style={styles.footer}>
                  <Ionicons name="time-outline" size={14} color="#888" />
                  <Text style={styles.applied}>
                    Applied on {formatDate(item.createdAt ?? item.startDate)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default MyLeaveHistory;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },

  subHeading: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 0.3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  type: {
    fontSize: 14,
    fontWeight: "700",
    color: PRIMARY,
  },

  status: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  date: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  reason: {
    marginTop: 6,
    fontSize: 14,
    color: "#555",
  },

  footer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  applied: {
    fontSize: 12,
    color: "#888",
  },

  center: {
    paddingVertical: 40,
    alignItems: "center",
  },

  empty: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
  },

  emptyText: {
    marginTop: 4,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
});
