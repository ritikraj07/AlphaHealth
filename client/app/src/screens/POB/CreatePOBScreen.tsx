import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

import { useGetDoctorChemistDashboardQuery } from "../../shared/store/api/doctorChemistApi";
import { useGetEmployeesQuery } from "../../shared/store/api/employeeApi";
import { useGetProductsQuery } from "../../shared/store/api/productApi";
import { useGetHeadQuartersQuery } from "../../shared/store/api/hqApi";
import { useCreatePOBMutation } from "../../shared/store/api/pobApi";
import { useAppSelector } from "../../shared/store/hooks";

const CreatePOBScreen = () => {
    const { userId, role, name } = useAppSelector((state) => state.auth);
  const { data: doctorsData, isLoading: loadingDoctors } =
    useGetDoctorChemistDashboardQuery({});
  const { data: employeesData, isLoading: loadingEmployees } =
    useGetEmployeesQuery({});
  const { data: productsData, isLoading: loadingProducts } =
    useGetProductsQuery();
  const { data: hqData, isLoading: loadingHq } = useGetHeadQuartersQuery({});
  const [createPOB, { isLoading: loadingCreatePOB }] = useCreatePOBMutation();

  const doctors = doctorsData?.data || [];
  const employees = employeesData?.data?.employees || [];
  const productsList = productsData || [];
  const hqs = hqData?.data || [];

  const [doctorId, setDoctorId] = useState("");
  const [hqId, setHqId] = useState("");

  const [contributors, setContributors] = useState([
    { employee: "", percentage: "" },
  ]);

  const [products, setProducts] = useState([
    { product: "", quantity: "", amount: "" },
  ]);

  // ---------- Contributor Logic ----------
  const addContributor = () =>
    setContributors([...contributors, { employee: "", percentage: "" }]);

  const removeContributor = (index: number) =>
    setContributors(contributors.filter((_, i) => i !== index));

  const handleContributorChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...contributors];
    updated[index][field as keyof (typeof updated)[0]] = value;
    setContributors(updated);
  };

  const totalPercentage = useMemo(
    () =>
      contributors.reduce((sum, c) => sum + (parseFloat(c.percentage) || 0), 0),
    [contributors],
  );

  // ---------- Product Logic ----------
  const addProduct = () =>
    setProducts([...products, { product: "", quantity: "", amount: "" }]);

  const removeProduct = (index: number) =>
    setProducts(products.filter((_, i) => i !== index));

  const handleProductChange = (index: number, field: string, value: string) => {
    const updated = [...products];
    updated[index][field as keyof (typeof updated)[0]] = value;
    setProducts(updated);
  };

  const totalAmount = useMemo(
    () =>
      products.reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const amt = parseFloat(item.amount) || 0;
        return sum + qty * amt;
      }, 0),
    [products],
  );

  // ---------- Submit ----------
  const handleSubmit = async () => {
    if (!doctorId) return Alert.alert("Select doctor");
    if (!hqId) return Alert.alert("Select HQ");
    if (totalPercentage >= 100)
      return Alert.alert("Contributor % must lesser than equal to 100");

    const payload = {
      doctorChemist: doctorId,
      hq: hqId,
      date: new Date(),
      pobContributors: contributors.map((c) => ({
        employee: c.employee,
        percentage: Number(c.percentage),
      })),
      products: products.map((p) => ({
        product: p.product,
        quantity: Number(p.quantity),
        amount: Number(p.amount),
      })),
      totalAmount,
      employeeModel:role=="admin"?"Admin":"Employee",
    };

    try {
        await createPOB(payload).unwrap();
        resetForm()
        ToastAndroid.show("POB Created Successfully", ToastAndroid.SHORT);
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    }
    };
    
    const resetForm = () => {
      setDoctorId("");
      setHqId("");
      setContributors([{ employee: "", percentage: "" }]);
      setProducts([{ product: "", quantity: "", amount: "" }]);
    }

  if (loadingDoctors || loadingEmployees || loadingProducts || loadingHq) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1,  }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Create POB</Text>

        {/* Doctor */}
        <View style={styles.card}>
          <Text style={styles.label}>Doctor</Text>
          <Dropdown
            style={styles.dropdown}
            data={doctors}
            search
            labelField="name"
            valueField="_id"
            placeholder="Select Doctor"
            value={doctorId}
            onChange={(item) => setDoctorId(item._id)}
          />
        </View>

        {/* HQ */}
        <View style={styles.card}>
          <Text style={styles.label}>Headquarter</Text>
          <Dropdown
            style={styles.dropdown}
            data={hqs}
            search
            labelField="name"
            valueField="_id"
            placeholder="Select HQ"
            value={hqId}
            onChange={(item) => setHqId(item._id)}
          />
        </View>

        {/* Contributors */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contributors</Text>

          {contributors.map((item, index) => (
            <View key={index} style={styles.row}>
              <Dropdown
                style={[styles.dropdown, { flex: 1 }]}
                data={employees}
                search
                labelField="name"
                valueField="_id"
                placeholder="Select Employee"
                value={item.employee}
                onChange={(selected) =>
                  handleContributorChange(index, "employee", selected._id)
                }
              />

              <TextInput
                placeholder="%"
                keyboardType="numeric"
                style={styles.percentInput}
                value={item.percentage}
                onChangeText={(text) =>
                  handleContributorChange(index, "percentage", text)
                }
              />

              {contributors.length > 1 && (
                <TouchableOpacity onPress={() => removeContributor(index)}>
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addBtn} onPress={addContributor}>
            <Ionicons name="add-circle-outline" size={18} color="#2563eb" />
            <Text style={styles.addText}>Add Contributor</Text>
          </TouchableOpacity>

          <Text style={styles.totalPercent}>Total %: {totalPercentage}</Text>
        </View>

        {/* Products */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Products</Text>

          {products.map((item, index) => (
            <View key={index} style={styles.row}>
              <Dropdown
                style={[styles.dropdown, { flex: 1 }]}
                data={productsList}
                search
                labelField="product_name"
                valueField="_id"
                placeholder="Select Product"
                value={item.product}
                onChange={(selected) =>
                  handleProductChange(index, "product", selected._id)
                }
              />

              <TextInput
                placeholder="Qty"
                keyboardType="numeric"
                style={styles.smallInput}
                value={item.quantity}
                onChangeText={(text) =>
                  handleProductChange(index, "quantity", text)
                }
              />

              <TextInput
                placeholder="Amt"
                keyboardType="numeric"
                style={styles.smallInput}
                value={item.amount}
                onChangeText={(text) =>
                  handleProductChange(index, "amount", text)
                }
              />

              {products.length > 1 && (
                <TouchableOpacity onPress={() => removeProduct(index)}>
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addBtn} onPress={addProduct}>
            <Ionicons name="add-circle-outline" size={18} color="#2563eb" />
            <Text style={styles.addText}>Add Product</Text>
          </TouchableOpacity>
        </View>

        {/* Total */}
        <View style={styles.totalCard}>
          <Text style={styles.totalText}>Total Amount: ₹ {totalAmount}</Text>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>
            {loadingCreatePOB ? "Submitting..." : "Confirm POB"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreatePOBScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  dropdown: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  smallInput: {
    width: 70,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 8,
  },
  percentInput: {
    width: 60,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 8,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addText: {
    marginLeft: 6,
    color: "#2563eb",
    fontWeight: "600",
  },
  totalCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#16a34a",
  },
  submitBtn: {
    backgroundColor: "#1e3a8a",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    
    marginBottom: 330,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
  },
  totalPercent: {
    marginTop: 10,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
