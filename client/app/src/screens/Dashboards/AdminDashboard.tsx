import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  RefreshControl,
} from "react-native";
import React, { JSX, useState } from 'react'
import {
  Octicons,
  Feather,
  EvilIcons,
  FontAwesome6,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import AddEmployeeModal from "../Modals/AddEmployeeModal";
import { useCreateEmployeeMutation } from "../../shared/store/api/employeeApi";

import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { handleApiError } from "../../shared/utils/apiErrorHandler";
import { performLogout } from "../../shared/utils/logout";
import GlobalError from "../../shared/componets/common/GlobalError";

import { useGetAdminDashboardQuery } from "../../shared/store/api/adminApi";
import AdminDashboardSkeleton from "../../shared/componets/skeletons/AdminDashboardSkeleton";
import AddHeadQuarterModal from "../Modals/AddHeadQuarterModal";
import { useAppSelector } from "../../shared/store/hooks";


type Props = {
  title: string;
  numberOfEmployees: number;
  subtitle: string;
  iconFrom: string;
  icon: any;
};

/**
 * A component that displays an employee's information in a card format.
 * @param {Props} emp - an object containing the title, number, subtitle, iconFrom, and icon for the employee.
 * @returns {JSX.Element} - a JSX element representing the employee's information in a card format.
 */
const EmployeeBox = (emp: Props, ): JSX.Element=>{
    const Icon = () => {
        if (emp.iconFrom === "Feather") {
          return <Feather name={emp.icon} size={24} color="black" />;
        } else if (emp.iconFrom === "EvilIcons") {
          return <EvilIcons name={emp.icon} size={24} color="black" />;
        } else if (emp.iconFrom === "FontAwesome6") {
          return <FontAwesome6 name={emp.icon} size={24} color="black" />;
        } else if (emp.iconFrom === "AntDesign") {
          return <AntDesign name={emp.icon} size={24} color="black" />;
        }
    }
    return (
      <View style={styles.statItem}>
        <View style={styles.statIcon}>
          <Text style={styles.statMainText}>{emp.title}</Text>
          <Icon />
        </View>
        <Text style={styles.statNumber}>{emp.numberOfEmployees}</Text>
        <Text style={styles.statSubText}>{emp.subtitle}</Text>
      </View>
    );
}

/**
 * Admin dashboard screen
 * This screen displays statistics about employees, doctors, and system usage, and provides quick actions for administrative tasks.
 * @returns {JSX.Element} - a JSX element representing the admin dashboard screen.
 */
export default function AdminDashboard(): JSX.Element {
  const {
    data,
    isLoading: dashboardLoading,
    isFetching,
    refetch, error, isError } = useGetAdminDashboardQuery({});
  
  const [createEmployee, { isLoading: createEmployeeLoading }] =  useCreateEmployeeMutation();
  const { userId, name} = useAppSelector((state) => state.auth);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const TotalEmployee = data?.data?.employees?.total ?? 0;
  const TotalManager = data?.data?.employees?.managers ?? 0;
  const TotalHR = data?.data?.employees?.hr ?? 0;
  const TotalDoctors = data?.data?.doctors?.doctors ?? 0;
  const TotalChemists = data?.data?.doctors?.chemists ?? 0;
  const TotalHospitals = data?.data?.hospitals?.hospitals ?? 0;
  const HQ = data?.data?.hqDistribution;
  const TodaysAttendace = data?.data?.attendace?.presentToday ?? 0;
  const PendingLeaves = data?.data?.leaves?.pending ?? 0;
  const ApprovedLeaves = data?.data?.leaves?.approved ?? 0;
  const RejectedLeaves = data?.data?.leaves?.rejected ?? 0;
  

  
  
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isAddHQModalVisible, setIsAddHQModalVisible] = useState(false);
  
    const employee = [
      {
        title: "Total Employee",
        number: TotalEmployee,
        subtitle: "All system users",
        iconFrom: "Feather",
        icon: "users",
      },
      {
        title: "Managers",
        number: TotalManager,
        subtitle: "Management level",
        iconFrom: "AntDesign",
        icon: "profile",
      },
      {
        title: "Today's Attendace",
        number: TodaysAttendace,
        subtitle: "Total Present ",
        iconFrom: "FontAwesome6",
        icon: "hand",
      },
    ];
  
   if (dashboardLoading) {
     return <AdminDashboardSkeleton />;
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
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <AddEmployeeModal
        visible={isAddEmployeeModalVisible}
        onClose={() => setIsAddEmployeeModalVisible(false)}
        managerId={userId}
        managerModel="Admin"
      />
      <AddHeadQuarterModal
        visible={isAddHQModalVisible}
        onClose={() => setIsAddHQModalVisible(false)}
        onAddHQ={() => {}}
      />

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        {/* Header Section - EXACT MATCH */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <View style={styles.adminAccessContainer}>
              <Text style={styles.adminAccessText}>ADMIN ACCESS</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Manage employees, doctors, and system settings
          </Text>
        </View>

        {/* First Row Stats - EXACT MATCH */}
        <View style={styles.statsSection}>
          {employee.map((emp, index) => (
            <EmployeeBox
              key={index}
              title={emp.title}
              numberOfEmployees={emp.number}
              subtitle={emp.subtitle}
              iconFrom={emp.iconFrom}
              icon={emp.icon}
            />
          ))}
        </View>

        {/* Second Row Stats - EXACT MATCH */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Text style={styles.statMainText}>Doctors</Text>
              <Feather name="database" size={24} color="black" />
            </View>
            <Text style={styles.statSubText}>Doctors: {TotalDoctors}</Text>
            <Text style={styles.statSubText}>Chemists: {TotalChemists}</Text>
            {/* Record of which thing */}
            <Text style={styles.statSubText}>Records: 0</Text>
          </View>

          <View style={styles.statDivider} />
        </View>

        {/* Third Row Stats - Applied Leave */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Text style={styles.statMainText}>Applied Leave</Text>
              <Ionicons name="calendar-outline" size={24} />
            </View>
            <Text style={styles.statSubText}>Pending: {PendingLeaves}</Text>
            <Text style={styles.statSubText}>Approved: {ApprovedLeaves}</Text>
            <Text style={styles.statSubText}>Rejected: {RejectedLeaves}</Text>
          </View>

          <View style={styles.statDivider} />
        </View>

        {/* HQ Distribution Section - EXACT MATCH */}
        <View style={styles.section}>
          <Text style={styles.sectionMainTitle}>HQ Distribution</Text>
          <Text style={styles.sectionSubTitle}>
            Employee distribution across headquarters
          </Text>
          {HQ.map((hq: any, index: any) => (
            <View key={index} style={styles.distributionContainer}>
              <View style={styles.distributionRow}>
                <Text style={styles.hqName}>{hq.name}</Text>
                <Text style={styles.hqCount}>{hq.employeeCount} employees</Text>
                <Text style={styles.hqPercent}>{hq.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions Section - EXACT MATCH */}
        <View style={styles.section}>
          <Text style={styles.sectionMainTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubTitle}>Administrative tasks</Text>

          <View style={styles.actionsContainer}>
            <View style={styles.actionRow}>
              <ActionButton
                icon={<Octicons name="person-add" size={24} color="#fff" />}
                label="Add Employee"
                onPress={() => setIsAddEmployeeModalVisible(true)}
              />
              <ActionButton
                icon={<FontAwesome6 name="city" size={24} color="#fff" />}
                label="Add Headquarter"
                onPress={() => {
                  setIsAddHQModalVisible(true);
                }}
              />

              {/* <TouchableOpacity style={styles.actionButton}>
                <Feather name="database" size={24} color="#e91e62" />
                <Text style={styles.actionButtonText}>System Reports</Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.actionRow}>
              <ActionButton
                icon={<Feather name="users" size={24} color="#ffffffff" />}
                label="Manage Doctors"
                onPress={() => {}}
              />
              <ActionButton
                icon={<AntDesign name="profile" size={24} color="#e3e3e3ff" />}
                label="HQ Settings"
                onPress={() => {}}
              />
            </View>
          </View>
        </View>

        {/* Footer Section - just for spacing */}
        <View style={{ height: 100 }}></View>
        {/* <Footer /> */}
      </ScrollView>
    </View>
  );
}

const ActionButton = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    {icon}
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    paddingTop: 10,
    paddingBottom: 16,
    marginBottom: 16,
  },
  statIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666666ff",
    marginBottom: 12,
  },
  adminAccessContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#e91e62",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  adminAccessText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statsSection: {
    backgroundColor: "#ffffff",
    flexWrap: "nowrap",
  },
  statItem: {
    flex: 1,
    padding: 16,
    borderWidth: 0.5,
    marginVertical: 8,
    borderRadius: 8,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e5e5",
  },
  statMainText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  statSubText: {
    fontSize: 12,
    color: "#666666",
  },
  section: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    marginTop: 16,
    borderRadius: 8,
    marginBottom: 40,
  },
  sectionMainTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  sectionSubTitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
  },
  distributionContainer: {
    gap: 0,
  },
  distributionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  hqName: {
    fontSize: 16,
    color: "#000000",
    flex: 1,
  },
  hqCount: {
    fontSize: 16,
    color: "#000000",
    flex: 1,
    textAlign: "center",
  },
  hqPercent: {
    fontSize: 16,
    color: "#000000",
    flex: 1,
    textAlign: "right",
    fontWeight: "500",
  },
  actionsContainer: {
    gap: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flex: 1,

    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "grey",
  },
  actionButtonText: {
    color: "#000000ff",
    fontSize: 14,
    fontWeight: "600",
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#e91e62",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    marginTop: 6,
    fontWeight: "600",
  },
});