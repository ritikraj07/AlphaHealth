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
  Platform,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useApplyLeaveMutation } from "../../shared/store/api/leaveApi";


// Define the props interface
interface LeaveModalProps {
  visible: boolean;
  onClose: () => void;
}

type DateField = "start" | "end";

export default function LeaveModal({ visible, onClose }: LeaveModalProps) {
 
  const [leaveType, setLeaveType] = useState<string>("casual");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reason, setReason] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [currentDateField, setCurrentDateField] = useState<DateField>("start");
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [applyLeave] = useApplyLeaveMutation();
  
 

  const leaveTypes = [
    { id: "casual", label: "Casual" },
    { id: "sick", label: "Sick" },
    { id: "earned", label: "Earned" },
    { id: "maternity", label: "Maternity" },
    { id: "paternity", label: "Paternity" },
  ];

  // Format date to dd-mm-yyyy
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Get minimum date for end date (start date or today)
  const getMinEndDate = (): Date => {
    if (startDate) {
      return new Date(startDate);
    }
    return new Date();
  };

  // Open date picker
  const openDatePicker = (field: DateField) => {
    setCurrentDateField(field);

    // Set initial date for picker
    if (field === "start") {
      setTempDate(startDate || new Date());
    } else {
      setTempDate(endDate || getMinEndDate());
    }

    setShowDatePicker(true);
  };

  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      if (currentDateField === "start") {
        setStartDate(selectedDate);
        // If end date is before new start date, reset end date
        if (endDate && selectedDate > endDate) {
          setEndDate(null);
        }
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  // Validate dates
  const validateDates = (): boolean => {
    if (!startDate) {
      alert("Please select a start date");
      return false;
    }

    if (!endDate) {
      alert("Please select an end date");
      return false;
    }

    if (endDate < startDate) {
      alert("End date cannot be before start date");
      return false;
    }

    // Check if start date is not before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    if (start < today) {
      alert("Start date cannot be before today");
      return false;
    }

    return true;
  };

  // Clear form
  const clearForm = () => {
    setLeaveType("casual");
    setStartDate(null);
    setEndDate(null);
    setReason("");
  };

 const handleSubmit = async () => {
   if (!validateDates()) {
     return;
   }

   if (!reason.trim()) {
     alert("Please enter a reason for leave");
     return;
   }

   try {
     // Format dates for backend - MUST be ISO string or YYYY-MM-DD
     const formatForBackend = (date: Date | null): string => {
       if (!date) return "";
       // Option 1: ISO string (recommended)
       return date.toISOString();
       // Option 2: YYYY-MM-DD format
       // const year = date.getFullYear();
       // const month = (date.getMonth() + 1).toString().padStart(2, "0");
       // const day = date.getDate().toString().padStart(2, "0");
       // return `${year}-${month}-${day}`;
     };

     // Ensure leaveType matches backend enum
     const validLeaveType = leaveType as
       | "sick"
       | "casual"
       | "earned"
       | "public"
       | "maternity"
       | "paternity";

    //  console.log("Sending leave application:", {
    //    type: validLeaveType,
    //    startDate: formatForBackend(startDate),
    //    endDate: formatForBackend(endDate),
    //    reason,
    //  });

     const response = await applyLeave({
       type: validLeaveType,
       startDate: formatForBackend(startDate),
       endDate: formatForBackend(endDate),
       reason,
     }).unwrap();

     clearForm();

     ToastAndroid.show(response.message, ToastAndroid.SHORT);
   } catch (error: any) {
     console.error("Error applying leave:", error);

     // Parse backend error
     let errorMessage = "Failed to apply leave";

     if (error?.data) {
       if (error.data.error) {
         errorMessage = error.data.error;
       } else if (error.data.message) {
         errorMessage = error.data.message;
       }
     }

     ToastAndroid.show(errorMessage, ToastAndroid.LONG);
   } finally {
     onClose();
   }
 };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Apply for Leave</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              Fill in the details for your leave application
            </Text>

            <ScrollView             
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Leave Type */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Type</Text>
                <View style={styles.leaveTypeContainer}>
                  {leaveTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.leaveTypeButton,
                        leaveType === type.id && styles.leaveTypeButtonSelected,
                      ]}
                      onPress={() => setLeaveType(type.id)}
                    >
                      <Text
                        style={[
                          styles.leaveTypeText,
                          leaveType === type.id && styles.leaveTypeTextSelected,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Start Date */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Start Date</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => openDatePicker("start")}
                >
                  <Text
                    style={startDate ? styles.dateText : styles.placeholderText}
                  >
                    {startDate ? formatDate(startDate) : "dd-mm-yyyy"}
                  </Text>
                  <Feather name="calendar" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.dateHint}>Cannot be before today</Text>
              </View>

              {/* End Date */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>End Date</Text>
                <TouchableOpacity
                  style={[styles.dateInput, !startDate && styles.disabledInput]}
                  onPress={() => startDate && openDatePicker("end")}
                  disabled={!startDate}
                >
                  <Text
                    style={[
                      endDate ? styles.dateText : styles.placeholderText,
                      !startDate && styles.disabledText,
                    ]}
                  >
                    {endDate ? formatDate(endDate) : "dd-mm-yyyy"}
                  </Text>
                  <Feather
                    name="calendar"
                    size={20}
                    color={!startDate ? "#ccc" : "#666"}
                  />
                </TouchableOpacity>
                <Text style={styles.dateHint}>
                  {startDate
                    ? `Must be on or after ${formatDate(startDate)}`
                    : "Select start date first"}
                </Text>
              </View>

              {/* Reason */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reason</Text>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Enter reason for leave"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={reason}
                  onChangeText={setReason}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit Application</Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              {/* Helper Text */}
              <Text style={styles.helperText}>
                Click "Submit Application" to submit your leave application.
              </Text>
            </ScrollView>

            {/* Date Picker Modal */}
            {showDatePicker && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                minimumDate={
                  currentDateField === "start" ? new Date() : getMinEndDate()
                }
              />
            )}
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
  leaveTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  leaveTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f8f8f8",
  },
  leaveTypeButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  leaveTypeText: {
    fontSize: 14,
    color: "#666",
  },
  leaveTypeTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f8f8",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    borderColor: "#eee",
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  disabledText: {
    color: "#ccc",
  },
  dateHint: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f8f8",
    fontSize: 16,
    minHeight: 100,
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
  helperText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    fontStyle: "italic",
  },
});
