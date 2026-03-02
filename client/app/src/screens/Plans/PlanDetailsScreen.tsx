import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigators";


type VisitRouteProp = RouteProp<RootStackParamList, "PlanDetailsScreen">;
type NavProp = NativeStackNavigationProp<RootStackParamList>;

const VisitDetailsScreen = () => {
  const route = useRoute<VisitRouteProp>();
  const navigation = useNavigation<NavProp>();
  const { item } = route.params;

  const formattedDate = new Date(item.date).toDateString();
  const createdAt = new Date(item.createdAt).toDateString();

  const getStatusColor = () => {
    switch (item.status) {
      case "planned":
        return "#f39c12";
      case "completed":
        return "#28a745";
      case "visited":
        return "#007bff";
      default:
        return "#dc3545";
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Plan", "Are you sure you want to delete this plan?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {} },
    ]);
  };

  return (
    <View style={{ flex: 1,  }}>

      {/* Premium Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Visit Details</Text>
          {/* <Text style={styles.headerSub}>{item.doctorChemist?.name}</Text> */}
        </View>

        <View style={styles.headerActions}>
          {/* <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("CreateVisitScreen", { item })}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={styles.iconBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity> */}
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Doctor Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Doctor Profile</Text>
          <Text style={styles.name}>{item.doctorChemist?.name}</Text>
          <Text style={styles.sub}>{item.doctorChemist?.specialization}</Text>
          <Text style={styles.sub}>📍 {item.doctorChemist?.location}</Text>
          <Text style={styles.sub}>📞 {item.doctorChemist?.phone}</Text>
        </View>

        {/* Visit Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Visit Information</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Visit Date</Text>
            <Text style={styles.value}>{formattedDate}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() },
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Joint Plan</Text>
            <Text style={styles.value}>{item.isJointPlan ? "Yes" : "No"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Joint Employees</Text>
            <Text style={styles.value}>{item.jointEmployees?.length}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Products Focused</Text>
            <Text style={styles.value}>{item.productFocus?.length}</Text>
          </View>
        </View>

        {/* Remark Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Remark</Text>
          <Text style={styles.remark}>
            {item.remark || "No remarks added."}
          </Text>
        </View>

        {/* Meta Info */}
              <View style={[styles.card, { marginBottom: 100 } ]}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Created On</Text>
            <Text style={styles.value}>{createdAt}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Active</Text>
            <Text style={styles.value}>
              {item.isActive ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default VisitDetailsScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#e91e62",
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  headerSub: {
    color: "#dcdcdc",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
  },
  iconBtn: {
    marginLeft: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
      padding: 16,
      
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
    color: "#333",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  sub: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#777",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "700",
  },
  remark: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});
