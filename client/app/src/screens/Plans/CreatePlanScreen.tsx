import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  ToastAndroid,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useCreatePlanMutation } from "../../shared/store/api/planApi";
import { useGetDoctorChemistDashboardQuery } from "../../shared/store/api/doctorChemistApi";
import { useGetProductsQuery, IProduct } from "../../shared/store/api/productApi";
import {
  useGetEmployeesQuery,
  EmployeesResponse,
} from "../../shared/store/api/employeeApi";

import { CreatePlanPayload } from "../../shared/types/plan.types";


// ================= TYPES =================

interface DoctorChemist {
  _id: string;
  name: string;
}



interface Employee {
  _id: string;
  name: string;
}




// ================= COMPONENT =================

const CreatePlanScreen = () => {
    
  const [title, setTitle] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorChemist | null>(
    null,
  );
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
const [remark, setRemark] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [doctorModal, setDoctorModal] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [employeeModal, setEmployeeModal] = useState(false);

  const [doctorSearch, setDoctorSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");

  const { data: doctorsData } = useGetDoctorChemistDashboardQuery({
    type: "doctor",
    search: doctorSearch,
  });

  const { data: productsData } = useGetProductsQuery();
  const { data: employeesData } = useGetEmployeesQuery({});

  const [createPlan, { isLoading }] = useCreatePlanMutation();

  // ================= FILTERED DATA =================

  const filteredProducts = useMemo(() => {
    if (!productsData) return [];
    return productsData.filter((p) =>
      p?.product_name.includes(productSearch.toLowerCase()),
    );
  }, [productsData, productSearch]);

  const filteredEmployees = useMemo(() => {
    if (!employeesData?.data) return [];
    return employeesData?.data?.employees.filter((e) =>
      e.name.toLowerCase().includes(employeeSearch.toLowerCase()),
    );
  }, [employeesData, employeeSearch]);

  // ================= HANDLERS =================

  const toggleProduct = (product: IProduct) => {
    const exists = selectedProducts.find((p) => p._id === product._id);
    if (exists) {
      setSelectedProducts((prev) => prev.filter((p) => p._id !== product._id));
    } else {
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const toggleEmployee = (employee: Employee) => {
    const exists = selectedEmployees.find((e) => e._id === employee._id);

    if (exists) {
      setSelectedEmployees((prev) =>
        prev.filter((e) => e._id !== employee._id),
      );
    } else {
      if (selectedEmployees.length >= 4) {
        Alert.alert("Limit Reached", "Maximum 4 joint work employees allowed.");
        return;
      }
      setSelectedEmployees((prev) => [...prev, employee]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDoctor) {
        
        ToastAndroid.show("Please select a doctor", ToastAndroid.SHORT);
      return;
    }

    const payload: CreatePlanPayload = {
      doctorChemist: selectedDoctor._id,
      date: date.toISOString(),
      productFocus: selectedProducts.map((p) => p._id),
      jointEmployees: selectedEmployees.map((e) => e._id),
      employeeModel: "Admin",
      remark,
      isJointPlan: selectedEmployees.length >= 1,
    };

    console.log(" payload", payload);
      

    try {
      await createPlan(payload).unwrap();

        resetForm()
        ToastAndroid.show("Plan created successfully", ToastAndroid.SHORT);
      setTitle("");
      setSelectedDoctor(null);
      setSelectedProducts([]);
      setSelectedEmployees([]);
    } catch (error) {
        console.log( "error from create plan", error)
        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSelectedDoctor(null);
    setSelectedProducts([]);
    setSelectedEmployees([]);
    setRemark("");
    setDate(new Date());

  }

  // ================= UI =================

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
          <ScrollView
              contentContainerStyle={styles.container}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}

          >
        {/* <Text style={styles.label}>Plan Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter plan title"
          value={title}
          onChangeText={setTitle}
        /> */}

        {/* Doctor Dropdown */}
        <Text style={styles.label}>Select Doctor</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDoctorModal(true)}
        >
          <Text>{selectedDoctor ? selectedDoctor.name : "Choose Doctor"}</Text>
        </TouchableOpacity>

        {/* Date Picker */}
        <Text style={styles.label}>Plan Date</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            minimumDate={new Date()} // no past date
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Products Multi Select */}
        <Text style={styles.label}>Products</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setProductModal(true)}
        >
          <Text>
            {selectedProducts.length
              ? `${selectedProducts.length} Selected`
              : "Select Products"}
          </Text>
        </TouchableOpacity>

        {/* Joint Work */}
        <Text style={styles.label}>Joint Field Work (Max 4)</Text>
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

        <Text style={styles.label}>Remark (Optional)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Add remark"
          value={remark}
          onChangeText={setRemark}
          multiline
        />

        <View style={{ height: 100, width: "100%" }}></View>
      </ScrollView>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={{ color: "#fff" }}>
            {isLoading ? "Creating..." : "Create Plan"}
          </Text>
        </TouchableOpacity>

      {/* ================= MODALS ================= */}

      {/* Doctor Modal */}
      <Modal visible={doctorModal}>
        <View style={styles.modalContainer}>
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
                  setSelectedDoctor(item);
                  setDoctorModal(false);
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.modalSubmitBtn}
            onPress={() => setDoctorModal(false)}
          >
            <Text style={styles.modalSubmitText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Product Modal */}
      <Modal visible={productModal}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search Product"
            value={productSearch}
            onChangeText={setProductSearch}
          />
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => toggleProduct(item)}
              >
                <Text>
                  {selectedProducts.find((p) => p._id === item._id) ? "✓ " : ""}
                  {item.product_name}
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.modalSubmitBtn}
            onPress={() => setProductModal(false)}
          >
            <Text style={styles.modalSubmitText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Employee Modal */}
      <Modal visible={employeeModal}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search Employee"
            value={employeeSearch}
            onChangeText={setEmployeeSearch}
          />
          <FlatList
            data={filteredEmployees}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => toggleEmployee(item)}
              >
                <Text>
                  {selectedEmployees.find((e) => e._id === item._id)
                    ? "✓ "
                    : ""}
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.modalSubmitBtn}
            onPress={() => setEmployeeModal(false)}
          >
            <Text style={styles.modalSubmitText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default CreatePlanScreen;

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
        padding: 16,
        paddingBottom: 100
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
    justifyContent: "center",
  },
  submitBtn: {
    
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
      alignItems: "center",
      position: 'absolute',
      bottom: 10,
      left: 16,
      right: 16,
      marginBottom:30
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  modalSubmitBtn: {
    marginTop: 16,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  modalSubmitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
