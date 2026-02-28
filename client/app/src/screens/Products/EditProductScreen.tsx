import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  useUpdateProductMutation,
  UpdateProductPayload,
  IProduct,
} from "../../shared/store/api/productApi";


const EditProductScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const product: IProduct = route.params.product;

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const { control, handleSubmit, reset } = useForm<UpdateProductPayload>();

  // 🔹 Prefill form
  useEffect(() => {
    if (product) {
      reset({
        product_name: product.product_name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
        mrp: product.mrp,
        ptr: product.ptr,
        pts: product.pts,
        packSize: product.packSize,
        composition: product.composition,
        isActive: product.isActive,
      });
    }
  }, [product]);

  const onSubmit = async (data: UpdateProductPayload) => {
    try {
      await updateProduct({ id: product._id, data }).unwrap();
      Alert.alert("Success", "Product updated successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update product");
    }
    };
    
    const renderInput = (
      label: string,
      name: any,
      control: any,
      multiline = false,
    ) => (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, multiline && { height: 80 }]}
              placeholder={label}
              value={value ?? ""}
              onChangeText={onChange}
              multiline={multiline}
            />
          )}
        />
      </View>
    );

    const renderNumberInput = (label: string, name: any, control: any) => (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder={label}
              keyboardType="numeric"
              value={value !== undefined ? String(value) : ""}
              onChangeText={(text) => onChange(Number(text))}
            />
          )}
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
        >
          <Text style={styles.title}>Edit Product</Text>

          {renderInput("Product Name", "product_name", control)}
          {renderInput("Brand", "brand", control)}
          {renderInput("Category", "category", control)}
          {renderInput("Pack Size", "packSize", control)}
          {renderInput("Composition", "composition", control)}
          {renderInput("Description", "description", control, true)}

          {renderNumberInput("MRP", "mrp", control)}
          {renderNumberInput("PTR", "ptr", control)}
          {renderNumberInput("PTS", "pts", control)}
          {renderNumberInput("Selling Price", "price", control)}
          {renderNumberInput("Quantity", "quantity", control)}
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditProductScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 16,
  },
  title: {
    fontSize: 20,
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