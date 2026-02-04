import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Employee, useGetEmployeesQuery } from "../shared/store/api/employeeApi";
import EmployeesSkeleton from "../shared/componets/skeletons/EmployeeSkeleton";


export default function EmployeesScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "manager" | "employee">(
    "all"
  );

  const { data, isLoading, error, refetch, isFetching, isError, isSuccess } = useGetEmployeesQuery({});

  
  
  // Extract employee list safely
  const employees = data?.data?.employees ?? [];

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" ? true : emp.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [employees, search, roleFilter]);

  const renderItem = ({ item }: { item: Employee }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("EmployeeDetailScreen", { employee: item as any })

      }
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>

        <View style={styles.rightInfo}>
          <Text style={styles.roleTag}>
            {item.role === "manager" ? "Manager" : "Employee"}
          </Text>
          <Text style={styles.hqTag}>{item.hq?.name ?? "N/A"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={{ marginBottom: 10 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or email..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        {["all", "manager", "employee"].map((r) => (
          <TouchableOpacity
            key={r}
            style={[
              styles.filterBtn,
              roleFilter === r && styles.filterBtnActive,
            ]}
            onPress={() => setRoleFilter(r as any)}
          >
            <Text
              style={[
                styles.filterText,
                roleFilter === r && styles.filterTextActive,
              ]}
            >
              {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );


  if (isLoading) {
    return(<EmployeesSkeleton />)
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={() =>
          !isFetching ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No employees found
            </Text>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        ListFooterComponent={() =>
          isFetching ? (
            <Text style={{ textAlign: "center", marginVertical: 10 }}>
              Loading...
            </Text>
          ) : (
            <View style={{ height: 20 }} />
          )
        }
      />
    </View>
  );
}


//
// STYLES
//
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#f8f9fb" },

  // Search
  searchInput: {
    height: 42,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },

  filterRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
  },

  filterBtnActive: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },

  filterText: {
    fontSize: 13,
    color: "#333",
  },

  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  // Card
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  name: { fontSize: 16, fontWeight: "600", color: "#111" },
  email: { fontSize: 13, color: "#777", marginTop: 2 },

  rightInfo: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  roleTag: {
    fontSize: 12,
    fontWeight: "700",
    backgroundColor: "#007bff22",
    color: "#007bff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  hqTag: {
    fontSize: 12,
    color: "#444",
    fontWeight: "600",
  },
});
