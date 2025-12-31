import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { EvilIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import MedicineBottleLoader from "../shared/componets/skeletons/MedicineBottleLoader";
import { useGetMyDetailQuery } from "../shared/store/api/employeeApi";
import { useAppSelector } from "../shared/store/hooks";
import LeaveModal from "./Modals/LeaveModal";
import LeaveManagementSkeleton from "../shared/componets/skeletons/LeaveManagementSkeleton";

/**
 * LeaveManagement screen
 *
 * This screen allows employees to manage their leave applications and view their leave balance.
 * It displays the number of remaining leaves for each type (sick, casual, earned, public holidays) and allows employees to apply for leaves.
 * The screen also displays the employee's leave history, including the status of their recent applications.
 *
 */
export default function LeaveManagement() {
  const [isLeaveModalVisible, setIsLeaveModalVisible] =
    useState<boolean>(false);
  const auth = useAppSelector((state) => state.auth);
  const { data, isLoading, isError, error, isFetching, refetch } = useGetMyDetailQuery({
    id: auth?.userId,
  });

  const sickLeave = data?.data?.leavesTaken?.sick;
  const casualLeave = data?.data?.leavesTaken?.casual;
  const earnedLeave = data?.data?.leavesTaken?.earned;
  const publicHolidays = data?.data?.leavesTaken?.public;

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <LeaveManagementSkeleton />
      </View>
    );
  }

  if (isError) {
    return <Text>Error loading leave details</Text>;
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <LeaveModal
        visible={isLeaveModalVisible}
        onClose={() => setIsLeaveModalVisible(false)}
      />
      <ScrollView
        style={[styles.container]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Leave Management</Text>
            <Text style={styles.subtitle}>
              Manage your leave applications and view balance
            </Text>
          </View>

          {/* Apply Leave Button */}
          <TouchableOpacity
            onPress={() => setIsLeaveModalVisible(true)}
            style={styles.applyButton}
          >
            <Text style={styles.applyButtonText}>Apply Leave</Text>
          </TouchableOpacity>
        </View>
        {/* Leave Balance Cards */}
        <View style={styles.gridContainer}>
          {/* Sick Leave */}
          <View style={styles.leaveCard}>
            <View style={styles.header}>
              <Text style={styles.leaveName}>Sick Leave</Text>
              <EvilIcons name="heart" size={24} color="red" />
            </View>
            <Text style={styles.leaveCount}>{sickLeave}</Text>
            <Text style={styles.leaveDescription}>out of 5 remaining</Text>
          </View>

          {/* Casual Leave */}
          <View style={styles.leaveCard}>
            <View style={styles.header}>
              <Text style={styles.leaveName}>Casual Leave</Text>
              <Feather name="coffee" size={24} color="blue" />
            </View>
            <Text style={styles.leaveCount}>{casualLeave}</Text>
            <Text style={styles.leaveDescription}>out of 5 remaining</Text>
          </View>

          {/* Earned Leave */}
          <View style={styles.leaveCard}>
            <View style={styles.header}>
              <Text style={styles.leaveName}>Earned Leave</Text>
              <Feather name="gift" size={24} color="green" />
            </View>
            <Text style={styles.leaveCount}> {earnedLeave} </Text>
            <Text style={styles.leaveDescription}>out of 10 remaining</Text>
          </View>

          {/* Public Holidays */}
          <View style={styles.leaveCard}>
            <View style={styles.header}>
              <Text style={styles.leaveName}>Public Holidays</Text>
              <Feather name="calendar" size={24} color="orange" />
            </View>
            <Text style={styles.leaveCount}> {publicHolidays} </Text>
            <Text style={styles.leaveDescription}>fixed allocation</Text>
          </View>
        </View>
        {/* ---------- */}
        {/* Leave History Section */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Leave History</Text>
          <Text style={styles.historySubtitle}>
            Your recent leave applications and their status
          </Text>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={50} color={"grey"} />
            <Text style={styles.emptyStateText}>No leave applications yet</Text>
            <Text style={styles.emptyStateText}>
              Click "Apply Leave" to submit your first application
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 5,
    paddingBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerContent: {
    width: "60%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
    lineHeight: 22,
  },
  applyButton: {
    backgroundColor: "#e91e62",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "flex-start",
    shadowColor: "#e91e62",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  balanceSection: {
    marginBottom: 30,
    flexDirection: "row",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  leaveCard: {
    borderColor: "#e0e0e0",
    borderWidth: 0.5,
    borderRadius: 12,
    width: "48%",
    marginBottom: 16,
    padding: 16,
    backgroundColor: "white",
  },

  leaveName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  leaveCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 4,
  },
  leaveDescription: {
    fontSize: 12,
    color: "grey",
  },

  historySection: {
    marginBottom: 40,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    borderWidth: 0.1,
    borderColor: "grey",
  },
  historySubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 10,
  },
  emptyState: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
