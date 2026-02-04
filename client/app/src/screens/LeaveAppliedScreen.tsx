import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from "@react-navigation/native";
import { useGetLeavesQuery, useUpdateLeaveStatusMutation } from "../shared/store/api/leaveApi";
import { useAppSelector } from "../shared/store/hooks";

const PRIMARY = "#e91e62";

/* ================= TYPES ================= */

type HQ = {
  _id: string;
  name: string;
  region: string;
};

type Employee = {
  _id: string;
  name: string;
  role: string;
  designation: string | null;
  hq: HQ;
};

type Leave = {
  _id: string;
  employee: Employee;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  isHalfDay: boolean;
  halfType: "first" | "second" | null;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
};

/* ================= HELPERS ================= */

const getDurationLabel = (leave: Leave) => {
  if (!leave.isHalfDay) return "Full Day";
  return leave.halfType === "first"
    ? "Half Day (Morning)"
    : "Half Day (Afternoon)";
};

const formatDate = (date: string) => new Date(date).toDateString();

/* ================= SCREEN ================= */

const AppliedLeavesScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const {name, userId: admin_id} = useAppSelector((state: { auth: any; }) => state.auth);
  /* Filters */
  const [status, setStatus] = useState("pending");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [queryKey, setQueryKey] = useState(0);


  /* Local accumulated list */
  const [leaves, setLeaves] = useState<Leave[]>([]);

  const { data, isLoading, isFetching, refetch, error, isError } =
    useGetLeavesQuery({
      page,
      limit: 10,
      status,
      type,
      name: search,
      queryKey,
      role: "",
      hq: "",
      refetchOnFocus: true, 
      refetchOnReconnect: true,
    });
  
  const [updateLeaveStatus, { isLoading: isUpdatingLeaveStatus }] = useUpdateLeaveStatusMutation();


  const resetAndRefetch = () => {
    setPage(1);
    setLeaves([]);
    setQueryKey((k) => k + 1);
  };

  /* ================= DATA HANDLING ================= */

  useEffect(() => {
    if (data?.data) {
      setLeaves((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
    }
  }, [data]);

  /* Reset on filter change */
  useEffect(() => {
    if (!data?.data) return;

    setLeaves((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
  }, [data, page]);


  const onStatusChange = (value: string) => {
    setStatus(value);
    resetAndRefetch();
  };

  const onTypeChange = (value: string) => {
    setType(value);
    resetAndRefetch();
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    resetAndRefetch();
  };

  


  
  /* Search (client-side only) */
  const filteredLeaves = useMemo(() => {
    if (!search) return leaves;
    return leaves.filter((l) =>
      l.employee.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, leaves]);

  const hasMore = page < (data?.pagination?.pages || 1);
  const loadMore = () => {
    if (!hasMore || isFetching) return;
    setPage((p) => p + 1);
  };

  /* ================= RENDER ITEM ================= */

  const renderItem = ({ item }: { item: Leave }) => {
    const avatar = item.employee.name.charAt(0).toUpperCase();

    const onApprove = async (leaveId: string) => {
      
      try {
        await updateLeaveStatus({
          leaveId,
          status: "approved",
          approvedBy: {
            id: admin_id, // logged-in user id
            model: "Admin",
          },
          userId: item.employee._id,
        }).unwrap();

        ToastAndroid.show("Leave approved", ToastAndroid.SHORT);
      } catch (err) {
        ToastAndroid.show("Failed to approve leave", ToastAndroid.SHORT);
      }
    };


    const onReject = async (leaveId: string) => {
      try {
        await updateLeaveStatus({
          leaveId,
          status: "rejected",
          approvedBy: {
            id: admin_id,
            model: "Admin",
          },
          userId: item.employee._id,
        }).unwrap();

        
        ToastAndroid.show("Leave rejected", ToastAndroid.SHORT);
      } catch (err) {
        ToastAndroid.show("Failed to reject leave", ToastAndroid.SHORT);
      }
    };


    

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            navigation.navigate("EmployeeDetailScreen", {
              id: item.employee._id,
            }
          )
          }
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatar}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.employee.name}</Text>
            <Text style={styles.meta}>
              {item.employee.role} • {item.employee.hq.name}
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.leaveInfo}>
          {item.type.toUpperCase()} • {getDurationLabel(item)}
        </Text>

        <Text style={styles.date}>{formatDate(item.startDate)}</Text>

        <Text style={styles.reason}>Reason: {item.reason}</Text>

        <View style={styles.footer}>
          <View style={[styles.status, styles[item.status]]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>

          {item.status === "pending" && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => onReject(item._id)}
              >
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => onApprove(item._id)}
              >
                <Text style={styles.approveText}>Approve</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  /* ================= JSX ================= */

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Applied Leaves</Text>
      </View>

      <View style={styles.filters}>
        <Dropdown
          style={styles.dropdown}
          data={[
            { label: "All", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ]}
          labelField="label"
          valueField="value"
          value={status}
          onChange={(item) => onStatusChange(item.value)}
          placeholder="Status"
        />

        <Dropdown
          style={styles.dropdown}
          data={[
            { label: "All", value: "" },
            { label: "Earned", value: "earned" },
            { label: "Casual", value: "casual" },
            { label: "Sick", value: "sick" },
            { label: "Public", value: "public" },
            { label: "Maternity", value: "maternity" },
            { label: "Paternity", value: "paternity" },
            { label: "Unpaid", value: "unpaid" },
          ]}
          labelField="label"
          valueField="value"
          value={type}
          onChange={(item) => onTypeChange(item.value)}
          placeholder="Leave Type"
        />
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search employee..."
        value={search}
        onChangeText={(text) => onSearchChange(text)}
      />

      {isLoading && page === 1 ? (
        <ActivityIndicator color={PRIMARY} />
      ) : (
        <FlatList
          data={filteredLeaves}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          onEndReached={() => hasMore && setPage((p) => p + 1)}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetching ? <ActivityIndicator color={PRIMARY} /> : null
          }
          onEndReached={loadMore}
        />
      )}
    </View>
  );
};

export default AppliedLeavesScreen;

/* =======================
   Styles
======================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },

  header: {
    padding: 16,
    backgroundColor: PRIMARY,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  filters: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
  },

  dropdown: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
  },

  search: {
    marginHorizontal: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  meta: {
    fontSize: 12,
    color: "#666",
  },

  leaveInfo: {
    marginTop: 8,
    fontWeight: "500",
  },

  date: {
    fontSize: 12,
    color: "#555",
  },

  reason: {
    marginTop: 4,
    fontSize: 13,
    color: "#333",
  },

  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  pending: { backgroundColor: "#fff3cd" },
  approved: { backgroundColor: "#d4edda" },
  rejected: { backgroundColor: "#f8d7da" },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  rejectBtn: {
    borderWidth: 1,
    borderColor: "#dc3545",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  rejectText: {
    color: "#dc3545",
    fontWeight: "500",
  },

  approveBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  approveText: {
    color: "#fff",
    fontWeight: "500",
  }
});
