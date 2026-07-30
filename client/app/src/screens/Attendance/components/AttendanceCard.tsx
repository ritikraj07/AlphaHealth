import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AddressText from "./AddressText";

interface Props {
  attendance: any;
}

const statusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "present":
      return "#22C55E";

    case "absent":
      return "#EF4444";

    case "leave":
      return "#F59E0B";

    case "holiday":
      return "#3B82F6";

    default:
      return "#6B7280";
  }
};

const formatTime = (time?: string) => {
  if (!time) return "--";

  const date = new Date(time);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AttendanceCard = ({ attendance }: Props) => {
  const color = useMemo(
    () => statusColor(attendance.status),
    [attendance.status],
  );

  // console.log(attendance);

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      {/* Header */}

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {attendance.employee?.name ?? "Unknown Employee"}
          </Text>

          <Text style={styles.email}>{attendance.employee?.email}</Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: color,
            },
          ]}
        >
          <Text style={styles.badgeText}>{attendance.status}</Text>
        </View>
      </View>

      {/* Date */}

      <Text style={styles.date}>📅 {formatDate(attendance.date)}</Text>

      {/* Time */}

      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>Check In</Text>

          <Text style={styles.value}>{formatTime(attendance.startTime)}</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Check Out</Text>

          <Text style={styles.value}>{formatTime(attendance.endTime)}</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Hours</Text>

          <Text style={styles.value}>{attendance.workingHours ?? "--"}</Text>
        </View>
      </View>

      {/* Location */}

      {attendance.startLocation && (
        <View style={styles.location}>
          <Text style={styles.locationTitle}>📍 Check In Location</Text>

          <AddressText coordinates={attendance.startLocation?.coordinates} />
        </View>
      )}

      {attendance.endLocation && (
        <View style={styles.location}>
          <Text style={styles.locationTitle}>📍 Check Out Location</Text>

          <AddressText coordinates={attendance.endLocation?.coordinates} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(AttendanceCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },

  email: {
    color: "#777",
    marginTop: 3,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  date: {
    color: "#444",
    marginBottom: 15,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  box: {
    alignItems: "center",
    flex: 1,
  },

  label: {
    color: "#999",
    fontSize: 12,
  },

  value: {
    marginTop: 4,
    fontWeight: "700",
    fontSize: 16,
    color: "#222",
  },

  location: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },

  locationTitle: {
    fontWeight: "600",
    color: "#333",
  },

  locationText: {
    marginTop: 5,
    color: "#666",
    lineHeight: 20,
  },
});
