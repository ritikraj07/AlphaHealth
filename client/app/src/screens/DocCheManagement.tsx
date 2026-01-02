import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  ToastAndroid,
  RefreshControl,
} from "react-native";

import {
  Ionicons,
  Feather,
  EvilIcons,
  FontAwesome6,
  AntDesign,
} from "@expo/vector-icons";
import AddDoctorChemistModal from "./Modals/AddDocOrChemist";
import { useState } from "react";
import { useGetHeadQuartersQuery } from "../shared/store/api/hqApi";
import DocCheSkeleton from "../shared/componets/skeletons/DocCheSkeleton";

import { useGetDoctorChemistDashboardQuery } from "../shared/store/api/doctorChemistApi";


export default function DocCheManagement() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    data: HQ,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetHeadQuartersQuery({});
  const {
    data: docChemData,
    isLoading: isLoadingDocChem,
    isError: isErrorDocChem,
    error: errorDocChem,
    refetch: refetchDocChem,
    isFetching: isFetchingDocChem,
  } = useGetDoctorChemistDashboardQuery();
  // Mock headquarters data - you would get this from your API
  const headquarters = HQ?.data ?? [];

  

  const handleAddProfessional = (data: any) => {
    //  console.log("New professional:", data);
    // Here you would typically make an API call to save the professional
    ToastAndroid.show("Professional added successfully", ToastAndroid.SHORT);
    setIsModalVisible(false);
  };

  if (isLoading || isLoadingDocChem) {
    return <DocCheSkeleton />;
  }
  

  const { total = 0, doctors = 0, chemists = 0 } = docChemData?.extra ?? {};
  const list = docChemData?.data || [];



  return (
    <ScrollView
      style={[styles.container, { backgroundColor: "rgba(255, 255, 255, 1)" }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
    >
      <AddDoctorChemistModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={handleAddProfessional}
        headquarters={headquarters}
      />
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Doctor & Chemist Management</Text>
          <Text style={styles.subtitle}>
            View and manage doctors and chemists in your network
          </Text>
        </View>

        {/* Apply Leave Button */}
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={styles.applyButton}
          >
            <Text style={[styles.applyButtonText]}>Add Doctor / Chemist</Text>
            {/* <Text style={styles.applyButtonText}>Add Doctor</Text> */}
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: "white" }]}
          >
            <Text style={[styles.applyButtonText, { color: "black" }]}>
              Add Chemist
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Leave Balance Cards */}

      <View style={styles.gridContainer}>
        {/* Sick Leave */}
        <View style={styles.leaveCard}>
          <View style={styles.header}>
            <Text style={styles.leaveName}>Total Doctors</Text>
            <FontAwesome6 name="user-doctor" size={24} color="grey" />
          </View>
          <Text style={styles.leaveCount}>{doctors}</Text>
          <Text style={styles.leaveDescription}>In North HQ</Text>
        </View>

        {/* Casual Leave */}
        <View style={styles.leaveCard}>
          <View style={styles.header}>
            <Text style={styles.leaveName}>Total Chemists</Text>
            <Feather name="shopping-cart" size={24} color="grey" />
          </View>
          <Text style={styles.leaveCount}>{chemists}</Text>
          <Text style={styles.leaveDescription}>In North HQ</Text>
        </View>

        {/* Earned Leave */}
        <View style={styles.leaveCard}>
          <View style={styles.header}>
            <Text style={styles.leaveName}>High Potential</Text>
            <Feather name="star" size={24} color="goldenrod" />
          </View>
          <Text style={styles.leaveCount}>0</Text>
          <Text style={styles.leaveDescription}>Priority targets</Text>
        </View>

        {/* Public Holidays */}
        <View style={styles.leaveCard}>
          <View style={styles.header}>
            <Text style={styles.leaveName}>Avg Frequency</Text>
            <AntDesign name="rise" size={24} color="green" />
          </View>
          <Text style={styles.leaveCount}>0.0</Text>
          <Text style={styles.leaveDescription}>Visits per month</Text>
        </View>
      </View>

      {/* ---------- */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 5,
    paddingBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerContent: {
    width: "60%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
    lineHeight: 22,
  },
  applyButton: {
    backgroundColor: "#e91e62",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "flex-start",
    shadowColor: "#e91e62",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  balanceSection: {
    marginBottom: 30,
    flexDirection: "row",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  leaveCard: {
    borderColor: "#e0e0e0",
    borderWidth: 0.5,
    borderRadius: 12,
    width: "48%",
    marginBottom: 16,
    padding: 16,
    backgroundColor: "white",
  },

  leaveName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  leaveCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 4,
  },
  leaveDescription: {
    fontSize: 12,
    color: "grey",
  },
});
