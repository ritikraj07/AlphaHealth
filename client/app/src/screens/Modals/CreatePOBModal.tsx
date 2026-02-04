import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";



type EmployeeOption = {
  label: string;
  value: string;
};


export default function CreatePOBModal({ visible, onClose }: {
  visible: boolean;
  onClose: () => void;}) {
  // TODO: Replace these with RTK Query data later
  const products = [
    { label: "Calpol 650", value: "p1" },
    { label: "Azithro", value: "p2" },
  ];

  const doctors = [
    { label: "Dr. Sharma", value: "d1" },
    { label: "Chemist Raj", value: "c1" },
  ];

  const employees = [
    { label: "Ritik", value: "e1" },
      { label: "Manish", value: "e2" },
      { label: "Rohit", value: "e3" },
      { label: "Ravi", value: "e4" },
      { label: "Rahul", value: "e5" },
  ];

  // Local States
  const [product, setProduct] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [jointEmployees, setJointEmployees] = useState<string[]>([]);

  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    const payload = {
      product,
      doctor,
      jointEmployees,
      quantity: Number(quantity),
      amount: Number(amount),
    };

    console.log("POB Submitted:", payload);

    // TODO: call RTK mutation here
    // createPOB(payload).unwrap()

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.heading}>Create POB</Text>

          <ScrollView>
            <Text style={styles.label}>Product Name</Text>
            <Dropdown
              style={styles.dropdown}
              data={products}
              labelField="label"
              valueField="value"
              placeholder="Select Product"
              value={product}
              onChange={(item) => setProduct(item.value)}
            />

            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter Quantity"
              value={quantity}
              onChangeText={setQuantity}
            />

            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter Amount"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.label}>Doctor / Chemist</Text>
            <Dropdown
              style={styles.dropdown}
              data={doctors}
              labelField="label"
              valueField="value"
              placeholder="Select Doctor / Chemist"
              value={doctor}
              onChange={(item) => setDoctor(item.value)}
            />

            <Text style={styles.label}>Jointly Done By</Text>

            <MultiSelect
              style={styles.multiContainer}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              inputSearchStyle={styles.searchInput}
              data={employees}
              labelField="label"
              valueField="value"
              placeholder="Select employees..."
              value={jointEmployees}
              onChange={setJointEmployees}
              search
              maxHeight={200}
              activeColor="#1e7de963" // background when an item is selected (in list)
              selectedStyle={{
                backgroundColor: "#E6F1FF",
                borderRadius: 6,
              }}
            />
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
              <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: "85%",
    padding: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 45,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    height: 45,
    paddingHorizontal: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginRight: 8,
    alignItems: "center",
  },
  btnSubmit: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  multiContainer: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fafafa",
    minHeight: 48,
  },
  placeholder: {
    fontSize: 14,
    color: "#8b8b8b",
  },
  selectedText: {
    fontSize: 13,
    color: "#006cfa",
    fontWeight: "600",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#E6F1FF",
    borderWidth: 1,
    borderColor: "#B5D5FF",
    marginRight: 6,
    marginBottom: 6,
  },

  searchInput: {
    height: 40,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
});
