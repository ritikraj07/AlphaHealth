import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Linking,
  Alert,
  ToastAndroid,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { useAppSelector } from "../shared/store/hooks";
import { MaterialIcons } from "@expo/vector-icons";
import { useApproveDoctorChemistMutation } from "../shared/store/api/doctorChemistApi";


const DoctorChemistDetailsScreen = () => {
  const route = useRoute<any>();
    const item = route.params.item;
    console.log(item);

  const { role } = useAppSelector((state) => state.auth);
    const isAdmin = role === "admin";
    
    const [approveChemist, { isLoading }] = useApproveDoctorChemistMutation();

  // 🔥 Slide Animation
  const slideAnim = useRef(new Animated.Value(50)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const openDialer = () => {
    if (item.phone) {
      Linking.openURL(`tel:${item.phone}`);
    }
  };

  const openWhatsApp = () => {
    if (item.phone) {
      Linking.openURL(`https://wa.me/${item.phone}`);
    }
  };

  const openMap = () => {
    if (item.location) {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${item.location}`,
      );
    }
    };
    

  

  const handleApprove = () => {
    Alert.alert(
      "Approve Entry",
      `Are you sure you want to approve ${item.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Approve",
          onPress: async () => {
            try {
                let response = await approveChemist({doctorChemistId: item._id}).unwrap();
                console.log(response);

              ToastAndroid.show("Approved successfully ✅", ToastAndroid.SHORT);
            } catch (error) {
                ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
                console.log(error)
            }
          },
        },
      ],
    );
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      <Animated.ScrollView
        style={{
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* 🏥 Header Section */}
        <View style={styles.header}>
          <MaterialIcons
            name={
              item.type === "doctor" ? "medical-services" : "local-pharmacy"
            }
            size={28}
            color="#e91e62"
          />
          <Text style={styles.name}>{item.name}</Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: item.isApproved ? "#dcfce7" : "#fee2e2",
              },
            ]}
          >
            <Text
              style={{
                color: item.isApproved ? "#16a34a" : "#dc2626",
                fontWeight: "600",
              }}
            >
              {item.isApproved ? "Approved" : "Pending Approval"}
            </Text>
          </View>
        </View>

        {/* 📄 Info Card */}
        <View style={styles.card}>
          <Detail icon="business" label="HQ" value={item.hq?.name} />
          <Detail
            icon="person"
            label="Added By"
            value={item.addedBy?.id?.name}
          />
          <Detail icon="email" label="Email" value={item.email} />
          <Detail icon="place" label="Location" value={item.location} />
          <Detail icon="insights" label="Potential" value={item.potential} />
          <Detail
            icon="category"
            label="Specialization"
            value={item.specialization}
          />
        </View>

        {/* ⚡ Quick Actions */}
        <View style={styles.quickActions}>
          <ActionButton icon="call" label="Call" onPress={openDialer} />
          <ActionButton icon="chat" label="WhatsApp" onPress={openWhatsApp} />
          <ActionButton icon="map" label="Map" onPress={openMap} />
        </View>
      </Animated.ScrollView>

      {/* ✅ Sticky Approve Button */}
      {isAdmin && !item.isApproved && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.approveBtn} onPress={handleApprove} >
                      <Text style={styles.approveText}>Approve {item.type.charAt(0).toUpperCase() + item.type.slice(1) }</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const Detail = ({ icon, label, value }: any) => (
  <View style={styles.row}>
    <MaterialIcons name={icon} size={20} color="#64748b" />
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "N/A"}</Text>
    </View>
  </View>
);

const ActionButton = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <MaterialIcons name={icon} size={22} color="#e91e62" />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

export default DoctorChemistDetailsScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    elevation: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  statusBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    marginBottom: 18,
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#94a3b8",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginTop: 10,
  },
  actionBtn: {
    alignItems: "center",
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
    elevation: 10,
  },
  approveBtn: {
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  approveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
