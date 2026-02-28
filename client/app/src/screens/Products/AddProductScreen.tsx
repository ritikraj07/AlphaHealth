import React from "react";
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
  ToastAndroid,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import {
  useCreateProductMutation,
  CreateProductPayload,
} from "../../shared/store/api/productApi";

const AddProductScreen = () => {
  const navigation = useNavigation<any>();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const { control, handleSubmit, reset } = useForm<CreateProductPayload>({
    defaultValues: {
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
    },
  });

  const onSubmit = async (data: CreateProductPayload) => {
    try {
      await createProduct(data).unwrap();
      ToastAndroid.show("Product created successfully", ToastAndroid.SHORT);
      reset();
      navigation.goBack();
    } catch (error) {
      console.error("Create Product Error:", error);
      ToastAndroid.show("Failed to create product", ToastAndroid.SHORT);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, multiline && { height: 80 }]}
            placeholder={label}
            value={value}
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
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder={label}
            keyboardType="numeric"
            value={String(value)}
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
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Add New Product</Text>

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
    marginBottom:20
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
