import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  attendance: any[];
}

const SummaryCard = ({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) => (
  <View style={[styles.card, { borderLeftColor: color }]}>
    <Text style={styles.count}>{count}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const AttendanceSummary = ({ attendance = [] }: Props) => {
  const summary = useMemo(() => {
    const result = {
      present: 0,
      absent: 0,
      leave: 0,
      holiday: 0,
      total: attendance.length,
    };

    

    attendance.forEach((item) => {
      const status = item.status?.toLowerCase();

      if (status === "present") result.present++;
      else if (status === "absent") result.absent++;
      else if (status === "leave") result.leave++;
      else if (status === "holiday") result.holiday++;
    });

    return result;
  }, [attendance]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance Overview</Text>
        <Text style={styles.total}>{summary.total} records</Text>
      </View>

      <View style={styles.grid}>
        <SummaryCard label="Present" count={summary.present} color="#22C55E" />

        <SummaryCard label="Absent" count={summary.absent} color="#EF4444" />

        <SummaryCard label="Leave" count={summary.leave} color="#F59E0B" />

        <SummaryCard label="Holiday" count={summary.holiday} color="#3B82F6" />
      </View>
    </View>
  );
};

export default React.memo(AttendanceSummary);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    margin: 15,
    marginBottom: 8,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  total: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },

  card: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderLeftWidth: 4,
  },

  count: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
});
