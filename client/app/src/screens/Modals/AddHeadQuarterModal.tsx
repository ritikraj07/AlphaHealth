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
import { Ionicons } from "@expo/vector-icons";
import { useCreateHeadQuarterMutation, useGetHeadQuartersQuery } from "../../shared/store/api/hqApi";
import { useAppSelector } from "../../shared/store/hooks";

interface AddHeadQuarterModalProps {
  visible: boolean;
  onClose: () => void;
  onAddHQ: (hq: HeadQuarterData) => void;
}

interface HeadQuarterData {
  name: string;
  location: string;
}

export default function AddHeadQuarterModal({
  visible,
  onClose,
  onAddHQ,
}: AddHeadQuarterModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [createHQ, { isLoading: isLoadingCreateHQ }] = useCreateHeadQuarterMutation();
    const { role, userId, name: userName } = useAppSelector((state) => state.auth);
    const { data: HQData } = useGetHeadQuartersQuery({});
    
  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Headquarter name is required";
    }

    if (!location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async() => {
      if (!validateForm()) return;
      const existingHQs = HQData?.data || [];
    
      const trimmedName = name.trim();
      const trimmedLocation = location.trim();
      
       if (isHQAlreadyExists(trimmedName, trimmedLocation, existingHQs)) {
         ToastAndroid.show(
           "❌ Headquarter with same name and location already exists",
           ToastAndroid.LONG
         );
         return;
       };
      
      try {
        await createHQ({
          name: trimmedName,
          region: trimmedLocation,
          createdBy: {
            id: userId,
            name: userName,
            role: role,
          },
        }).unwrap();

        ToastAndroid.show(
          "✅ Headquarter added successfully",
          ToastAndroid.SHORT
          );

        resetForm();
        onClose();
      } catch (error: any) {
        // 🔴 SERVER-SIDE ERROR (FINAL SAFETY)
        ToastAndroid.show(
          error?.data?.message || "Failed to add headquarter",
          ToastAndroid.LONG
        );
      }


    
  };

  const resetForm = () => {
    setName("");
    setLocation("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
    };
    
    const isHQAlreadyExists = (
      name: string,
      location: string,
      existingHQs: any[]
    ) => {
      return existingHQs.some(
        (hq) =>
          hq.name.trim().toLowerCase() === name.trim().toLowerCase() &&
          hq.region.trim().toLowerCase() === location.trim().toLowerCase()
      );
    };


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Add New Headquarter</Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              Enter details for the new headquarter
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* HQ Name */}
              <View style={styles.section}>
                <Text style={styles.label}>
                  Headquarter Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="e.g. North HQ"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* Location */}
              <View style={styles.section}>
                <Text style={styles.label}>
                  Location <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.location && styles.inputError]}
                  placeholder="e.g. Delhi, India"
                  value={location}
                  onChangeText={(text) => {
                    setLocation(text);
                    if (errors.location) setErrors({ ...errors, location: "" });
                  }}
                />
                {errors.location && (
                  <Text style={styles.errorText}>{errors.location}</Text>
                )}
              </View>

              {/* Buttons */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoadingCreateHQ && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isLoadingCreateHQ}
              >
                {isLoadingCreateHQ ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Add Headquarter</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                disabled={isLoadingCreateHQ}
              >
                <Text style={styles.cancelText}>Cancel</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  required: {
    color: "#FF3B30",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 14,
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
  disabledButton: {
    opacity: 0.7,
  },

  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
});
