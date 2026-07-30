import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useDispatch } from "react-redux";
import { performLogout } from "../utils/logout";
import {
  Ionicons,
  FontAwesome6,
  AntDesign,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavProp } from "../../navigators";

const AdminDrawer = (props: any) => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await performLogout(dispatch, props.navigation);
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>PP</Text>
        </View>

        <View>
          <Text style={styles.appName}>PharmaPrime</Text>
          <Text style={styles.subtitle}>Admin Panel</Text>
        </View>
      </View>

      {/* Navigation Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Management</Text>

        <MenuItem
          icon={<Ionicons name="calendar-outline" size={20} color="#e91e62" />}
          label="Leave Applications"
          onPress={() => navigation.navigate("LeaveAppliedScreen")}
        />

        <MenuItem
          icon={<FontAwesome6 name="user-doctor" size={20} color="#e91e62" />}
          label="Manage Doctors"
          onPress={() => navigation.navigate("DoctorChemistListScreen")}
        />

        <MenuItem
          icon={<AntDesign name="product" size={24} color="#e91e62" />}
          label="Products"
          onPress={() => navigation.navigate("ProductScreen")}
        />
        <MenuItem
          icon={<MaterialIcons name="co-present" size={24} color="#e91e62" />}
          label="Attendance History"
          onPress={() =>
            navigation.navigate("AttendanceHistory", { mode: "admin" })
          }
        />
      </View>

      {/* Analytics */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Analytics</Text>

        <MenuItem
          icon={<Feather name="bar-chart-2" size={20} color="#e91e62" />}
          label="Analytics Dashboard"
          onPress={() => navigation.navigate("AnalyticsDashboard")}
        />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default AdminDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: "gray",
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

  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
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
