import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useGetHeadQuartersQuery } from "../../shared/store/api/hqApi";
import { useGetManagersQuery, useUpdateEmployeeMutation } from "../../shared/store/api/employeeApi";
import EditEmployeeModalSkeleton from "../../shared/componets/skeletons/EditEmployeeModalSkeleton";
import { useAppSelector } from "../../shared/store/hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  employee: any;
}

const managerTypes = [
  { label: "Training", value: "training" },
  { label: "Territory", value: "territory" },
  { label: "Area", value: "area" },
  { label: "Senior", value: "senior" },
];

const employmentStatusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Resigned | Terminated", value: "left" },
];

export default function EditEmployeeModal({ visible, onClose, employee, }: Props) {
  const { userId: AdminId } = useAppSelector((state) => state.auth);
  const isEmployee = employee.role === "employee";
  const [isManager, setIsManager] = useState(!isEmployee);
  const [phone] = useState(employee.phone);
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [selectedHQ, setSelectedHQ] = useState(employee?.hq?._id);
  const [selectedManager, setSelectedManager] = useState(
    employee?.manager?._id
  );
  const [employmentStatus, setEmploymentStatus] = useState(
    employee.employmentStatus
  );
  const [managerType, setManagerType] = useState(employee.designation || null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { data: HQ, isLoading, error, refetch } = useGetHeadQuartersQuery({});
  const {
    data: managers,
    isLoading: isLoadingManagers,
    error: managersError,
    refetch: refetchManagers,
  } = useGetManagersQuery({});
  const [updateEmployee, { isLoading: isLoadingUpdate }, ] = useUpdateEmployeeMutation({});

  const hqs = HQ?.data || [];
  const managersList = managers?.data.employees || [];
  if (!visible) return null;

  const formatedManagers = managersList?.map((m: any) => ({
    label: m.name,
    value: m._id,
    hq: m?.hq?.name,
  }));

  const formattedHQs = hqs?.map((h: any) => ({
    label: h.name,
    value: h._id,
  }));

  const renderManagerItem = (item: { label: string; hq: string }, selected: string) => (
    <View
      style={[styles.itemContainer, selected && { backgroundColor: "#e7f1ff" }]}
    >
      <Text style={styles.managerName}>{item.label}</Text>

      <Text style={styles.hqText}>{item.hq}</Text>
    </View>
  );

  // console.log(managersList)

  /**
   * if employee is manager, cannot be edited as employee
   * switch button will be disabled
   *
   * if employee is employee, can be edited as manager
   * switch button will be enabled
   *
   */

  const validateForm = (): boolean => {
    const newError: { [key: string]: string } = {};

    if (name.trim() === "") {
      newError.name = "Name is required";
    }

    if (email.trim() === "") {
      newError.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      newError.email = "Please enter a valid email";
    }

    if (!selectedHQ) {
      newError.hq = "Headquarter is required";
    }

    if (!selectedManager && isManager) {
      newError.manager = "Manager is required";
    }

    setErrors(newError);

    return Object.keys(newError).length === 0;
  };

  const save = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      const managerAdmin = {
        managerModel: "Admin",
        manager: AdminId,
      };
      const payload = {
        name,
        email,
        phone,
        employmentStatus,
        hq: selectedHQ,
        manager: isManager ? managerAdmin : selectedManager,
        role: isManager ? "manager" : "employee",
        designation: isManager ? managerType : null,
      };

      if (isManager) {
        payload.managerModel = "Admin";
        payload.manager = AdminId;
      }



      const response = await updateEmployee({
        id: employee._id,
        payload,
      }).unwrap();

      if(!response){
        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
        return;
      }

      // console.log(response);

      ToastAndroid.show("Employee updated successfully", ToastAndroid.SHORT);
      onClose();
      // console.log(payload);
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  };

  return (
    <Modal transparent animationType="slide">
      {isLoading || isLoadingManagers ? (
        <EditEmployeeModalSkeleton />
      ) : (
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Edit Employee</Text>

              {/* Name */}
              <TextInput
                style={styles.input}
                defaultValue={employee.name}
                value={name}
                placeholder="Name"
                onChangeText={(text) => setName(text)}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              {/* Email */}
              <TextInput
                style={styles.input}
                defaultValue={employee.email}
                value={email}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              {/* Phone (readonly) */}
              <TextInput
                style={[styles.input, { backgroundColor: "#eee" }]}
                editable={false}
                value={employee?.phone}
                placeholder="Phone (readonly)"
              />

              {/* Headquarter */}
              <Text style={styles.label}>Headquarter</Text>
              <Dropdown
                data={formattedHQs} // plug Manager list here
                style={styles.dropdown}
                labelField="label"
                valueField="value"
                placeholder="Select Headquarter"
                value={selectedHQ}
                onChange={(item) => {
                  setSelectedHQ(item.value);
                }}
              />
              {errors.hq && <Text style={styles.errorText}>{errors.hq}</Text>}

              {/* Manager */}
              {!isManager && (
                <>
                  <Text style={styles.label}>Manager</Text>
                  <Dropdown
                    data={formatedManagers}
                    style={styles.dropdown}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Manager"
                    value={selectedManager}
                    onChange={(item) => setSelectedManager(item.value)}
                      renderItem={(item) => {
                        return renderManagerItem(item, selectedManager);
                      }}
                  />
                </>
              )}

              {/* Employment Status */}
              <Text style={styles.label}>Employment Status</Text>
              <Dropdown
                data={employmentStatusOptions}
                style={styles.dropdown}
                labelField="label"
                valueField="value"
                placeholder="Select Status"
                value={employmentStatus}
                onChange={(item) => setEmploymentStatus(item.value)}
              />

              {/* Role Section */}
              <Text style={styles.sectionTitle}>Role</Text>

              {isEmployee ? (
                <View style={styles.switchRow}>
                  <Text>Switch to Manager</Text>
                  <Switch
                    value={isManager}
                    onValueChange={(value) => setIsManager(value)}
                  />
                </View>
              ) : (
                <Text style={styles.roleTag}>
                  Current Role: Manager (locked)
                </Text>
              )}

              {/* If manager → show manager type selector */}
              {isManager && (
                <>
                  <Text style={styles.label}>Manager Type</Text>
                  <Dropdown
                    data={managerTypes}
                    style={styles.dropdown}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Manager Type"
                    value={employee.employmentStatus}
                    onChange={() => {}}
                  />
                </>
              )}

              {/* Save + Cancel */}
              <View style={[styles.row, { marginBottom: 50 }]}>
                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.btn, styles.cancel]}
                >
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={save}
                  style={[styles.btn, styles.save]}
                >
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    maxHeight: "70%", // ensures scroll works
    overflow: "hidden",
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  label: { marginBottom: 6, marginTop: 10, fontSize: 14 },
  sectionTitle: { marginTop: 14, marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 4,
  },

  itemContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    flexDirection: "row",
  },
  managerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  hqText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
    backgroundColor: "#e91e62",
    paddingHorizontal: 6,
    borderRadius: 6,
    color: "#fff",
    marginLeft: 10,
  },
  roleTag: {
    backgroundColor: "#eee",
    padding: 6,
    borderRadius: 6,
    fontSize: 14,
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  row: { flexDirection: "row", justifyContent: "flex-end", marginTop: 14 },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancel: { backgroundColor: "#aaa" },
  save: { backgroundColor: "#007bff" },
  btnText: { color: "#fff", fontWeight: "600" },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginBottom: 10,
    marginTop: -9,
  },
});
