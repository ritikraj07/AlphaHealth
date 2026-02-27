import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialIcons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { useGetDoctorChemistDashboardQuery } from "../shared/store/api/doctorChemistApi";
import { NavProp } from "../navigators";
import { RefreshControl } from "react-native-gesture-handler";

const DoctorChemistListScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { data, isLoading, isError, error, refetch, isFetching } = useGetDoctorChemistDashboardQuery({});

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [cityFilter, setCityFilter] = useState<string | null>(null);
    const [potentialFilter, setPotentialFilter] = useState<string | null>(null);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const rotateIcon = (open: boolean) => {
    Animated.timing(rotateAnim, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const list = data?.data || [];

  // 🔥 Dynamic Filter Data From API
  const typeOptions = useMemo(() => {
    const types = [...new Set(list.map((i) => i.type))];
    return [
      { label: "All", value: null },
      ...types.map((t) => ({ label: t, value: t })),
    ];
  }, [list]);

  const cityOptions = useMemo(() => {
    const cities = [...new Set(list.map((i) => i.location))];
    return [
      { label: "All", value: null },
      ...cities.map((c) => ({ label: c, value: c })),
    ];
  }, [list]);

  const statusOptions = [
    { label: "All", value: null },
    { label: "Approved", value: "Approved" },
    { label: "Pending", value: "Pending" },
    ];
    
    const potentialOptions = [
      { label: "All", value: null },
      { label: "High", value: "high" },
      { label: "Medium", value: "medium" },
      { label: "Low", value: "low" },
    ]

  // 🔥 Filtering Logic
  const filteredData = useMemo(() => {
    return list.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (!typeFilter || item?.type === typeFilter) &&
        (!cityFilter || item?.location === cityFilter) &&
        (!statusFilter ||
              (statusFilter === "Approved" ? item.isApproved : !item.isApproved)) &&
              (!potentialFilter || item?.potential === potentialFilter)
      );
    });
  }, [list, search, typeFilter, cityFilter, statusFilter, potentialFilter]);

  const resetFilters = () => {
    setTypeFilter(null);
    setCityFilter(null);
      setStatusFilter(null);
      setPotentialFilter(null);
    setSearch("");
  };

  const renderCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DoctorChemistDetailsScreen"  , {item } )
      }
      >
          
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={{ color: item.isApproved ? "#22c55e" : "#ef4444" }}>
          {item.isApproved ? "Approved" : "Pending"}
        </Text>
      </View>

      <Text style={styles.sub}>
        {item.type} • {item.city}
      </Text>
    </TouchableOpacity>
  );

  return (
      <View style={styles.container}
          
      >
      {/* 🔍 Search */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#9ca3af" />
        <TextInput
          placeholder="Search doctor or chemist..."
          value={search}
          onChangeText={setSearch}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>

      {/* 🔽 Filter Row */}
      <View style={styles.filterRow}>
        {[
          {
            data: typeOptions,
            value: typeFilter,
            set: setTypeFilter,
            placeholder: "Type",
          },
          {
            data: statusOptions,
            value: statusFilter,
            set: setStatusFilter,
            placeholder: "Status",
          },
          {
            data: cityOptions,
            value: cityFilter,
            set: setCityFilter,
            placeholder: "City",
                  },
                  {
            data: potentialOptions,
            value: potentialFilter,
            set: setPotentialFilter,
            placeholder: "Potential",
          },
        ].map((item, index) => (
          <Dropdown
            key={index}
            style={styles.dropdown}
            data={item.data}
            labelField="label"
            valueField="value"
            placeholder={item.placeholder}
            value={item.value}
            onFocus={() => rotateIcon(true)}
            onBlur={() => rotateIcon(false)}
            onChange={(val) => item.set(val.value)}
            renderRightIcon={() => (
              <Animated.View style={{ transform: [{ rotate }] }}>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color="#555"
                />
              </Animated.View>
            )}
          />
        ))}
      </View>

      {/* 🟢 Selected Filter Chips */}
      <View style={styles.chipContainer}>
        {[typeFilter, statusFilter, cityFilter]
          .filter(Boolean)
          .map((chip, i) => (
            <View key={i} style={styles.chip}>
              <Text style={{ color: "#fff" }}>{chip}</Text>
            </View>
          ))}
        {(typeFilter || statusFilter || cityFilter || search) && (
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.reset}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 📋 List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
              showsVerticalScrollIndicator={false}
              refreshControl={
                  <RefreshControl 
                      refreshing={isFetching}
                      onRefresh={refetch}
                  />
              }
      />
    </View>
  );
};

export default DoctorChemistListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f8fafc",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  dropdown: {
    width: "48%",
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 10,
  },
  chip: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
  },
  reset: {
    color: "#ef4444",
    fontWeight: "600",
    marginLeft: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
  },
  sub: {
    color: "#64748b",
    marginTop: 4,
  },
});
