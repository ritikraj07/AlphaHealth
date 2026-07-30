import { useGetEmployeesQuery } from "@/app/src/shared/store/api/employeeApi";
import { useGetHeadQuartersQuery } from "@/app/src/shared/store/api/hqApi";
import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
// Status options
const STATUS = [
  { label: "All", value: "" },
  { label: "Present", value: "present" },
  { label: "Absent", value: "absent" },
  { label: "Leave", value: "leave" },
  { label: "Holiday", value: "holiday" },
];

// Role options (only for admin)
const ROLES = [
  { label: "All", value: "" },
  { label: "Employee", value: "employee" },
  { label: "Manager", value: "manager" },
];

interface FilterProps {
  mode: "employee" | "manager" | "admin";
  filters: {
    status: string;
    employeeId: string;
    role: string;
    hq: string;
    startDate: string;
    endDate: string;
  };
  onChange: (updates: Partial<FilterProps["filters"]>) => void;
}

const AttendanceFilters = ({ mode, filters, onChange }: FilterProps) => {
    const [expanded, setExpanded] = useState(true); // start expanded for better UX
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerType, setPickerType] = useState<"startDate" | "endDate">(
      "startDate",
    );

  // Fetch employees and HQ
  const {
    data: employeesData,
    isLoading: isEmpLoading,
    isFetching: isEmpFetching,
  } = useGetEmployeesQuery({});
  const {
    data: hqData,
    isLoading: isHQLoading,
    isFetching: isHQFetching,
  } = useGetHeadQuartersQuery({});

  // Transform employees: map _id → value, name → label
  const employeeOptions = useMemo(() => {
    const employees = employeesData?.data?.employees || [];
    return employees.map((emp: any) => ({
      label: emp.name || emp.fullName || "Unnamed",
      value: emp._id,
    }));
  }, [employeesData]);

  // Transform HQ: map _id → value, name → label
  const hqOptions = useMemo(() => {
    const headquarters = hqData?.data || [];
    return headquarters.map((hq: any) => ({
      label: hq.name || "Unnamed HQ",
      value: hq._id,
    }));
  }, [hqData]);

  const isLoading =
    isEmpLoading || isHQLoading || isEmpFetching || isHQFetching;

  // Generic update handler
  const update = useCallback(
    (key: string, value: any) => {
      onChange({ [key]: value });
    },
    [onChange],
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    onChange({
      status: "",
      employeeId: "",
      role: "",
      hq: "",
      startDate: "",
      endDate: "",
    });
  }, [onChange]);
    
    const openDatePicker = (type: "startDate" | "endDate") => {
      setPickerType(type);
      setShowDatePicker(true);
    };

    const renderDatePicker = (
      label: string,
      value: string,
      key: "startDate" | "endDate",
    ) => (
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => openDatePicker(key)}
      >
        <Text style={[styles.dateText, !value && styles.placeholderText]}>
          {value ? new Date(value).toLocaleDateString() : label}
        </Text>
      </TouchableOpacity>
    );

  

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Filters</Text>
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="#2563EB"
              style={styles.loader}
            />
          )}
        </View>
        <Text style={styles.expand}>{expanded ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {expanded && (
        <>
          {/* Status chips */}
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.chips}>
            {STATUS.map((item) => {
              const active = filters.status === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.chip, active && styles.activeChip]}
                  onPress={() => update("status", item.value)}
                >
                  <Text
                    style={[styles.chipText, active && styles.activeChipText]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Employee dropdown – only for admin */}
          {mode === "admin" && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Employee</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderText}
                selectedTextStyle={styles.selectedText}
                data={employeeOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Employee"
                value={filters.employeeId}
                onChange={(item) => update("employeeId", item.value)}
                search
                searchPlaceholder="Search employee..."
                disable={isLoading}
                maxHeight={200}
              />
            </View>
          )}

          {/* HQ dropdown – only for admin */}
          {mode === "admin" && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Head Quarter</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderText}
                selectedTextStyle={styles.selectedText}
                data={hqOptions}
                labelField="label"
                valueField="value"
                placeholder="Select HQ"
                value={filters.hq}
                onChange={(item) => update("hq", item.value)}
                search
                searchPlaceholder="Search HQ..."
                disable={isLoading}
                maxHeight={200}
              />
            </View>
          )}

          {/* Role dropdown – only for admin */}
          {mode === "admin" && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Role</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderText}
                selectedTextStyle={styles.selectedText}
                data={ROLES}
                labelField="label"
                valueField="value"
                placeholder="Select Role"
                value={filters.role}
                onChange={(item) => update("role", item.value)}
                disable={isLoading}
                maxHeight={200}
              />
            </View>
          )}

          {/* Date pickers – in a row */}
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.label}>Start Date</Text>
              {renderDatePicker(
                "Select Start Date",
                filters.startDate,
                "startDate",
              )}
            </View>
            <View style={styles.dateField}>
              <Text style={styles.label}>End Date</Text>
              {renderDatePicker("Select End Date", filters.endDate, "endDate")}
            </View>
          </View>

          {/* Reset button */}
          <TouchableOpacity style={styles.reset} onPress={resetFilters}>
            <Text style={styles.resetText}>Reset all filters</Text>
          </TouchableOpacity>
        </>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={
            filters[pickerType] ? new Date(filters[pickerType]) : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);

            if (selectedDate) {
              update(pickerType, selectedDate.toISOString().split("T")[0]);
            }
          }}
        />
      )}
    </View>
  );
};

export default AttendanceFilters;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
        elevation: 3,
       
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  loader: {
    marginLeft: 6,
  },
  expand: {
    fontSize: 18,
    color: "#2563EB",
    fontWeight: "600",
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 14,
    color: "#475569",
    letterSpacing: 0.3,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    marginRight: 10,
    marginBottom: 10,
  },
  activeChip: {
    backgroundColor: "#2563EB",
  },
  chipText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 13,
  },
  activeChipText: {
    color: "#fff",
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 4,
    marginLeft: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: "#F8FAFC",
  },
  placeholderText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  selectedText: {
    color: "#1E293B",
    fontSize: 14,
    fontWeight: "500",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 6,
  },
  dateField: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  dateText: {
    fontSize: 14,
    color: "#1E293B",
  },
  reset: {
    alignSelf: "center",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  resetText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 13,
  },
});
