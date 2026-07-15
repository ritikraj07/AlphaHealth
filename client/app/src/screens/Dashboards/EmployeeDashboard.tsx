import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { RefreshControl } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import GlobalError from "../../shared/componets/common/GlobalError";
import { useGetMyDetailQuery } from "../../shared/store/api/employeeApi";
import { useAppSelector } from "../../shared/store/hooks";
import { handleApiError } from "../../shared/utils/apiErrorHandler";
import { performLogout } from "../../shared/utils/logout";
import EmployeeDashboardSkeleton from "../../shared/componets/skeletons/EmployeeDashboardSkeleton";
import { useGetEmployeeDashboardQuery } from "../../shared/store/api/analyticsApi";
import { NavProp } from "../../navigators";

export default function EmployeeDashboard() {
  const navigation = useNavigation<NavProp>();
  const dispatch = useDispatch();
  const year = new Date().getFullYear();
  const auth = useAppSelector((state) => state.auth);
  // console.log(auth)
  const { data, isLoading, isError, error, isFetching, refetch } =
    useGetMyDetailQuery({
      id: auth?.userId,
    });
  const name = data?.data?.name;
  const headQuater = data?.data?.hq?.name;
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isFetching: dashboardFetching,
    refetch: dashboardRefetch
  } = useGetEmployeeDashboardQuery();
  

  const performace = dashboardData?.performance;

  const callPerformance = dashboardData?.callPerformance;
  const doctorCoverageAnalysis = dashboardData?.doctorCoverageAnalysis;
  const sales = dashboardData?.sales;
  const activityBreakdown = dashboardData?.activityBreakdown;
  const topDoctors = dashboardData?.topDoctors;
  const todayStatus = dashboardData?.todayStatus;

  console.log("🚀 ~ file: EmployeeDashboard.tsx ~ line 51 ~ EmployeeDashboard ~ todayStatus", todayStatus)

  const totalVisits = activityBreakdown?.totalVisits ?? 0;

  const doctorPercent =
    totalVisits > 0 ? (activityBreakdown?.doctorVisits / totalVisits) * 100 : 0;

  const chemistPercent =
    totalVisits > 0
      ? (activityBreakdown?.chemistVisits / totalVisits) * 100
      : 0;

  if (isLoading || dashboardLoading) {
    return <EmployeeDashboardSkeleton />;
  }

  if (isError) {
    const { message, showRetry, showSupport, logout } = handleApiError(error);

    if (logout) {
      async function logout() {
        await performLogout(dispatch, navigation);
      }
    }

    return (
      <GlobalError
        title="Failed to load Dashboard"
        message={message}
        showRetry={showRetry}
        showSupport={showSupport}
        onRetry={refetch}
        onSupport={() => {
          // Example

          console.log("Open support screen / email etc");
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* <Navbar /> */}
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        {/* Section 1: Greeting */}
        <View style={styles.section}>
          <Text style={styles.title}>Personal Performance Dashboard</Text>
          <Text style={styles.subLabel}>
            Track your individual activity and effectiveness for October {year}
          </Text>
          <View style={styles.userBadge}>
            <Text style={styles.userName}>{name}</Text>
            <Entypo name="dot-single" size={24} color="black" />
            <Text style={styles.userHQ}>{headQuater}</Text>
          </View>
        </View>

        {/* Report section */}

        <View style={styles.gridContainer}>
          {/* Days Worked */}
          <View style={styles.leaveCard}>
            <View style={styles.header}>
              <Text style={styles.leaveName}>Days Worked</Text>
              <Feather name="calendar" size={24} color="grey" />
            </View>
            <Text style={styles.leaveCount}>{performace?.daysWorked ?? 0}</Text>
            <Text style={styles.leaveDescription}>
              {performace?.workingPercent ?? 0}% of working days
            </Text>
          </View>

          {/* Calls Completed */}
          <View style={styles.leaveCard}>
            <View style={styles.header}>
              <Text style={styles.leaveName}>Calls Completed</Text>
              <Feather name="users" size={24} color="lightblue" />
            </View>
            <Text style={styles.leaveCount}>
              {performace?.callsCompleted ?? 0}
            </Text>
            <Text style={styles.leaveDescription}>
              Avg: {performace?.avgCallsPerDay ?? 0} per day
            </Text>
          </View>

          {/* POB */}
          <View style={styles.leaveCard}>
            <View style={styles.header}>
              <Text style={styles.leaveName}>POB Value</Text>
              <Feather name="dollar-sign" size={24} color="green" />
            </View>
            <Text style={styles.leaveCount}>₹ {performace?.pobValue ?? 0}</Text>
            <Text style={styles.leaveDescription}>
              {sales?.orders ?? 0} orders
            </Text>
          </View>

          {/* Coverage */}
          <View style={styles.leaveCard}>
            <View style={styles.header}>
              <Text style={styles.leaveName}>Coverage</Text>
              <Ionicons name="filter-circle-outline" size={24} color="blue" />
            </View>
            <Text style={styles.leaveCount}>{performace?.coverage ?? 0}%</Text>
            <Text style={styles.leaveDescription}>Doctor coverage rate</Text>
          </View>
        </View>

        {/* Call Performance */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome name="dot-circle-o" size={20} color="black" />
            <Text style={styles.cardTitle}>Call Performance</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Your coverage and call execution metrics
          </Text>

          {/* Coverage Rate */}
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Coverage Rate</Text>
            <Text style={styles.metricValue}>
              {callPerformance?.coverageRate ?? 0}%
            </Text>
          </View>

          <Text style={styles.metricNumber}>
            {callPerformance?.completedCalls ?? 0}
          </Text>
          <Text style={styles.metricDescription}>
            of {callPerformance?.plannedCalls ?? 0} planned doctors
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${callPerformance?.coverageRate ?? 0}% ` },
              ]}
            />
          </View>

          {/* Call Execution */}
          <View style={[styles.metricRow, styles.metricSpacing]}>
            <Text style={styles.metricLabel}>Call Execution</Text>
            <Text style={styles.metricValue}>
              {callPerformance?.executionRate ?? 0}%
            </Text>
          </View>
          <Text style={styles.metricNumber}>
            {callPerformance?.completedCalls ?? 0}
          </Text>
          <Text style={styles.metricDescription}>
            of {callPerformance?.plannedCalls ?? 0} planned calls
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${callPerformance?.executionRate ?? 0}%` },
              ]}
            />
          </View>

          {/* High-Potential Frequency */}
          <View style={[styles.metricRow, styles.metricSpacing]}>
            <Text style={styles.metricLabel}>High-Potential Frequency</Text>
            <Entypo name="star-outlined" size={20} color="black" />
          </View>
          <Text style={styles.metricNumber}>
            {callPerformance?.highPotentialFrequency ?? 0}
          </Text>
          <Text style={styles.metricDescription}>
            avg visits per high-potential doctor
          </Text>

          <Text style={[styles.metricDescription, styles.successText]}>
            {callPerformance?.completedCalls ?? 0} total visits
          </Text>
        </View>

        {/* Doctor Coverage Analysis card */}

        <View style={[styles.leaveCard, { width: "100%" }]}>
          <View style={[styles.cardHeader]}>
            <Ionicons name="filter-circle-outline" size={24} color="black" />
            <Text style={[styles.title, { fontSize: 20 }]}>
              Doctor Coverage Analysis
            </Text>
          </View>
          <Text style={styles.subtitle}>
            Coverage vs target frequency for each doctor
          </Text>

          {doctorCoverageAnalysis?.map((doc, index) => {
            const percent = Math.min(
              (doc.actualVisits / doc.targetFrequency) * 100,
              100,
            );

            return (
              <View key={index} style={{ marginBottom: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontWeight: "700" }}>{doc.doctorName}</Text>

                  <Text>
                    {doc.actualVisits}/{doc.targetFrequency} calls
                  </Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    height: 5,
                    backgroundColor: "#eee",
                    marginVertical: 10,
                    borderRadius: 5,
                  }}
                >
                  <View
                    style={{
                      width: `${percent}%`,
                      height: 5,
                      backgroundColor: "deepskyblue",
                      borderRadius: 5,
                    }}
                  />
                </View>

                <Text>{percent.toFixed(0)}% coverage</Text>
              </View>
            );
          })}
        </View>

        {/* Sales and POBs Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="shopping-cart" size={20} color="deeppink" />
            <Text style={styles.cardTitle}>Sales & POBs This Month</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Your purchase order booking performance
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total POB Value</Text>
              <Text style={styles.statValue}>₹{sales?.pobValue ?? 0}</Text>
              <Text style={styles.statDescription}>
                {sales?.orders ?? 0} orders
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Conversion Rate</Text>
              <Text style={styles.statValue}>
                {sales?.conversionRate ?? 0}%
              </Text>
              <Text style={styles.statDescription}>calls to POB ratio</Text>
            </View>
          </View>
        </View>

        {/* Activity Breakdown */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="pie-chart" size={20} color="red" />
            <Text style={styles.cardTitle}>Activity Breakdown</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Time allocation between doctors and chemists
          </Text>

          <View style={styles.activityContainer}>
            <View style={styles.activityItem}>
              <View style={styles.activityHeader}>
                <View style={styles.activityLabel}>
                  <View style={[styles.colorDot, styles.yellowDot]} />
                  <Text style={styles.activityText}>Doctor Visits</Text>
                </View>
                <Text style={styles.activityPercent}>
                  {doctorPercent.toFixed(0)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    styles.yellowFill,
                    { width: `${doctorPercent}%` },
                  ]}
                />
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={styles.activityHeader}>
                <View style={styles.activityLabel}>
                  <View style={[styles.colorDot, styles.blueDot]} />
                  <Text style={styles.activityText}>Chemist Visits</Text>
                </View>
                <Text style={styles.activityPercent}>
                  {chemistPercent.toFixed(0)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <Text style={styles.activityPercent}>
                  {chemistPercent.toFixed(0)}%
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.totalVisits}>
            Total: {activityBreakdown?.totalVisits ?? 0} visits this month
          </Text>
        </View>

        {/* Most Frequently Visited Doctors */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="users" size={20} color="black" />
            <Text style={styles.cardTitle}>
              Most Frequently Visited Doctors
            </Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Your top doctor relationships this month
          </Text>

          {topDoctors?.length ? (
            topDoctors.map((doc) => (
              <View
                key={doc._id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text>{doc.name}</Text>
                <Text>{doc.visits} visits</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather
                name="users"
                size={64}
                color="lightgray"
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>
                No doctor visits recorded yet this month
              </Text>
            </View>
          )}
        </View>

        {/* Today's Status */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AntDesign name="stock" size={20} color="deeppink" />
            <Text style={styles.cardTitle}>Today's Status</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Your current attendance and plan status
          </Text>

          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Attendance Status</Text>
              <View style={styles.statusValue}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>
                  {todayStatus?.attendance ? "Started" : "Not Started"}
                </Text>
              </View>
            </View>

            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Plan Status</Text>
              <Text style={styles.planText}>
                {todayStatus?.plansToday > 0
                  ? `${todayStatus.plansToday} plans today`
                  : "Plan not shared yet"}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <Text style={styles.cardSubtitle}>Navigate to key functions</Text>

          <View style={styles.actionsContainer}>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Attendance")}
                style={styles.actionButton}
              >
                <AntDesign name="clock-circle" size={24} color="deeppink" />
                <Text style={styles.actionText}>Attendance</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("DoctorChemistListScreen")}
                style={styles.actionButton}
              >
                <Feather name="users" size={24} color="deeppink" />
                <Text style={styles.actionText}>Doctors</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate("CreatePOBScreen")}
                style={styles.actionButton}
              >
                <Feather name="shopping-cart" size={24} color="deeppink" />
                <Text style={styles.actionText}>Create POB</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="stats-chart-sharp" size={24} color="deeppink" />
                <Text style={styles.actionText}>Reports</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  subLabel: {
    fontSize: 14,
    color: "grey",
    lineHeight: 20,
  },
  userBadge: {
    borderWidth: 1,
    borderColor: "hotpink",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "lightpink",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 16,
  },
  userName: {
    fontWeight: "bold",
    color: "black",
    fontSize: 14,
  },
  userHQ: {
    fontWeight: "bold",
    color: "black",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "grey",
    marginBottom: 16,
    lineHeight: 20,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricSpacing: {
    marginTop: 20,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 4,
  },
  metricDescription: {
    fontSize: 14,
    color: "grey",
    marginTop: 2,
  },
  successText: {
    color: "green",
    fontWeight: "500",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "deeppink",
    borderRadius: 3,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  statLabel: {
    fontSize: 14,
    color: "grey",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
  statDescription: {
    fontSize: 12,
    color: "grey",
  },
  activityContainer: {
    marginTop: 8,
  },
  activityItem: {
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  activityLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  yellowDot: {
    backgroundColor: "#FFD700",
  },
  blueDot: {
    backgroundColor: "#4169E1",
  },
  activityText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  activityPercent: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  yellowFill: {
    backgroundColor: "#FFD700",
  },
  blueFill: {
    backgroundColor: "#4169E1",
  },
  totalVisits: {
    fontSize: 14,
    color: "grey",
    textAlign: "center",
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "grey",
    textAlign: "center",
  },
  statusContainer: {
    marginTop: 8,
  },
  statusItem: {
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  statusValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "gray",
  },
  statusText: {
    fontSize: 14,
    color: "gray",
  },
  planText: {
    fontSize: 14,
    color: "gray",
    fontStyle: "italic",
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fafafa",
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },

  header: {
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 14,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
  keyPoints: {
    fontSize: 14,
    fontWeight: "300",
    marginLeft: 4,
  },
});
