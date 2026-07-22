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
  Alert,
  ToastAndroid,
  Switch,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useApplyLeaveMutation } from "../../shared/store/api/leaveApi";

// ========== TYPES ==========
interface LeaveModalProps {
  visible: boolean;
  onClose: () => void;
}

type LeaveType =
  | "sick"
  | "casual"
  | "earned"
  | "public"
  | "maternity"
  | "paternity";
type HalfType = "first" | "second" | "";
type DateField = "start" | "end";

// ========== PLATFORM HELPER ==========
const showToast = (message: string, duration: number = ToastAndroid.SHORT) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, duration);
  } else {
    Alert.alert("", message);
  }
};

const showError = (title: string, message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    Alert.alert(title, message);
  }
};

// ========== LEAVE TYPE BUTTON ==========
interface LeaveTypeButtonProps {
  type: { id: LeaveType; label: string };
  selected: LeaveType;
  onSelect: (id: LeaveType) => void;
  disabled: boolean;
}

const LeaveTypeButton = ({
  type,
  selected,
  onSelect,
  disabled,
}: LeaveTypeButtonProps) => {
  const isSelected = selected === type.id;
  return (
    <TouchableOpacity
      style={[
        styles.leaveTypeButton,
        isSelected && styles.leaveTypeButtonSelected,
        disabled && styles.leaveTypeButtonDisabled,
      ]}
      onPress={() => onSelect(type.id)}
      disabled={disabled}
    >
      <Text
        style={[
          styles.leaveTypeText,
          isSelected && styles.leaveTypeTextSelected,
        ]}
      >
        {type.label}
      </Text>
    </TouchableOpacity>
  );
};

