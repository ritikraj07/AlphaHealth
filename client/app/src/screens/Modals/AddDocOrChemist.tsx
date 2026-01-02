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
} from "react-native";
import React, { useState } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useCreateDoctorChemistMutation } from "../../shared/store/api/doctorChemistApi";
import { useAppSelector } from "../../shared/store/hooks";


// Define the props interface
interface AddDoctorChemistModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: DoctorChemistData) => void;
  headquarters: Headquarter[]; // Array of HQ options from parent
}

// Define types
interface DoctorChemistData {
  name: string;
  type: "doctor" | "chemist";
  specialization: string;
  location: string;
  hq: string;
}

interface Headquarter {
  _id: string;
  name: string;
}

type ProfessionalType = "doctor" | "chemist";

export default function AddDoctorChemistModal({
  visible,
  onClose,
  onAdd,
  headquarters,
}: AddDoctorChemistModalProps) {

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [type, setType] = useState<"doctor" | "chemist">("doctor");
  const [specialization, setSpecialization] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [hq, setHq] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
const [  createDoctorChemist,  {
    isLoading: isLoadingCreateDocChem,
    isError: isErrorCreateDocChem,
    error: errorCreateDocChem,
  },
  ] = useCreateDoctorChemistMutation();
  const {userId, role, token, name: userName} = useAppSelector((state) => state.auth);
  const professionalTypes: { id: ProfessionalType; label: string }[] = [
    { id: "doctor", label: "Doctor" },
    { id: "chemist", label: "Chemist" },
  ];

  // Specializations for doctors (you can expand this list)
  const specializations = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Gynecology",
    "General Medicine",
    "Dentistry",
    "Psychiatry",
    "Oncology",
    "Other",
  ];

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";    
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email";
    }


    if (!location.trim()) {
      newErrors.location = "Location is required";
    } else if (!(location.length > 3)) {
      newErrors.location = "Please enter a valid location";
    }

    if (!hq) {
      newErrors.hq = "Headquarter is required";
    }

    // Specialization is required only for doctors
    if (type === "doctor" && !specialization.trim()) {
      newErrors.specialization = "Specialization is required for doctors";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async() => {
    if (!validateForm()) {
      return;
    }
    
    

     const CreatedBy = {
       id: userId,
       model: role === "admin" ? "Admin" : "Employee",
       role: role,
     };
    const formData = {
      name: name.trim(),
      type,
      specialization: type === "doctor" ? specialization: "other",
      location: location.trim(),
      hq,
      addedBy: CreatedBy,
      email: email.trim(),
    };
    


    // console.log("Form Data:", formData);
   

    try {
      const response = await createDoctorChemist(formData).unwrap();

      if (response.success) {
        ToastAndroid.show(response?.message, ToastAndroid.SHORT);

        handleClose();
      } else {
        ToastAndroid.show(response?.message, ToastAndroid.SHORT);
      }
    } catch (error: any) {
      console.error("Error creating doctor/chemist:", error);
      const msg =
        error?.data?.message || error?.data?.message || "Something went wrong";
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
   

    
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setType("doctor");
    setSpecialization("");
    setLocation("");
    setHq("");
    setErrors({});
    setEmail("");
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle type change
  const handleTypeChange = (newType: ProfessionalType) => {
    setType(newType);
    // Clear specialization when switching to chemist
    if (newType === "chemist") {
      setSpecialization("");
      setEmail("");
      if (errors.specialization) {
        setErrors({ ...errors, specialization: "" });
      }
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
              <Text style={styles.title}>Add New Professional</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              Enter details for {type === "doctor" ? "doctor" : "chemist"}
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Professional Type Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Type <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.typeContainer}>
                  {professionalTypes.map((typeItem) => (
                    <TouchableOpacity
                      key={typeItem.id}
                      style={[
                        styles.typeButton,
                        type === typeItem.id && styles.typeButtonSelected,
                      ]}
                      onPress={() => handleTypeChange(typeItem.id)}
                    >
                      <Text
                        style={[
                          styles.typeText,
                          type === typeItem.id && styles.typeTextSelected,
                        ]}
                      >
                        {typeItem.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Name Field */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.name && styles.inputError]}
                  placeholder={`Enter ${type} name`}
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

              {/* email Field */}

              <View>
                <Text style={styles.sectionTitle}>
                  Email <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.email && styles.inputError]}
                  placeholder={`Enter ${type} email`}
                  placeholderTextColor="#999"
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

              {/* Specialization Field (Only for Doctors) */}
              {type === "doctor" && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Specialization <Text style={styles.required}>*</Text>
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.specializationScroll}
                  >
                    <View style={styles.specializationContainer}>
                      {specializations.map((spec) => (
                        <TouchableOpacity
                          key={spec}
                          style={[
                            styles.specializationButton,
                            specialization === spec &&
                              styles.specializationButtonSelected,
                          ]}
                          onPress={() => {
                            setSpecialization(spec);
                            if (errors.specialization)
                              setErrors({ ...errors, specialization: "" });
                          }}
                        >
                          <Text
                            style={[
                              styles.specializationText,
                              specialization === spec &&
                                styles.specializationTextSelected,
                            ]}
                          >
                            {spec}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                  {errors.specialization ? (
                    <Text style={styles.errorText}>
                      {errors.specialization}
                    </Text>
                  ) : null}
                </View>
              )}

              {/* Location Field */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Location <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    errors.location && styles.inputError,
                  ]}
                  placeholder="Enter location/address"
                  placeholderTextColor="#999"
                  value={location}
                  onChangeText={(text) => {
                    setLocation(text);
                    if (errors.location) setErrors({ ...errors, location: "" });
                  }}
                />
                {errors.location ? (
                  <Text style={styles.errorText}>{errors.location}</Text>
                ) : null}
              </View>

              {/* Headquarter Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Headquarter <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.hqContainer}>
                  {headquarters.map((hqItem) => (
                    <TouchableOpacity
                      key={hqItem._id}
                      style={[
                        styles.hqButton,
                        hq === hqItem._id && styles.hqButtonSelected,
                      ]}
                      onPress={() => {
                        setHq(hqItem._id);
                        if (errors.hq) setErrors({ ...errors, hq: "" });
                      }}
                    >
                      <Text
                        style={[
                          styles.hqText,
                          hq === hqItem._id && styles.hqTextSelected,
                        ]}
                      >
                        {hqItem.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.hq ? (
                  <Text style={styles.errorText}>{errors.hq}</Text>
                ) : null}
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  Add {type === "doctor" ? "Doctor" : "Chemist"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
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
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  typeButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  typeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  typeTextSelected: {
    color: "white",
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
  specializationScroll: {
    marginHorizontal: -5,
  },
  specializationContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 5,
  },
  specializationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f8f8f8",
  },
  specializationButtonSelected: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  specializationText: {
    fontSize: 14,
    color: "#666",
  },
  specializationTextSelected: {
    color: "white",
    fontWeight: "500",
  },
  hqContainer: {
    gap: 8,
  },
  hqButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f8f8f8",
  },
  hqButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  hqText: {
    fontSize: 14,
    color: "#666",
  },
  hqTextSelected: {
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
