import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
  Platform,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from "@react-navigation/native";
import {
  useGetLeavesQuery,
  useUpdateLeaveStatusMutation,
} from "../shared/store/api/leaveApi";
import { useAppSelector } from "../shared/store/hooks";

const PRIMARY = "#e91e62";

// ======================== TYPES =====================================
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

// 👇 type: string (matches API response)
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
  createdAt: string;
};

// ======================== HELPERS ===================================
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toDateString();
};

const getDurationLabel = (leave: Leave): string => {
  if (!leave.isHalfDay) return "Full Day";
  return leave.halfType === "first"
    ? "Half Day (Morning)"
    : "Half Day (Afternoon)";
};

const showToast = (message: string, duration: number = ToastAndroid.SHORT) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, duration);
  } else {
    Alert.alert("", message);
  }
};

// ======================== MAIN COMPONENT ============================
const AppliedLeavesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { userId: adminId } = useAppSelector((state) => state.auth);

  // ---------- Filter state ----------
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ---------- Pagination state ----------
  const [page, setPage] = useState<number>(1);
  const [allLeaves, setAllLeaves] = useState<Leave[]>([]);
  const [queryKey, setQueryKey] = useState<number>(0);

  // ---------- Pull-to-refresh ----------
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // ---------- API hooks ----------
  const { data, isLoading, isFetching, refetch } = useGetLeavesQuery({
    page,
    limit: 10,
    status: statusFilter,
    type: typeFilter,
    name: searchQuery,
    queryKey,
    role: "",
    hq: "",
  });

  const [updateLeaveStatus, { isLoading: isUpdating }] =
    useUpdateLeaveStatusMutation();