// ========== MAIN COMPONENT ==========
export default function LeaveModal({ visible, onClose }: LeaveModalProps) {
  // --- State ---
  const [leaveType, setLeaveType] = useState<LeaveType>("earned");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reason, setReason] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfType, setHalfType] = useState<HalfType>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState<DateField>("start");
  const [tempDate, setTempDate] = useState(new Date());

  const [applyLeave, { isLoading }] = useApplyLeaveMutation();

  // --- Constants ---
  const leaveTypes: { id: LeaveType; label: string }[] = [
    { id: "casual", label: "Casual" },
    { id: "sick", label: "Sick" },
    { id: "earned", label: "Earned" },
    { id: "maternity", label: "Maternity" },
    { id: "paternity", label: "Paternity" },
  ];

  // --- Helpers ---
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const toISO = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // --- Validation ---
  const validate = useCallback((): string | null => {
    if (!leaveType) {
      return "Please select a leave type.";
    }
    if (!startDate) {
      return "Please select a start date.";
    }
    if (!isHalfDay && !endDate) {
      return "Please select an end date.";
    }
    if (reason.trim().length === 0) {
      return "Please enter a reason for leave.";
    }
    if (isHalfDay && !halfType) {
      return "Please select a half-day slot.";
    }

    // --- Date rules ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    // 1. Cannot apply for past dates
    if (start < today) {
      return "Start date cannot be in the past.";
    }

    // 2. Casual leave cannot be on the same day
    if (leaveType === "casual" && isToday(startDate)) {
      return "Casual leave cannot be taken on the same day. Please select a future date.";
    }

    // 3. End date must be >= start date
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      if (end < start) {
        return "End date cannot be before start date.";
      }
    }

    return null;
  }, [leaveType, startDate, endDate, isHalfDay, halfType, reason]);

  // --- Handlers ---
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (currentDateField === "start") {
        setStartDate(selectedDate);
        // If end date is before new start, reset end
        if (endDate && selectedDate > endDate) {
          setEndDate(null);
        }
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const openDatePicker = (field: DateField) => {
    setCurrentDateField(field);
    const initialDate =
      field === "start"
        ? startDate || new Date()
        : endDate || startDate || new Date();
    setTempDate(initialDate);
    setShowDatePicker(true);
  };

  const resetForm = useCallback(() => {
    setLeaveType("earned");
    setStartDate(null);
    setEndDate(null);
    setReason("");
    setIsHalfDay(false);
    setHalfType("");
  }, []);

  // Reset when modal closes
  useEffect(() => {
    if (!visible) resetForm();
  }, [visible, resetForm]);

  // --- Submit ---
  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      showError("Validation Error", error);
      return;
    }

    try {
      await applyLeave({
        type: leaveType,
        startDate: toISO(startDate),
        endDate: isHalfDay ? toISO(startDate) : toISO(endDate),
        isHalfDay,
        halfType: halfType as "first" | "second",
        reason: reason.trim(),
      }).unwrap();

      showToast("Leave application submitted successfully.");
      resetForm();
      onClose();
    } catch (err: any) {
      console.error("Leave submission error:", err);
      const message =
        err?.data?.error ||
        err?.data?.message ||
        "Failed to apply leave. Please try again.";
      showError("Error", message);
    }
  };

  // --- Disable Casual if startDate is today ---
  const isCasualDisabled = (): boolean => {
    if (!startDate) return false;
    return leaveType === "casual" && isToday(startDate);
  };

  // --- Render ---
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
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
                    <LeaveTypeButton
                      key={type.id}
                      type={type}
                      selected={leaveType}
                      onSelect={setLeaveType}
                      disabled={
                        isLoading ||
                        (type.id === "casual" && isCasualDisabled())
                      }
                    />
                  ))}
                </View>
              </View>

              {/* Half Day Toggle */}
              <View style={styles.section}>
                <View style={styles.row}>
                  <Text style={styles.sectionTitle}>Half Day</Text>
                  <Switch
                    value={isHalfDay}
                    onValueChange={(val) => {
                      setIsHalfDay(val);
                      if (val) setEndDate(null);
                    }}
                    disabled={isLoading}
                  />
                </View>

                {isHalfDay && (
                  <View style={styles.halfInfo}>
                    <Text style={styles.halfDesc}>Select time slot:</Text>
                    <View style={styles.halfRow}>
                      {["first", "second"].map((slot) => (
                        <TouchableOpacity
                          key={slot}
                          style={[
                            styles.halfOption,
                            halfType === slot && styles.halfSelected,
                          ]}
                          onPress={() => setHalfType(slot as HalfType)}
                          disabled={isLoading}
                        >
                          <Text>
                            {slot === "first" ? "First Half" : "Second Half"}
                          </Text>
                          <Text style={styles.halfTime}>
                            {slot === "first"
                              ? "09:00 - 13:00"
                              : "13:00 - 17:00"}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              {/* Start Date */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Start Date</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => openDatePicker("start")}
                  disabled={isLoading}
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
              {!isHalfDay && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>End Date</Text>
                  <TouchableOpacity
                    style={[
                      styles.dateInput,
                      !startDate && styles.disabledInput,
                    ]}
                    onPress={() => startDate && openDatePicker("end")}
                    disabled={!startDate || isLoading}
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
              )}

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
                  editable={!isLoading}
                />
              </View>

              {/* Submit */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    Submit Application
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <Text style={styles.helperText}>
                Click "Submit Application" to submit your leave application.
              </Text>
            </ScrollView>

            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                minimumDate={
                  currentDateField === "start"
                    ? new Date()
                    : startDate || new Date()
                }
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ========== STYLES ==========
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
    shadowOffset: { width: 0, height: 2 },
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
  leaveTypeButtonDisabled: {
    opacity: 0.4,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 1,
  },
  halfInfo: {
    marginTop: 10,
    paddingLeft: 2,
  },
  halfDesc: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  halfRow: {
    flexDirection: "row",
    gap: 10,
  },
  halfOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  halfSelected: {
    backgroundColor: "#4B7BEC22",
    borderColor: "#4B7BEC",
  },
  halfTime: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
});
