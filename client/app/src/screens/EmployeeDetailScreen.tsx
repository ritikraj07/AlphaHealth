import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import EditEmployeeModal from "./Modals/EditEmployeeModal";
import { useGetMyDetailQuery } from "../shared/store/api/employeeApi";


export default function EmployeeDetailScreen({ route }: {route: any}) {
  const { employee, id } = route.params;
  const [editVisible, setEditVisible] = useState(false);
  const {data: employeeDetail} = useGetMyDetailQuery({ id: employee?._id || id});

  const employeeData = employeeDetail?.data || employee;
  

  const totalLeaves =
    employeeData.leavesTaken.sick +
    employeeData.leavesTaken.casual +
    employeeData.leavesTaken.earned +
    employeeData.leavesTaken.public;


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{employeeData.name.charAt(0)}</Text>
        </View>

        <Text style={styles.name}>{employeeData?.name}</Text>
        <Text style={styles.role}>{employeeData?.role.toUpperCase()}</Text>
        <Text style={styles.email}>{employeeData?.email}</Text>
        <Text style={styles.phone}>{employeeData?.phone}</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditVisible(true)}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Organizational Info</Text>
        <Text style={styles.label}>Headquarter:</Text>
        <Text style={styles.value}>{employee?.hq?.name}</Text>

        <Text style={styles.label}>Manager:</Text>
        <Text style={styles.value}>
          {/* {employee.manager?.name} */}
          {employee?.managerModel === "Admin"
            ? "Admin"
            : employeeData.manager?.name}
        </Text>
      </View>

      {/* Leaves */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leaves Summary</Text>
        <View style={styles.leaveRow}>
          <Text>Sick: {employeeData.leavesTaken.sick}</Text>
          <Text>Casual: {employeeData.leavesTaken.casual}</Text>
          <Text>Earned: {employeeData.leavesTaken.earned}</Text>
          <Text>Public: {employeeData.leavesTaken.public}</Text>
        </View>
        <Text style={styles.totalLeaves}>Total: {totalLeaves}</Text>
      </View>

      {/* Edit Modal */}
      <EditEmployeeModal
        visible={editVisible}
        employee={employeeData}
        onClose={() => setEditVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fb" },
  header: { alignItems: "center", padding: 22, backgroundColor: "#fff" },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e91e62",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "white", fontSize: 32, fontWeight: "700" },
  name: { fontSize: 20, fontWeight: "700", marginTop: 10 },
  role: { fontSize: 14, fontWeight: "600", color: "#007bff", marginTop: 4 },
  email: { fontSize: 13, color: "#555", marginTop: 4 },
  phone: { fontSize: 13, color: "#555" },
  editBtn: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#007bff",
    borderRadius: 6,
  },
  editText: { color: "#fff", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  label: { fontSize: 13, fontWeight: "600", color: "#444" },
  value: { fontSize: 14, color: "#111", marginBottom: 8 },
  leaveRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  totalLeaves: { marginTop: 8, fontWeight: "700", fontSize: 15 },
});
