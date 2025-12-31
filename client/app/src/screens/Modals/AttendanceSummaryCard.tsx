import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatWorkingHours } from '../../shared/services/formateTime';
import { getAddressFromCoordinates } from "../../shared/services/getAddressFromCods";


interface Props {
  user: string;
  attendance: any;
}

const AttendanceSummaryCard: React.FC<Props> = ({ user, attendance }) => {
  const [startAddress, setStartAddress] = useState<string>("Loading...");
  const [endAddress, setEndAddress] = useState<string>("Loading...");

  useEffect(() => {
    (async () => {
      const start = await getAddressFromCoordinates(
          attendance.startLocation.coordinates[1],
          attendance.startLocation.coordinates[0],
      );
      const end = await getAddressFromCoordinates(
          attendance.startLocation.coordinates[1],
          attendance.startLocation.coordinates[0],
        
      );

      setStartAddress(start);
      setEndAddress(end);
    })();
  }, []);

  const startTime = new Date(attendance.startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = new Date(attendance.endTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Hey {user} 👋</Text>

      <Text style={styles.text}>
        You started working at <Text style={styles.bold}>{startTime}</Text> from
      </Text>

      <Text style={styles.location}>{startAddress}</Text>

      <Text style={styles.text}>
        and ended your work at <Text style={styles.bold}>{endTime}</Text> at
      </Text>

      <Text style={styles.location}>{endAddress}</Text>

      <View style={styles.divider} />

      <Text style={styles.total}>
        🕒 Total working time:{" "}
        <Text style={styles.bold}>
          {formatWorkingHours(attendance.workingHours)}
        </Text>
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    elevation: 4,
    marginTop: 30,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
  },
  location: {
    fontSize: 14,
    color: "#2a7bf6",
    marginTop: 2,
  },
  bold: {
    fontWeight: "600",
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 14,
  },
  total: {
    fontSize: 16,
    fontWeight: "500",
  },
});


export default AttendanceSummaryCard;

