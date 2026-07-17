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
import { Dropdown } from "react-native-element-dropdown";



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
  email?: string;
  phoneNo?: string;
  frequencyOfVisit?: string;
  potential?: string;
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
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [frequencyOfVisit, setFrequencyOfVisit] = useState<string>("");
  const [potential, setPotential] = useState<string>("medium");

  const [
    createDoctorChemist,
    {
      isLoading: isLoadingCreateDocChem,
      isError: isErrorCreateDocChem,
      error: errorCreateDocChem,
    },
  ] = useCreateDoctorChemistMutation();
  const {
    userId,
    role,
    token,
    name: userName,
  } = useAppSelector((state) => state.auth);
  const professionalTypes: { id: ProfessionalType; label: string }[] = [
    { id: "doctor", label: "Doctor" },
    { id: "chemist", label: "Chemist" },
  ];

  // Specializations for doctors (you can expand this list)
  const specializations = [
    { label: "Cardiology", value: "Cardiology" },
    { label: "Dermatology", value: "Dermatology" },
    { label: "Neurology", value: "Neurology" },
    { label: "Pediatrics", value: "Pediatrics" },
    { label: "Orthopedics", value: "Orthopedics" },
    { label: "Gynecology", value: "Gynecology" },
    { label: "General Medicine", value: "General Medicine" },
    { label: "Dentistry", value: "Dentistry" },
    { label: "Psychiatry", value: "Psychiatry" },
    { label: "Oncology", value: "Oncology" },
    { label: "ENT (Otolaryngology)", value: "ENT" },
    { label: "Gastroenterology", value: "Gastroenterology" },
    { label: "Urology", value: "Urology" },
    { label: "Nephrology", value: "Nephrology" },
    { label: "Endocrinology", value: "Endocrinology" },
    { label: "Rheumatology", value: "Rheumatology" },
    { label: "Pulmonology", value: "Pulmonology" },
    { label: "Hematology", value: "Hematology" },
    { label: "Radiology", value: "Radiology" },
    { label: "Pathology", value: "Pathology" },
    { label: "Plastic Surgery", value: "Plastic Surgery" },
    { label: "Vascular Surgery", value: "Vascular Surgery" },
    { label: "Neurosurgery", value: "Neurosurgery" },
    { label: "Cardiothoracic Surgery", value: "Cardiothoracic Surgery" },
    { label: "Critical Care", value: "Critical Care" },
    { label: "Infectious Diseases", value: "Infectious Diseases" },
    { label: "Sports Medicine", value: "Sports Medicine" },
    { label: "Pain Medicine", value: "Pain Medicine" },
    { label: "Emergency Medicine", value: "Emergency Medicine" },
    { label: "Anesthesiology", value: "Anesthesiology" },
    { label: "Nuclear Medicine", value: "Nuclear Medicine" },
    { label: "Palliative Care", value: "Palliative Care" },
    { label: "Other", value: "Other" },
  ];

  const potentialOptions = [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ]


  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!type) {
      newErrors.type = "Type is required";
    }
    

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    // if (!email.trim()) {
    //   newErrors.email = "Email is required";
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    //   newErrors.email = "Please enter a valid email";
    // }

    // console.log("142");

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

    
    // if (!phoneNo) {
    //   newErrors.phoneNo = "Phone number is required";
    // }

    

    if (phoneNo.length > 1 && phoneNo.length != 10) {
      newErrors.phoneNo = "Please enter a valid phone number";
    }

    if (!frequencyOfVisit) {
      newErrors.frequencyOfVisit = "Frequency of visit is required";
    }
    // console.log("167");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    
    if (!validateForm()) {
      ToastAndroid.show("Please fill in all required fields", ToastAndroid.SHORT);
      return;
    }

    


    const CreatedBy = {
      id: userId,
      model: role === "admin" ? "Admin" : "Employee",
      role: role,
    };
    const ApprovedBy = {
      id: userId,
      model: "Admin",
      role: role,
    }
    const formData = {
      name: name.trim(),
      type,
      specialization: type === "doctor" ? specialization : "other",
      location: location.trim(),
      hq,
      addedBy: CreatedBy,
      frequency: frequencyOfVisit,
      approvedBy: role === "admin" ? ApprovedBy : {},
      potential,
      ...(email.trim().length > 4 && {
        email: email.trim(),
      }),

      ...(phoneNo.length === 10 && {
        phone: phoneNo,
      }),
    };


    // console.log(formData);


    

    try {
      const response = await createDoctorChemist(formData).unwrap();
      // console.log("Response:", response);

      if (response.success) {
        ToastAndroid.show(response?.message, ToastAndroid.SHORT);

        handleClose();
      } else {
        
        ToastAndroid.show(response?.message, ToastAndroid.SHORT);
      }
    } catch (error: any) {
      console.error("Error creating doctor/chemist:", error);
      console.log(error.data);
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
    setPhoneNo("");
    setFrequencyOfVisit("");
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

              {/* specialization */}
              {errors.specialization ? (
                <Text style={styles.errorText}>{errors.specialization}</Text>
              ) : null}
              {type == "doctor" && (
                <Dropdown
                  data={specializations}
                  search
                  searchPlaceholder="Search Specialization type..."
                  labelField="label"
                  valueField="value"
                  placeholder="Select Specialization Type"
                  value={specialization}
                  onChange={(item) => setSpecialization(item.value)}
                  style={[styles.dropdown, styles.section]}
                  inputSearchStyle={styles.dropdownInput}
                  selectedTextStyle={styles.dropdownSelectedText}
                />
              )}

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

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Email 
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

              {/* phone  */}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Phone
                </Text>
                <TextInput
                  style={[styles.textInput, errors.phone && styles.inputError]}
                  placeholder={`Enter ${type} phone`}
                  placeholderTextColor="#999"
                  value={phoneNo}
                  maxLength={10}
                  onChangeText={(text) => {
                    setPhoneNo(text);
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  keyboardType="phone-pad"
                />
                {errors.phoneNo ? (
                  <Text style={styles.errorText}>{errors.phoneNo}</Text>
                ) : null}
              </View>

              {/* frequency of visit */}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Frequency of Visit <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.phone && styles.inputError]}
                  placeholder={`Enter Frequency of visit`}
                  placeholderTextColor="#999"
                  value={frequencyOfVisit}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, "");
                    setFrequencyOfVisit(cleaned);

                    const num = Number(cleaned);

                    if (cleaned && num <= 0) {
                      setErrors({
                        ...errors,
                        frequencyOfVisit: "Must be greater than 0",
                      });
                    } else {
                      setErrors({ ...errors, frequencyOfVisit: "" });
                    }
                  }}
                  keyboardType="numeric"
                />
                {errors.frequencyOfVisit ? (
                  <Text style={styles.errorText}>
                    {errors.frequencyOfVisit}
                  </Text>
                ) : null}
              </View>

              {/* Potential */}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Potential <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.potentialContainer}>
                  {potentialOptions.map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      style={[
                        styles.potentialButton,
                        potential === option.value &&
                          styles.potentialButtonSelected,
                      ]}
                      onPress={() => setPotential(option.value)}
                    >
                      <Text
                        style={[
                          styles.potentialText,
                          potential === option.value &&
                            styles.potentialTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

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

                <Dropdown
                  data={
                    headquarters?.map((hq: { name: any; _id: any }) => ({
                      label: hq.name,
                      value: hq._id,
                    })) ?? []
                  }
                  search
                  searchPlaceholder="Search HQ..."
                  labelField="label"
                  valueField="value"
                  placeholder="Select Headquarter"
                  value={hq}
                  onChange={(item) => {
                    if (errors.hq) setErrors({ ...errors, hq: "" });
                    console.log(item);
                    setHq(item.value);
                  }}
                  style={styles.dropdown}
                />

                {errors.headquarter && (
                  <Text style={styles.errorText}>{errors.headquarter}</Text>
                )}
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
  dropdown: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f8f8f8", // solid white for clarity
    minHeight: 48,
  },

  dropdownInput: {
    fontSize: 16,
    color: "#333", // dark for search input
  },

  dropdownSelectedText: {
    fontSize: 16,
    color: "#222", // dark readable text
  },

  potentialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  potentialButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    width: "30%",
    borderBlockColor: "#007AFF",
    borderWidth: 1,
  },
  potentialButtonSelected: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    width: "30%",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 0
  },
  potentialText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  potentialTextSelected: {
    color: "white",
  },
});
