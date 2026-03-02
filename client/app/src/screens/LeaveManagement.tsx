import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
  
} from "react-native";
import { EvilIcons, Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useGetMyDetailQuery } from "../shared/store/api/employeeApi";
import { useAppSelector } from "../shared/store/hooks";
import LeaveModal from "./Modals/LeaveModal";
import MyLeaveHistory from "../shared/componets/MyLeaveHistory";

const PRIMARY = "#e91e62";

export default function LeaveManagement() {
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
  const auth = useAppSelector((state) => state.auth);

  const { data, isFetching, refetch } = useGetMyDetailQuery({
    id: auth?.userId,
  });

  const leaves = data?.data?.leavesTaken;

  return (
    <View style={styles.root}>
      <LeaveModal
        visible={isLeaveModalVisible}
        onClose={() => setIsLeaveModalVisible(false)}
      />

      <FlatList
        data={[]}
        renderItem={() => null}
        keyExtractor={() => "dummy"}
        showsVerticalScrollIndicator={false}
        bounces={false} // iOS clean feel
        overScrollMode="never" // Android glow off
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Leave Management</Text>
                <Text style={styles.subtitle}>
                  View balance & manage your leaves
                </Text>
              </View>

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => setIsLeaveModalVisible(true)}
              >
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>

            {/* Balance Cards */}
            <View style={styles.grid}>
              <LeaveCard
                label="Sick Leave"
                value={leaves?.sick}
                icon={<EvilIcons name="heart" size={26} color="red" />}
              />
              <LeaveCard
                label="Casual Leave"
                value={leaves?.casual}
                icon={<Feather name="coffee" size={22} color="#3498db" />}
              />
              <LeaveCard
                label="Earned Leave"
                value={leaves?.earned}
                icon={<Feather name="gift" size={22} color="#2ecc71" />}
              />
              <LeaveCard
                label="Public Holidays"
                value={leaves?.public}
                icon={<Feather name="calendar" size={22} color="#f39c12" />}
              />
            </View>

            {/* Leave History */}
            <MyLeaveHistory />
          </>
        }
      />
    </View>
  );
}

/* Small Card */
const LeaveCard = ({ label, value, icon }: any) => (
  <View style={styles.card}>
    <View style={styles.cardTop}>
      <Text style={styles.cardLabel}>{label}</Text>
      {icon}
    </View>
    <Text style={styles.cardValue}>{value ?? 0}</Text>
    <Text style={styles.cardHint}>Remaining</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    paddingHorizontal: 16,
  },

  header: {
    marginTop: 20,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  applyBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },

  applyText: {
    color: "#fff",
    fontWeight: "700",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardLabel: {
    fontSize: 14,
    fontWeight: "600",
  },

  cardValue: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: "800",
  },

  cardHint: {
    fontSize: 12,
    color: "#888",
  },
});
