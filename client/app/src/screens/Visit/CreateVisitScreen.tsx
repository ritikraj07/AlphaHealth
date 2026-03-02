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

  console.log(" 🚀 ~ file: CreateVisitScreen.tsx:23 ~ CreateVisitScreen ~ params:",
    params
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
    


  const { data: doctorsData } = useGetDoctorChemistDashboardQuery({
    type: "doctor",
    search: doctorSearch,
  });

    const { data: employeesDataSet } = useGetEmployeesQuery({});
    
    
    const employeesData = employeesDataSet?.data?.employees || [];
    
    console.log(
      "🚀 ~ file: CreateVisitScreen.tsx:78 ~ doctorsData:",
      // employeesData,
    );
  const [createVisit, { isLoading }] = useCreateVisitMutation();

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
        console.log(" 🚀 ~ file: CreateVisitScreen.tsx:98 ~ handleSubmit ~ error: ", error);
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

      {/* Doctor Modal */}
      <Modal visible={doctorModal}>
        <View style={styles.modal}>
          <TextInput
            style={styles.input}
            placeholder="Search Doctor"
            value={doctorSearch}
            onChangeText={setDoctorSearch}
          />
          <FlatList
            data={doctorsData?.data || []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  setSelectedDoctor(item._id);
                  setDoctorName(item.name);
                  setDoctorModal(false);
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Employee Modal */}
      <Modal visible={employeeModal}>
        <View style={styles.modal}>
          <FlatList
            data={employeesData || []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => toggleEmployee(item._id)}
              >
                <Text>
                  {selectedEmployees.includes(item._id) ? "✓ " : ""}
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => setEmployeeModal(false)}
          >
            <Text style={styles.submitText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default CreateVisitScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
  modal: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
