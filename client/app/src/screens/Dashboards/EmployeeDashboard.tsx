import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { RefreshControl } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import GlobalError from "../../shared/componets/common/GlobalError";
import { useGetMyDetailQuery } from "../../shared/store/api/employeeApi";
import { useAppSelector } from "../../shared/store/hooks";
import { handleApiError } from "../../shared/utils/apiErrorHandler";
import { performLogout } from "../../shared/utils/logout";
import EmployeeDashboardSkeleton from "../../shared/componets/skeletons/EmployeeDashboardSkeleton";

export default function EmployeeDashboard() {
  const navigation = useNavigation();
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
console.log(data)
  

  if (isLoading) {
    return (
      <EmployeeDashboardSkeleton />
    );
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
            <Text style={styles.metricValue}>0%</Text>
          </View>
          <Text style={styles.metricNumber}>0</Text>
          <Text style={styles.metricDescription}>of 100 target doctors</Text>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "0%" }]} />
          </View>

          {/* Call Execution */}
          <View style={[styles.metricRow, styles.metricSpacing]}>
            <Text style={styles.metricLabel}>Call Execution</Text>
            <Text style={styles.metricValue}>0%</Text>
          </View>
          <Text style={styles.metricNumber}>0</Text>
          <Text style={styles.metricDescription}>of 0 planned calls</Text>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "0%" }]} />
          </View>

          {/* High-Potential Frequency */}
          <View style={[styles.metricRow, styles.metricSpacing]}>
            <Text style={styles.metricLabel}>High-Potential Frequency</Text>
            <Entypo name="star-outlined" size={20} color="black" />
          </View>
          <Text style={styles.metricNumber}>0.0</Text>
          <Text style={styles.metricDescription}>
            avg visits per high-potential doctor
          </Text>
          <Text style={[styles.metricDescription, styles.successText]}>
            0 total visits to 1 doctors
          </Text>
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
              <Text style={styles.statValue}>₹0</Text>
              <Text style={styles.statDescription}>0 orders</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Conversion Rate</Text>
              <Text style={styles.statValue}>0%</Text>
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
                <Text style={styles.activityPercent}>0%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    styles.yellowFill,
                    { width: "0%" },
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
                <Text style={styles.activityPercent}>0%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    styles.blueFill,
                    { width: "0%" },
                  ]}
                />
              </View>
            </View>
          </View>

          <Text style={styles.totalVisits}>Total: 0 visits this month</Text>
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
                <Text style={styles.statusText}>Not Started</Text>
              </View>
            </View>

            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Plan Status</Text>
              <Text style={styles.planText}>Plan not shared yet</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <Text style={styles.cardSubtitle}>Navigate to key functions</Text>

          <View style={styles.actionsContainer}>
            <View style={styles.actionsRow}>
              <View style={styles.actionButton}>
                <AntDesign name="clock-circle" size={24} color="deeppink" />
                <Text style={styles.actionText}>Attendance</Text>
              </View>

              <View style={styles.actionButton}>
                <Feather name="users" size={24} color="deeppink" />
                <Text style={styles.actionText}>Doctors</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <View style={styles.actionButton}>
                <Feather name="shopping-cart" size={24} color="deeppink" />
                <Text style={styles.actionText}>Create POB</Text>
              </View>

              <View style={styles.actionButton}>
                <Ionicons name="stats-chart-sharp" size={24} color="deeppink" />
                <Text style={styles.actionText}>Reports</Text>
              </View>
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
    borderColor: "grey",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 3,
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
});
