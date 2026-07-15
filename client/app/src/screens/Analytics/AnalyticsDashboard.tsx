// screens/AnalyticsDashboard.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Platform,

} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useGetAnalyticsQuery } from "../../shared/store/api/analyticsApi";
import { useGetHeadQuartersQuery } from "../../shared/store/api/hqApi";
import { useGetProductsQuery } from "../../shared/store/api/productApi";
import { useGetEmployeesQuery } from "../../shared/store/api/employeeApi";

import type {
  AnalyticsResponse,
  AnalyticsData,
  Summary,
  TrendItem,
  AdvancedAnalytics,
  GroupBy,
} from "../../shared/types/analytics.types";
import { useNavigation } from "@react-navigation/native";
import { NavProp } from "../../navigators";


type Filters = {
  startDate?: string;
  endDate?: string;
  compareStart?: string;
  compareEnd?: string;
  groupBy?: GroupBy;
  employee?: string;
  hq?: string;
  doctorChemist?: string;
  product?: string;
  category?: string;
};

const DEFAULT_GROUP: GroupBy = "month";

const humanDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString() : "—";

export default function AnalyticsDashboard() {
  const navigation = useNavigation<NavProp>();
  // filter state
  const [filters, setFilters] = useState<Filters>({
    groupBy: DEFAULT_GROUP,
  });

  // date picker toggles
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showCmpStart, setShowCmpStart] = useState(false);
  const [showCmpEnd, setShowCmpEnd] = useState(false);

  // fetch reference data for dropdowns
  const { data: hqResp } = useGetHeadQuartersQuery({});
  const { data: employeeResp } = useGetEmployeesQuery({});
  const { data: productResp } = useGetProductsQuery();

  const hqs = hqResp?.data || [];
  const employees = employeeResp?.data?.employees || employeeResp?.data || [];
  const products = productResp || [];

  // main analytics call (will refetch automatically when filters object identity changes)
  const { data, isFetching, refetch, isError } = useGetAnalyticsQuery(
    filters as any,
    );
    
    
    const analytics: AnalyticsData | undefined = (data as AnalyticsResponse)
    ?.data;
    console.log(" top employees data", data?.data?.advanced?.topEmployees);

  // group options
  const groupOptions: GroupBy[] = ["day", "week", "month", "quarter"];

  // trend prepared for chart-like small bars (no package)
  const trend = analytics?.trend || [];

  // helper to set date fields (keeps ISO strings)
  const setDateFilter = (key: keyof Filters, d?: Date) => {
    setFilters((prev) => ({
      ...prev,
      [key]: d ? d.toISOString() : undefined,
    }));
  };

  // quick clear all filters
  const resetFilters = () => {
    setFilters({ groupBy: DEFAULT_GROUP });
  };

  // memo summary
  const summary = analytics?.summary;

  return (
    <View style={styles.safe}>
      <LinearGradient colors={["#e91e62", "#8b76e0"]} style={styles.header}>
        <Text style={styles.headerTitle}>Pharma Intelligence</Text>
        <Text style={styles.headerSubtitle}>
          Full analytics — use filters to narrow results
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* FILTERS CARD */}
        <View style={styles.card}>
          <View style={styles.filterRow}>
            <Dropdown
              style={styles.dropdown}
              data={hqs}
              labelField="name"
              valueField="_id"
              placeholder="Headquarter (HQ)"
              value={filters.hq}
              search
              searchPlaceholder="Search HQ"
              onChange={(item: any) =>
                setFilters((p) => ({ ...p, hq: item._id }))
              }
            />

            <Dropdown
              style={styles.dropdown}
              data={employees}
              labelField="name"
              valueField="_id"
              placeholder="Employee"
              value={filters.employee}
              search
              searchPlaceholder="Search employee"
              onChange={(item: any) =>
                setFilters((p) => ({ ...p, employee: item._id }))
              }
            />
          </View>

          <View style={styles.filterRow}>
            <Dropdown
              style={[styles.dropdown, { flex: 1 }]}
              data={products}
              labelField="product_name"
              valueField="_id"
              placeholder="Product"
              value={filters.product}
              search
              onChange={(item: any) =>
                setFilters((p) => ({ ...p, product: item._id }))
              }
            />

            <TextInput
              placeholder="Category (optional)"
              style={styles.input}
              value={filters.category}
              onChangeText={(t) => setFilters((p) => ({ ...p, category: t }))}
            />
          </View>
          <View style={styles.filterRow}>
            {/* start / end */}
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowStart(true)}
            >
              <MaterialIcons name="date-range" size={18} />
              <Text style={styles.dateBtnText}>
                {filters.startDate ? humanDate(filters.startDate) : "Start"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowEnd(true)}
            >
              <MaterialIcons name="date-range" size={18} />
              <Text style={styles.dateBtnText}>
                {filters.endDate ? humanDate(filters.endDate) : "End"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* groupBy chips */}
          <View style={styles.chips}>
            {groupOptions.map((g) => {
              const active = filters.groupBy === g;
              return (
                <TouchableOpacity
                  key={g}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setFilters((p) => ({ ...p, groupBy: g }))}
                >
                  <Text
                    style={active ? styles.chipTextActive : styles.chipText}
                  >
                    {g.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.filterRow}>
            {/* Comparison date range */}
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowCmpStart(true)}
            >
              <MaterialIcons name="compare" size={18} />
              <Text style={styles.dateBtnText}>
                {filters.compareStart
                  ? humanDate(filters.compareStart)
                  : "Cmp Start"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowCmpEnd(true)}
            >
              <MaterialIcons name="compare" size={18} />
              <Text style={styles.dateBtnText}>
                {filters.compareEnd ? humanDate(filters.compareEnd) : "Cmp End"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={refetch}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.clearBtn} onPress={resetFilters}>
            <Text style={styles.clearText}>Reset</Text>
          </TouchableOpacity>

          {/* date pickers (native) */}
          {showStart && (
            <DateTimePicker
              value={
                filters.startDate ? new Date(filters.startDate) : new Date()
              }
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, d) => {
                setShowStart(false);
                setDateFromPicker(setDateFilter, "startDate", d);
              }}
            />
          )}
          {showEnd && (
            <DateTimePicker
              value={filters.endDate ? new Date(filters.endDate) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, d) => {
                setShowEnd(false);
                setDateFromPicker(setDateFilter, "endDate", d);
              }}
            />
          )}
          {showCmpStart && (
            <DateTimePicker
              value={
                filters.compareStart
                  ? new Date(filters.compareStart)
                  : new Date()
              }
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, d) => {
                setShowCmpStart(false);
                setDateFromPicker(setDateFilter, "compareStart", d);
              }}
            />
          )}
          {showCmpEnd && (
            <DateTimePicker
              value={
                filters.compareEnd ? new Date(filters.compareEnd) : new Date()
              }
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, d) => {
                setShowCmpEnd(false);
                setDateFromPicker(setDateFilter, "compareEnd", d);
              }}
            />
          )}
        </View>

        {/* MAIN SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          {summary ? (
            <View style={styles.summaryGrid}>
              <InfoBox label="Total Sales" value={`₹ ${summary.totalSales}`} />
              <InfoBox label="Total Visits" value={`${summary.totalVisits}`} />
              <InfoBox label="Total Orders" value={`${summary.totalOrders}`} />
              <InfoBox
                label="Conversion %"
                value={`${summary.conversionRate}%`}
              />
              <InfoBox
                label="Revenue / Visit"
                value={`₹ ${summary.revenuePerVisit}`}
              />
              <InfoBox
                label="Avg Order"
                value={`₹ ${summary.averageOrderValue}`}
              />
              <InfoBox
                label="Growth Rate"
                value={
                  summary.growthRate !== null ? `${summary.growthRate}%` : "—"
                }
              />
            </View>
          ) : (
            <Text style={styles.muted}>No summary available</Text>
          )}
        </View>

        {/* TREND */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Trend ({filters.groupBy?.toUpperCase()})
          </Text>
          {trend.length ? (
            <View>
              <View style={styles.trendRow}>
                {trend.map((t: TrendItem, i: number) => (
                  <View style={styles.trendItem} key={i}>
                    <View style={styles.trendBarWrapper}>
                      <View
                        style={[
                          styles.trendBar,
                          {
                            height: Math.max(
                              6,
                              Math.round(
                                (t.totalSales /
                                  Math.max(...trend.map((x) => x.totalSales))) *
                                  100,
                              ),
                            ),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.trendLabel}>
                      {new Date(t._id).toLocaleDateString()}
                    </Text>
                    <Text style={styles.trendValue}>₹ {t.totalSales}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.muted}>No trend data</Text>
          )}

          {/* Comparison raw */}
          <Text style={[styles.cardTitle, { marginTop: 12 }]}>Comparison</Text>
          <Text style={styles.muted}>
            {JSON.stringify(analytics?.comparison ?? "No comparison", null, 2)}
          </Text>
        </View>

        {/* ADVANCED - TOP EMPLOYEES */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Employees</Text>
          {(analytics?.advanced?.topEmployees || []).length ? (
            (analytics?.advanced?.topEmployees || []).map((emp) => (
              <View style={styles.listRow} key={emp._id}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listTitle}>
                    {emp.employee?.name ?? emp.employee}
                  </Text>
                  <Text style={styles.muted}>
                    Email: {emp.employee?.email ?? "—"}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text>Orders: {emp.totalOrders}</Text>
                  <Text>Sales: ₹ {emp.totalSales}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.muted}>No top employees</Text>
          )}
        </View>

        {/* ADVANCED - INCENTIVE LEADERBOARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Incentive Leaderboard</Text>
          {(analytics?.advanced?.incentiveLeaderboard || []).length ? (
            (analytics?.advanced?.incentiveLeaderboard || []).map((it, idx) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EmployeeDetailScreen", { id: it.employee })
                }
                style={styles.listRow}
                key={`${it.employee}-${idx}`}
              >
                <Text style={{ flex: 1 }}>{it.employee}</Text>
                <Text style={{ width: 90, textAlign: "right" }}>
                  Score: {it.score}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.muted}>No incentive data</Text>
          )}
        </View>

        {/* ADVANCED - RAW JSON (entire response) */}
        {/* <View style={styles.card}>
          <Text style={styles.cardTitle}>Raw Response (full)</Text>
          <ScrollView horizontal style={{ marginTop: 8 }}>
            <Text style={styles.rawText}>
              {JSON.stringify(data ?? {}, null, 2)}
            </Text>
          </ScrollView>
        </View> */}

        {/* small footer space */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

/**
 * helpers
 */
function setDateFilter(key: keyof Filters, d?: Date) {
  // placeholder; we call setDateFilter via setDateFromPicker below
}

function setDateFromPicker(
  setter: (key: keyof Filters, d?: Date) => void,
  key: keyof Filters,
  d?: Date | undefined,
) {
  // called in picker change; local helper to avoid TS errors in inline closures
  if (!d) return;
  setter(key, d);
}

/**
 * Small reusable components
 */
const InfoBox = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

/**
 * Styles
 */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  header: {
    padding: 20,
    paddingTop: 36,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#f1eaff",
    marginTop: 6,
  },

  container: {
    flex: 1,
    padding: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginVertical: 10,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  dropdown: {
    flex: 1,
    height: 46,
    backgroundColor: "#fafafa",
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  input: {
    flex: 1,
    height: 46,
    backgroundColor: "#fafafa",
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    backgroundColor: "#f6f6f8",
    borderRadius: 10,
    minWidth: 100,
  },

  dateBtnText: {
    marginLeft: 6,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f1f3f8",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  chipActive: {
    backgroundColor: "#7B61FF",
  },

  chipText: {
    color: "#333",
    fontWeight: "600",
  },

  chipTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  applyBtn: {
    backgroundColor: "#7B61FF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 8,
  },

  applyText: {
    color: "#fff",
    fontWeight: "700",
  },

  clearBtn: {
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#7B61FF",
  },

  clearText: {
    color: "#ffffff",
    fontWeight: "700",
    textAlign: "center",
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },

  infoBox: {
    width: "48%",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },

  infoLabel: {
    color: "#666",
    fontSize: 12,
  },

  infoValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },

  muted: {
    color: "#7b7b7b",
  },

  // trend
  trendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  trendItem: {
    alignItems: "center",
    width: 84,
    marginRight: 8,
  },

  trendBarWrapper: {
    width: 36,
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  trendBar: {
    width: 28,
    backgroundColor: "#7B61FF",
    borderRadius: 6,
  },

  trendLabel: {
    marginTop: 6,
    fontSize: 11,
    color: "#444",
  },

  trendValue: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },

  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },

  listTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  rawText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : undefined,
    fontSize: 12,
  },
});