const [updatingLeaveId, setUpdatingLeaveId] = useState<string | null>(null);
  // ---------- Accumulate pages ----------
  useEffect(() => {
    if (data?.data) {
      setAllLeaves((prev) =>
        page === 1 ? data.data : [...prev, ...data.data],
      );
    }
  }, [data, page]);

  // ---------- Reset filters & go to first page ----------
  const resetAndRefetch = useCallback(() => {
    setPage(1);
    setAllLeaves([]);
    setQueryKey((k) => k + 1);
  }, []);

  // ---------- Filter change handlers ----------
  const onStatusChange = (value: string) => {
    setStatusFilter(value);
    resetAndRefetch();
  };

  const onTypeChange = (value: string) => {
    setTypeFilter(value);
    resetAndRefetch();
  };

  const onSearchChange = (text: string) => {
    setSearchQuery(text);
    resetAndRefetch();
  };

  // ---------- Pull-to-refresh ----------
  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    setPage(1);
    setAllLeaves([]);
    setQueryKey((k) => k + 1);
    await refetch();
    setRefreshing(false);
  }, [refreshing, refetch]);

  // ---------- Client-side search (by employee name) ----------
  const filteredLeaves = useMemo(() => {
    if (!searchQuery.trim()) return allLeaves;
    const lower = searchQuery.toLowerCase();
    return allLeaves.filter((leave) =>
      leave.employee?.name?.toLowerCase().includes(lower),
    );
  }, [searchQuery, allLeaves]);

  // ---------- Pagination: load more ----------
  const hasMore = page < (data?.pagination?.pages || 1);
  const loadMore = useCallback(() => {
    if (!hasMore || isFetching || refreshing) return;
    setPage((p) => p + 1);
  }, [hasMore, isFetching, refreshing]);

  // ---------- Approve / Reject actions ----------
  const handleApprove = useCallback(
    async (leave: Leave) => {
       setUpdatingLeaveId(leave._id);
      try {
        await updateLeaveStatus({
          leaveId: leave._id,
          status: "approved",
          approvedBy: { id: adminId, model: "Admin" },
          userId: leave.employee._id,
        }).unwrap();
        showToast("Leave approved ✅");
        resetAndRefetch();
      } catch (error) {
        console.error("Approve error:", error);
        showToast("Failed to approve leave", ToastAndroid.LONG);
      }finally{
         setUpdatingLeaveId(null);
      }
    },
    [adminId, updateLeaveStatus, resetAndRefetch],
  );

  const handleReject = useCallback(
    async (leave: Leave) => {
       setUpdatingLeaveId(leave._id);
      try {
        await updateLeaveStatus({
          leaveId: leave._id,
          status: "rejected",
          approvedBy: { id: adminId, model: "Admin" },
          userId: leave.employee._id,
        }).unwrap();
        showToast("Leave rejected ❌");
        resetAndRefetch();
      } catch (error) {
        console.error("Reject error:", error);
        showToast("Failed to reject leave", ToastAndroid.LONG);
      } finally {
         setUpdatingLeaveId(null);
      }
    },
    [adminId, updateLeaveStatus, resetAndRefetch],
  );

  // ---------- Render each leave item ----------
  const renderItem = useCallback(
    ({ item }: { item: Leave }) => {
      const avatar = item.employee?.name?.charAt(0).toUpperCase() || "?";
      const isPending = item.status === "pending";
const isUpdatingThis = updatingLeaveId === item._id;
      return (
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              navigation.navigate("EmployeeDetailScreen", {
                id: item.employee._id,
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatar}</Text>
            </View>
            <View style={styles.employeeInfo}>
              <Text style={styles.name}>
                {item.employee?.name || "Unknown"}
              </Text>
              <Text style={styles.meta}>
                {item.employee?.role || ""} • {item.employee?.hq?.name || ""}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.details}>
            <Text style={styles.leaveType}>
              {item.type.toUpperCase()} • {getDurationLabel(item)}
            </Text>
            <Text style={styles.dateRange}>
              {formatDate(item.startDate)}
              {!item.isHalfDay && ` – ${formatDate(item.endDate)}`}
            </Text>
            <Text style={styles.reason}>“{item.reason}”</Text>
          </View>

          <View style={styles.footer}>
            <View style={[styles.statusBadge, styles[`badge_${item.status}`]]}>
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>
            
            {isPending && (
              <View style={styles.actions}>
                {isUpdatingThis ? (
                  // Show spinner while updating
                  <ActivityIndicator size="small" color={PRIMARY} />
                ) : (
                  <>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => handleReject(item)}
                      disabled={isUpdating}
                    >
                      <Text style={styles.rejectText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleApprove(item)}
                      disabled={isUpdating}
                    >
                      <Text style={styles.approveText}>Approve</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      );
    },
    [navigation, handleApprove, handleReject, isUpdating],
  );

  // ---------- Empty state ----------
  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No leave applications found.</Text>
      </View>
    ),
    [],
  );

  // ---------- Footer loader ----------
  const renderFooter = useCallback(() => {
    if (!isFetching || refreshing) return null;
    return <ActivityIndicator color={PRIMARY} style={styles.footerLoader} />;
  }, [isFetching, refreshing]);

  // ---------- Loading screen ----------
  if (isLoading && page === 1 && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  // ---------- Main render ----------
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Applied Leaves</Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
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
          value={statusFilter}
          onChange={(item) => onStatusChange(item.value)}
          placeholder="Status"
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownText}
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
          ]}
          labelField="label"
          valueField="value"
          value={typeFilter}
          onChange={(item) => onTypeChange(item.value)}
          placeholder="Leave Type"
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownText}
        />
      </View>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search employee..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={onSearchChange}
        clearButtonMode="while-editing"
      />

      {/* List */}
      <FlatList
        data={filteredLeaves}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[PRIMARY]}
            tintColor={PRIMARY}
          />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
};

export default AppliedLeavesScreen;

// ======================== STYLES =====================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },

  header: {
    padding: 16,
    backgroundColor: PRIMARY,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 10,
    backgroundColor: "#f8f8f8",
  },

  dropdown: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 42,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  dropdownPlaceholder: {
    color: "#999",
    fontSize: 14,
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },

  searchInput: {
    marginHorizontal: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 42,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 15,
  },

  listContent: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 6,
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  employeeInfo: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },

  meta: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  details: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  leaveType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  dateRange: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },

  reason: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
    fontStyle: "italic",
  },

  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  badge_pending: {
    backgroundColor: "#fff3cd",
  },
  badge_approved: {
    backgroundColor: "#d4edda",
  },
  badge_rejected: {
    backgroundColor: "#f8d7da",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  rejectBtn: {
    borderWidth: 1,
    borderColor: "#dc3545",
    backgroundColor: "transparent",
  },
  rejectText: {
    color: "#dc3545",
    fontWeight: "600",
    fontSize: 13,
  },

  approveBtn: {
    backgroundColor: PRIMARY,
  },
  approveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },

  footerLoader: {
    marginVertical: 16,
  },
});
