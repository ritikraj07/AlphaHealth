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
import { useNavigation } from "@react-navigation/native";


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
  const navigation = useNavigation();
    
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
      <View style={styles.header}>
        <Text style={styles.title}>Tour Plan</Text>
      </View>
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
          placeholderTextColor={"grey"}
        />

        {/* <View style={{ height: 100, width: "100%" }}></View> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelbtm}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={{ color: "#fff" }}>
              {isLoading ? "Creating..." : "Create "}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ================= MODALS ================= */}

      {/* Doctor Modal */}
      <Modal animationType="slide" visible={doctorModal}>
        <View style={styles.modalContainer}>
          {/* Header with title + close button */}
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
                  selectedDoctor?._id === item._id && styles.selectedItem,
                ]}
                onPress={() => {
                  setSelectedDoctor(item);
                  setDoctorModal(false);
                }}
              >
                <Text style={styles.listItemText}>{item.name}</Text>
                {selectedDoctor?._id === item._id && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Product Modal */}
      <Modal animationType="slide" visible={productModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Products</Text>
            <TouchableOpacity onPress={() => setProductModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, styles.searchInput]}
            placeholder="Search Product"
            placeholderTextColor="#999"
            value={productSearch}
            onChangeText={setProductSearch}
          />
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  selectedProducts.some((p) => p._id === item._id) &&
                    styles.selectedItem,
                ]}
                onPress={() => toggleProduct(item)}
              >
                <Text style={styles.listItemText}>{item.product_name}</Text>
                {selectedProducts.some((p) => p._id === item._id) && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Employee Modal */}
      <Modal animationType="slide" visible={employeeModal} >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Employees (Max 4)</Text>
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
                  selectedEmployees.some((e) => e._id === item._id) &&
                    styles.selectedItem,
                ]}
                onPress={() => toggleEmployee(item)}
              >
                <Text style={styles.listItemText}>{item.name}</Text>
                {selectedEmployees.some((e) => e._id === item._id) && (
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

export default CreatePlanScreen;

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // paddingBottom: 100,
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
    justifyContent: "center",
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

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  submitBtn: {
    backgroundColor: "#e91e62",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "45%",
  },
  cancelbtm: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "45%",
    borderWidth: 1,
    borderColor: "#e91e62",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingTop: 40, // for status bar
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
    paddingTop:40
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
