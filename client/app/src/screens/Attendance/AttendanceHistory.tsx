import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGetAttendanceHistoryQuery } from "../../shared/store/api/attendanceApi";

import AttendanceCard from "./components/AttendanceCard";
import AttendanceFilters from "./components/AttendanceFilters";
import AttendanceSummary from "./components/AttendanceSummary";
import AttendanceEmpty from "./components/AttendanceEmpty";
import AttendanceHistorySkeleton from "../../shared/componets/skeletons/AttendanceHistorySkeleton";
import { ScrollView } from "react-native-gesture-handler";

const PAGE_SIZE = 10;

const AttendanceHistory = () => {
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    status: "",
    employeeId: "",
    role: "",
    hq: "",
    startDate: "",
    endDate: "",
  });

  const queryParams = {
    page,
    limit: PAGE_SIZE,
    ...filters,
  };

  const { data, isLoading, isFetching, refetch } =
    useGetAttendanceHistoryQuery(queryParams);

  const attendance = data?.data ?? [];

  const pagination = data?.pagination;

  const updateFilters = useCallback((newFilters: any) => {
    setPage(1);

    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const onRefresh = useCallback(async () => {
    setPage(1);
    await refetch();
  }, [refetch]);

  const loadMore = () => {
    if (isFetching) return;

    if (!pagination) return;

    if (page >= pagination.totalPages) return;

    setPage((prev) => prev + 1);
  };

  if (isLoading) {
    return <AttendanceHistorySkeleton />;
  }

  

  return (
    <View style={styles.container}>
      <View style={styles.header} >
        <Text style={styles.title} >Attendance History</Text>
      </View>
      


        <AttendanceFilters
          mode="admin"
          filters={filters}
          onChange={updateFilters}
        />

      

      <FlatList
        data={attendance}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <AttendanceCard attendance={item} />}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && page === 1}
            onRefresh={onRefresh}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={<AttendanceEmpty />}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          isFetching && page > 1 ? (
            <ActivityIndicator size="small" style={styles.footerLoader} />
          ) : null
        }
      />
        {/* <AttendanceSummary attendance={attendance} /> */}
    </View>
  );
};

export default AttendanceHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    position:"relative"
  },
  header: {
    backgroundColor: "#e91e62",
    padding: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "700",
  },

  list: {
    padding: 15,
    paddingBottom: 30,
  },

  footerLoader: {
    marginVertical: 20,
  },
});
