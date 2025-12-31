import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useGetMyDetailQuery } from "../store/api/employeeApi";
import { useAppSelector } from "../store/hooks";
import { useDispatch } from "react-redux";
import { performLogout } from "../utils/logout";

export default function EmployeeDrawer(props: any) {
  const dispatch = useDispatch();
  const { userId } = useAppSelector((state) => state.auth);
  const { data } = useGetMyDetailQuery({ id: userId });

  const handleLogout = async () => {
    await performLogout(dispatch, props.navigation);
  };

  const user = data?.data;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.header}>
        <Text style={styles.appName}>PharmaPrime</Text>
      </View>

      <View style={styles.userInfo}>
        {/* <Image
          source={require("../images/avatar.png")} // placeholder avatar
          style={styles.avatar}
        /> */}
        <Text style={styles.userName}>Hello, {user?.name} 👋</Text>
        <Text style={styles.userDetail}>{user?.hq?.name}</Text>
        {user?.manager && (
          <Text style={styles.userDetail}>Manager: {user?.manager?.name}</Text>
        )}
      </View>

      <View style={styles.leaves}>
        <Text style={styles.leavesTitle}>Leaves Taken</Text>
        <View style={styles.leaveRow}>
          <Text>Sick:</Text>
          <Text>{user?.leavesTaken?.sick}</Text>
        </View>
        <View style={styles.leaveRow}>
          <Text>Casual:</Text>
          <Text>{user?.leavesTaken?.casual}</Text>
        </View>
        <View style={styles.leaveRow}>
          <Text>Earned:</Text>
          <Text>{user?.leavesTaken?.earned}</Text>
        </View>
        <View style={styles.leaveRow}>
          <Text>Public:</Text>
          <Text>{user?.leavesTaken?.public}</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 20,
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e91e62",
  },
  userInfo: {
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  userDetail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  leaves: {
    marginBottom: 30,
  },
  leavesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#e91e62",
  },
  leaveRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e91e62",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
