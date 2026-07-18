import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import {
  Ionicons,
  FontAwesome6,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

import { useGetMyDetailQuery } from "../store/api/employeeApi";
import { useAppSelector } from "../store/hooks";
import { useDispatch } from "react-redux";
import { performLogout } from "../utils/logout";
import { useNavigation } from "@react-navigation/native";
import { NavProp } from "../../navigators";

export default function EmployeeDrawer(props: any) {
  const navigation = useNavigation<NavProp>();
  const dispatch = useDispatch();
 
  const { userId } = useAppSelector((state) => state.auth);

  const { data } = useGetMyDetailQuery({
    id: userId,
  });

  const user = data?.data;

  const openSetting = async () => {
    // await performLogout(dispatch, props.navigation);
    navigation.navigate("SettingsScreen");
  };

  const MenuItem = ({
    icon,
    label,
    onPress,
  }: {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.iconBox}>{icon}</View>

      <Text style={styles.menuText}>{label}</Text>

      <Ionicons name="chevron-forward" size={18} color="#bbb" />
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>PP</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.appName}>PharmaPrime</Text>

          <Text style={styles.subtitle}>
            {user?.role === "manager" ? "Manager Panel" : "Employee Panel"}
          </Text>
        </View>
      </View>

      {/* USER INFO */}

      <View style={styles.profileCard}>
        <Text style={styles.userName}>{user?.name}</Text>

        <Text style={styles.userDetail}>
          HQ : {user?.hq?.name || "Not Assigned"}
        </Text>

        {!!user?.manager && (
          <Text style={styles.userDetail}>Manager : {user?.manager?.name}</Text>
        )}
      </View>

      {/* MANAGEMENT */}

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Management</Text>

        <MenuItem
          icon={<Ionicons name="today-outline" size={20} color="#e91e62" />}
          label="Day Plan"
          onPress={() => navigation.navigate("CreateVisitScreen")}
        />

        <MenuItem
          icon={<Ionicons name="map-outline" size={20} color="#e91e62" />}
          label="Tour Plan"
          onPress={() => navigation.navigate("CreatePlanScreen")}
        />

        <MenuItem
          icon={<FontAwesome6 name="user-doctor" size={18} color="#e91e62" />}
          label="Doctors & Chemists"
          onPress={() => navigation.navigate("DoctorChemistListScreen")}
        />

        <MenuItem
          icon={<Ionicons name="cube-outline" size={20} color="#e91e62" />}
          label="Products"
          onPress={() => navigation.navigate("ProductScreen")}
        />

        {/* <MenuItem
          icon={<Ionicons name="wallet-outline" size={20} color="#e91e62" />}
          label="Expenses"
          onPress={() => navigation.navigate("ExpenseScreen")}
        /> */}

        {/* <MenuItem
          icon={<Ionicons name="calendar-outline" size={20} color="#e91e62" />}
          label="Leave Applications"
          onPress={() => navigation.navigate("LeaveAppliedScreen")}
        /> */}
      </View>

      {/* MANAGER FEATURES */}

      {/* {user?.role === "manager" && (
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Manager Tools</Text>

          <MenuItem
            icon={
              <Ionicons
                name="people-circle-outline"
                size={20}
                color="#e91e62"
              />
            }
            label="My Team"
            onPress={() => navigation.navigate("TeamScreen")}
          />

          <MenuItem
            icon={
              <Ionicons
                name="checkmark-done-outline"
                size={20}
                color="#e91e62"
              />
            }
            label="Approvals"
            onPress={() => navigation.navigate("ApprovalScreen")}
          />
        </View>
      )} */}

      {/* ANALYTICS */}

      {/* <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Analytics</Text>

        <MenuItem
          icon={<Feather name="bar-chart-2" size={20} color="#e91e62" />}
          label="My Analytics"
          onPress={() => navigation.navigate("AnalyticsDashboard")}
        />
      </View> */}

      {/* LEAVE CARD */}

      <View style={styles.leaveCard}>
        <Text style={styles.leaveTitle}>Leave Summary</Text>

        <View style={styles.leaveRow}>
          <Text style={styles.leaveLabel}>Sick Leave</Text>
          <Text style={styles.leaveValue}>{user?.leavesTaken?.sick || 0}</Text>
        </View>

        <View style={styles.leaveRow}>
          <Text style={styles.leaveLabel}>Casual Leave</Text>
          <Text style={styles.leaveValue}>
            {user?.leavesTaken?.casual || 0}
          </Text>
        </View>

        <View style={styles.leaveRow}>
          <Text style={styles.leaveLabel}>Earned Leave</Text>
          <Text style={styles.leaveValue}>
            {user?.leavesTaken?.earned || 0}
          </Text>
        </View>

        <View style={styles.leaveRow}>
          <Text style={styles.leaveLabel}>Public Holiday</Text>
          <Text style={styles.leaveValue}>
            {user?.leavesTaken?.public || 0}
          </Text>
        </View>
      </View>

      {/* LOGOUT */}

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.logoutBtn} onPress={openSetting}>
          <Feather name="settings" size={24} color="white" />
          <Text style={styles.logoutText}>Setting</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  logoCircle: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#e91e62",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  appName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e91e62",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
  },

  profileCard: {
    marginTop: 20,
    padding: 15,
    borderRadius: 14,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },

  userDetail: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  menuSection: {
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 10,
    textTransform: "uppercase",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
  },

  iconBox: {
    width: 32,
    alignItems: "center",
  },

  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },

  leaveCard: {
    marginTop: 25,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  leaveTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e91e62",
    marginBottom: 12,
  },

  leaveRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  leaveLabel: {
    fontSize: 14,
    color: "#555",
  },

  leaveValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },

  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginVertical: 20,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e91e62",
    paddingVertical: 12,
    borderRadius: 10,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
