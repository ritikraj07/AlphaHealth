import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  useCreateProductMutation,
  CreateProductPayload,
} from "../../shared/store/api/productApi";

const AddProductScreen = () => {
  const navigation = useNavigation<any>();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const [form, setForm] = useState<CreateProductPayload>({
    product_name: "",
    brand: "",
    category: "",
    price: 0,
    quantity: 0,
    description: "",
    mrp: 0,
    ptr: 0,
    pts: 0,
    packSize: "",
    composition: "",
    isActive: true,
  });

  const handleChange = (key: keyof CreateProductPayload, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSubmit = async () => {
    // console.log("📤 Attempting to create product...");
    // console.log("DATA:", form);

    if (!form.product_name.trim()) {
      ToastAndroid.show("Product Name is required", ToastAndroid.SHORT);
      return;
    }

    try {
      await createProduct(form).unwrap();

      ToastAndroid.show("Product created successfully", ToastAndroid.SHORT);

      setForm({
        product_name: "",
        brand: "",
        category: "",
        price: 0,
        quantity: 0,
        description: "",
        mrp: 0,
        ptr: 0,
        pts: 0,
        packSize: "",
        composition: "",
        isActive: true,
      });

      navigation.goBack();
    } catch (error) {
      console.log("❌ Create Product Error:", error);
      ToastAndroid.show("Failed to create product", ToastAndroid.SHORT);
    }
  };

  const renderInput = (
    label: string,
    key: keyof CreateProductPayload,
    multiline = false,
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 80 }]}
        placeholder={label}
        value={String(form[key] ?? "")}
        onChangeText={(text) => handleChange(key, text)}
        multiline={multiline}
      />
    </View>
  );

  const renderNumberInput = (
    label: string,
    key: keyof CreateProductPayload,
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={label}
        keyboardType="numeric"
        value={String(form[key] ?? "")}
        onChangeText={(text) => handleChange(key, Number(text))}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Add New Product</Text>

          {renderInput("Product Name *", "product_name")}
          {renderInput("Brand", "brand")}
          {renderInput("Category", "category")}
          {renderInput("Pack Size", "packSize")}
          {renderInput("Composition", "composition")}
          {renderInput("Description", "description", true)}

          {renderNumberInput("MRP", "mrp")}
          {renderNumberInput("PTR", "ptr")}
          {renderNumberInput("PTS", "pts")}
          {renderNumberInput("Selling Price", "price")}
          {renderNumberInput("Quantity", "quantity")}
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#2e86de",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
