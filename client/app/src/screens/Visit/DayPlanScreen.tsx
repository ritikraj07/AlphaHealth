import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ToastAndroid,
  StatusBar, // ✅ imported
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useCreateVisitMutation } from "../../shared/store/api/visitApi";
import { useGetDoctorChemistDashboardQuery } from "../../shared/store/api/doctorChemistApi";
import { useGetEmployeesQuery } from "../../shared/store/api/employeeApi";

interface RouteParams {
  planId?: string;
  doctorChemistId?: string;
  doctorName?: string;
  jointEmployees?: string[];
}

const CreateVisitScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as RouteParams | undefined;

  console.log(
    " 🚀 ~ file: CreateVisitScreen.tsx:23 ~ CreateVisitScreen ~ params:",
    params,
  );

  const fromPlan = !!params?.planId;

  const [planId] = useState(params?.planId);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(
    params?.doctorChemistId || null,
  );
  const [doctorName, setDoctorName] = useState<string | null>(
    params?.doctorName || null,
  );
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(
    params?.jointEmployees || [],
  );
  const [remark, setRemark] = useState("");
  const [isOrderReceived, setIsOrderReceived] = useState(false);

  const [doctorModal, setDoctorModal] = useState(false);
  const [employeeModal, setEmployeeModal] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState(""); // ✅ added

  const { data: doctorsData } = useGetDoctorChemistDashboardQuery({
    type: "doctor",
    search: doctorSearch,
  });

  const { data: employeesDataSet } = useGetEmployeesQuery({});
  const employeesData = employeesDataSet?.data?.employees || [];

  const [createVisit, { isLoading }] = useCreateVisitMutation();

  // ✅ Filtered employees for search
  const filteredEmployees = useMemo(() => {
    if (!employeesData) return [];
    return employeesData.filter((e) =>
      e.name.toLowerCase().includes(employeeSearch.toLowerCase()),
    );
  }, [employeesData, employeeSearch]);

  const handleSubmit = async () => {
    if (!selectedDoctor) {
      ToastAndroid.show("Please select doctor", ToastAndroid.SHORT);
      return;
    }

    try {
      await createVisit({
        plan: planId,
        doctorChemist: selectedDoctor,
        jointEmployees: selectedEmployees,
        remark,
        isOrderReceived,
      }).unwrap();

      Alert.alert("Success", "Visit Created");
      navigation.goBack();
    } catch (error) {
      console.log(
        " 🚀 ~ file: CreateVisitScreen.tsx:98 ~ handleSubmit ~ error: ",
        error,
      );
      Alert.alert("Error", "Something went wrong");
    }
  };

  const toggleEmployee = (id: string) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees((prev) => prev.filter((emp) => emp !== id));
    } else {
      setSelectedEmployees((prev) => [...prev, id]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Day Plan</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Doctor Dropdown */}
        <Text style={styles.label}>Doctor</Text>
        <TouchableOpacity
          style={[styles.dropdown, fromPlan && styles.disabled]}
          disabled={fromPlan}
          onPress={() => setDoctorModal(true)}
        >
          <Text>{doctorName || "Select Doctor"}</Text>
        </TouchableOpacity>

        {/* Joint Employees */}
        <Text style={styles.label}>Joint Employees</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setEmployeeModal(true)}
        >
          <Text>
            {selectedEmployees.length
              ? `${selectedEmployees.length} Selected`
              : "Select Employees"}
          </Text>
        </TouchableOpacity>

        {/* Remark */}
        <Text style={styles.label}>Remark</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={remark}
          onChangeText={setRemark}
          placeholder="Enter visit remark"
          placeholderTextColor={"#999"}
        />

        {/* Order Received */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setIsOrderReceived(!isOrderReceived)}
        >
          <Text style={{ fontSize: 16 }}>
            {isOrderReceived ? "☑" : "☐"} Order Received
          </Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitText}>
            {isLoading ? "Saving..." : "Create Visit"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* =================== DOCTOR MODAL =================== */}
      <Modal animationType="slide" visible={doctorModal}>
        <View style={styles.modalContainer}>
          <StatusBar backgroundColor="#e91e62" barStyle="light-content" />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Doctor</Text>
            <TouchableOpacity onPress={() => setDoctorModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, styles.searchInput]}
            placeholder="Search Doctor"
            placeholderTextColor="#999"
            value={doctorSearch}
            onChangeText={setDoctorSearch}
          />
          <FlatList
            data={doctorsData?.data || []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  selectedDoctor === item._id && styles.selectedItem,
                ]}
                onPress={() => {
                  setSelectedDoctor(item._id);
                  setDoctorName(item.name);
                  setDoctorModal(false);
                }}
              >
                <Text style={styles.listItemText}>{item.name}</Text>
                {selectedDoctor === item._id && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* =================== EMPLOYEE MODAL =================== */}
      <Modal animationType="slide" visible={employeeModal}>
        <View style={styles.modalContainer}>
          <StatusBar backgroundColor="#e91e62" barStyle="light-content" />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Employees</Text>
            <TouchableOpacity onPress={() => setEmployeeModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, styles.searchInput]}
            placeholder="Search Employee"
            placeholderTextColor="#999"
            value={employeeSearch}
            onChangeText={setEmployeeSearch}
          />
          <FlatList
            data={filteredEmployees}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  selectedEmployees.includes(item._id) && styles.selectedItem,
                ]}
                onPress={() => toggleEmployee(item._id)}
              >
                <Text style={styles.listItemText}>{item.name}</Text>
                {selectedEmployees.includes(item._id) && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default CreateVisitScreen;

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    backgroundColor: "#e91e62",
    padding: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "700",
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
  },
  disabled: {
    backgroundColor: "#f2f2f2",
  },
  checkboxRow: {
    marginTop: 20,
  },
  submitBtn: {
    marginTop: 30,
    backgroundColor: "#e91e62",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },

  // ========= MODAL STYLES =========
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingTop: 40, // for status bar on Android
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e91e62",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#d81b60",
    paddingTop: 40,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    padding: 4,
  },
  searchInput: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f8f8f8",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedItem: {
    backgroundColor: "#fce4ec", // light pink highlight
  },
  listItemText: {
    fontSize: 16,
    color: "#333",
  },
  checkMark: {
    fontSize: 18,
    color: "#e91e62",
    fontWeight: "bold",
  },
});
