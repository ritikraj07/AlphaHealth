import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import EditEmployeeModal from "./Modals/EditEmployeeModal";


export default function EmployeeDetailScreen({ route }: {route: any}) {
  const { employee, id } = route.params;
  const [editVisible, setEditVisible] = useState(false);

  // console.log(employee)

  if (id) {
    return (
      <View>
        <Text> You can get employee details here from id setup later</Text>
      </View>
    );
  }
  const totalLeaves =
    employee.leavesTaken.sick +
    employee.leavesTaken.casual +
    employee.leavesTaken.earned +
    employee.leavesTaken.public;

  // return (<View>
  //   <Text>wait</Text>
  // </View>)
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{employee.name.charAt(0)}</Text>
        </View>

        <Text style={styles.name}>{employee.name}</Text>
        <Text style={styles.role}>{employee.role.toUpperCase()}</Text>
        <Text style={styles.email}>{employee?.email}</Text>
        <Text style={styles.phone}>{employee?.phone}</Text>

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
          {employee.manager.name}
          {/* ({employee.manager.model}) */}
        </Text>
      </View>

      {/* Leaves */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leaves Summary</Text>
        <View style={styles.leaveRow}>
          <Text>Sick: {employee.leavesTaken.sick}</Text>
          <Text>Casual: {employee.leavesTaken.casual}</Text>
          <Text>Earned: {employee.leavesTaken.earned}</Text>
          <Text>Public: {employee.leavesTaken.public}</Text>
        </View>
        <Text style={styles.totalLeaves}>Total: {totalLeaves}</Text>
      </View>

      {/* Edit Modal */}
      <EditEmployeeModal
        visible={editVisible}
        employee={employee}
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
