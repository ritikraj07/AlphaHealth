import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGetMyPlansQuery } from "../store/api/planApi";
import { Plan } from "../types/plan.types";
import { NavProp } from "../../navigators";

const PlanCards = () => {
  const navigation = useNavigation<NavProp>();
  const { data: plansData, isLoading, isError } = useGetMyPlansQuery();

  const plans: Plan[] = plansData?.data ?? [];

  // console.log("🚀 ~ file: PlanCard.tsx:17 ~ PlanCards ~ plans:", plans[0]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }



  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Something went wrong.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {plans.length === 0 ? (
        <Text style={styles.noPlan}>No Plans Available</Text>
      ) : (
        plans.map((item) => {
          const formattedDate = item.date
            ? new Date(item.date).toDateString()
            : "No Date";

          const statusText = item.status?.toUpperCase() ?? "UNKNOWN";

          return (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              onPress={() => navigation.navigate("PlanDetailsScreen", {item: item} )}
            >
              <View style={styles.row}>
                <Text style={styles.doctorName}>
                  {item.doctorChemist?.name ?? "No Doctor"}
                </Text>

                <Text style={[styles.statusText, getStatusStyle(item.status)]}>
                  {statusText}
                </Text>
              </View>

              <Text style={styles.date}>{formattedDate}</Text>

              {item.status === "planned" && (
                <TouchableOpacity
                  style={styles.visitBtn}
                  onPress={() =>
                    navigation.navigate("CreateVisitScreen", {
                      planId: item._id,
                      doctorChemistId: item.doctorChemist?._id,
                      jointEmployees: item.jointEmployees ?? [],
                      doctorName: item.doctorChemist?.name ?? "",
                    })
                  }
                >
                  <Text style={styles.visitText}>Start Visit</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

export default PlanCards;

const getStatusStyle = (status?: string) => {
  switch (status) {
    case "planned":
      return { color: "#f39c12" };
    case "visited":
      return { color: "#28a745" };
    default:
      return { color: "#dc3545" };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 120,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPlan: {
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    marginTop: 6,
    color: "#666",
  },
  visitBtn: {
    marginTop: 12,
    backgroundColor: "#28a745",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  visitText: {
    color: "#fff",
    fontWeight: "600",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
