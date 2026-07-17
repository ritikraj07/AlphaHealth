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
import { RefreshControl } from "react-native-gesture-handler";

import { useGetDoctorChemistDashboardQuery } from "../shared/store/api/doctorChemistApi";
import { NavProp } from "../navigators";

const DoctorChemistListScreen = () => {
  const navigation = useNavigation<NavProp>();

  const { data, isFetching, refetch } = useGetDoctorChemistDashboardQuery({});

  const list = data?.data ?? [];

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

  const typeOptions = useMemo(() => {
    const types = [...new Set(list.map((i) => i.type))];

    return [
      { label: "All", value: null },
      ...types.map((t) => ({
        label: t.charAt(0).toUpperCase() + t.slice(1),
        value: t,
      })),
    ];
  }, [list]);

  const cityOptions = useMemo(() => {
    const cities = [...new Set(list.map((i) => i.location))];

    return [
      { label: "All", value: null },
      ...cities.map((c) => ({
        label: c,
        value: c,
      })),
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
  ];

  const filteredData = useMemo(() => {
    return list.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (!typeFilter || item.type === typeFilter) &&
        (!cityFilter || item.location === cityFilter) &&
        (!potentialFilter || item.potential === potentialFilter) &&
        (!statusFilter ||
          (statusFilter === "Approved" ? item.isApproved : !item.isApproved))
      );
    });
  }, [list, search, typeFilter, cityFilter, potentialFilter, statusFilter]);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter(null);
    setStatusFilter(null);
    setCityFilter(null);
    setPotentialFilter(null);
  };

  const renderCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("DoctorChemistDetailsScreen", { item })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>

        <Text
          style={{
            color: item.isApproved ? "#22c55e" : "#ef4444",
            fontWeight: "600",
          }}
        >
          {item.isApproved ? "Approved" : "Pending"}
        </Text>
      </View>

      <Text style={styles.sub}>
        {item.type} • {item.location}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.title}>Doctors & Chemists</Text>

        <TouchableOpacity onPress={resetFilters}>
          <Text style={styles.reset}>Reset Filters</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#888" />

        <TextInput
          style={{ flex: 1, marginLeft: 10 }}
          placeholder="Search doctor or chemist..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* FILTERS */}

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
              <Animated.View
                style={{
                  transform: [{ rotate }],
                }}
              >
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color="#666"
                />
              </Animated.View>
            )}
          />
        ))}
      </View>

      {/* CHIPS */}

      <View style={styles.chipContainer}>
        {[typeFilter, statusFilter, cityFilter, potentialFilter]
          .filter(Boolean)
          .map((chip, index) => (
            <View key={index} style={styles.chip}>
              <Text style={{ color: "#fff" }}>{chip}</Text>
            </View>
          ))}
      </View>

      {/* LIST */}

      <FlatList
        data={filteredData}
        renderItem={renderCard}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: 40,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="medical-services" size={70} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Doctors / Chemists Found</Text>
          </View>
        }
      />
    </View>
  );
};

export default DoctorChemistListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  header: {
    backgroundColor: "#e91e62",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  reset: {
    color: "#fff",
    fontWeight: "600",
  },

  searchContainer: {
    margin: 15,
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  dropdown: {
    width: "48%",
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 12,
    elevation: 2,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  chip: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
  },

  sub: {
    color: "#64748b",
    marginTop: 6,
    textTransform: "capitalize",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 17,
    color: "#94a3b8",
    fontWeight: "600",
  },
});
