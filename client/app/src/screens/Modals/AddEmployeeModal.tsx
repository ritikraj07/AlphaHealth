import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useGetHeadQuartersQuery } from "../../shared/store/api/hqApi";
import { useCreateEmployeeMutation } from "../../shared/store/api/employeeApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";



// Define the props interface
interface AddEmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  
  managerId: string;
  managerModel: string
}

// Define types
interface EmployeeData {
  name: string;
  email: string;
  password: string;
  role: "employee" | "manager";
  hq: string; // id of headquarter
}

type RoleType = "employee" | "manager";

export default function AddEmployeeModal({
  visible,
  onClose,
  managerId,
  managerModel
}: AddEmployeeModalProps) {
  const { data: HQ, isLoading , error, refetch } = useGetHeadQuartersQuery({});
  const [createEmployee, { isLoading: isCreateEmployeeLoading }] =  useCreateEmployeeMutation();
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<RoleType>("employee");
  const [email, setEmail] = useState<string>("");
  const [headquarter, setHeadquarter] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const roles: { id: RoleType; label: string }[] = [
    { id: "employee", label: "Employee" },
    { id: "manager", label: "Manager" },
  ];

  // console.log("data==>", HQ?.data);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!headquarter) {
      newErrors.headquarter = "Headquarter is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const DEFAULT_PASSWORD = "initialPassword";


    const employeeData: EmployeeData = {
      name: name.trim(),
      role,
      email: email.trim(),
      hq: headquarter,
      password: DEFAULT_PASSWORD,
    };

    handleAddEmployee(employeeData);
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setRole("employee");
    setEmail("");
    setHeadquarter("");
    setErrors({});
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

   const handleAddEmployee = async  (employeeData: any)=> {
       console.log("New employee:", employeeData);
     // Add n API call to save the employee later when ReduxRTK is implemented
     
       try {
         let response = await createEmployee({
           name: employeeData.name,
           email: employeeData.email,
           password: employeeData.password,
           role: employeeData.role,
           hq: employeeData.hq,
           manager: managerId,
           managerModel: managerModel,
         }).unwrap();
         console.log("Response:", response);
         if (response.success) {
           ToastAndroid.show(response?.message, ToastAndroid.SHORT);
           handleClose();
         } else {
           ToastAndroid.show(response?.message, ToastAndroid.SHORT);
         }
       } catch (error) {
         let errorMessage = "Something went wrong";

         if ((error as FetchBaseQueryError)?.data) {
           const apiError = error as FetchBaseQueryError;

           const data = apiError.data as any;

           errorMessage =
             data?.message || data?.errors?.[0]?.message || "Request failed";
         } else if (error instanceof Error) {
           errorMessage = error.message;
         }

         ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
         console.error("Error adding employee:", error);
       }

        
     };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Add New Employee</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              Enter the details for the new employee
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Name Field */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.name && styles.inputError]}
                  placeholder="Enter full name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                />
                {errors.name ? (
                  <Text style={styles.errorText}>{errors.name}</Text>
                ) : null}
              </View>

              {/* Role Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Role <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.roleContainer}>
                  {roles.map((roleItem) => (
                    <TouchableOpacity
                      key={roleItem.id}
                      style={[
                        styles.roleButton,
                        role === roleItem.id && styles.roleButtonSelected,
                      ]}
                      onPress={() => setRole(roleItem.id)}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          role === roleItem.id && styles.roleTextSelected,
                        ]}
                      >
                        {roleItem.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Email Field */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Email <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.email && styles.inputError]}
                  placeholder="Enter email address"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                />
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              {/* Headquarter Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Headquarter <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.headquarterContainer}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#007AFF" />
                  ) : (
                    HQ?.data.map((hq: any) => (
                      <TouchableOpacity
                        key={hq._id}
                        style={[
                          styles.headquarterButton,
                          headquarter === hq._id &&
                            styles.headquarterButtonSelected,
                        ]}
                        onPress={() => {
                          setHeadquarter(hq._id);
                          if (errors.headquarter)
                            setErrors({ ...errors, headquarter: "" });
                        }}
                      >
                        <Text
                          style={[
                            styles.headquarterText,
                            headquarter === hq._id &&
                              styles.headquarterTextSelected,
                          ]}
                        >
                          {hq.name}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
                {errors.headquarter ? (
                  <Text style={styles.errorText}>{errors.headquarter}</Text>
                ) : null}
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isCreateEmployeeLoading && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isCreateEmployeeLoading || isLoading}
              >
                {isCreateEmployeeLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Add Employee</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                disabled={isCreateEmployeeLoading || isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  required: {
    color: "#FF3B30",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f8f8",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  disabledButton: {
    opacity: 0.7,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  roleButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  roleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  roleTextSelected: {
    color: "white",
  },
  headquarterContainer: {
    gap: 8,
  },
  headquarterButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f8f8f8",
  },
  headquarterButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  headquarterText: {
    fontSize: 14,
    color: "#666",
  },
  headquarterTextSelected: {
    color: "white",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});
