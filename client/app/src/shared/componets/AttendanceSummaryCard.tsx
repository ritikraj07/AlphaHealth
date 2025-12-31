import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getAddressFromCoordinates } from "../../shared/services/getAddressFromCods";


interface Props {
  user: string;
  attendance: any;
  workingHours: string;
  workEnded: boolean;
}


const AttendanceSummaryCard: React.FC<Props> = ({
  user,
  attendance,
  workingHours,
  workEnded,
}) => {
  const [startAddress, setStartAddress] = useState("Loading...");
  const [endAddress, setEndAddress] = useState("—");

  useEffect(() => {
    (async () => {
      if (attendance?.startLocation?.coordinates?.length) {
        const start = await getAddressFromCoordinates(
          attendance.startLocation.coordinates[1],
          attendance.startLocation.coordinates[0]
        );
        setStartAddress(start);
      }

      if (workEnded && attendance?.endLocation?.coordinates?.length) {
        const end = await getAddressFromCoordinates(
          attendance.endLocation.coordinates[1],
          attendance.endLocation.coordinates[0]
        );
        setEndAddress(end);
      }
    })();
  }, [attendance, workEnded]);

 const startTime = attendance?.startTime
   ? new Date(attendance.startTime).toLocaleTimeString([], {
       hour: "2-digit",
       minute: "2-digit",
     })
   : "--:--";

 const endTime =
   workEnded && attendance?.endTime
     ? new Date(attendance.endTime).toLocaleTimeString([], {
         hour: "2-digit",
         minute: "2-digit",
       })
     : "In progress";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Hey {user} 👋</Text>

      <Text style={styles.text}>
        You started working at <Text style={styles.bold}>{startTime}</Text> from
      </Text>
      <Text style={styles.location}>{startAddress}</Text>

      <Text style={styles.text}>
        {workEnded
          ? "and ended your work at "
          : "Work is still going on since "}
        <Text style={styles.bold}>{endTime}</Text>
      </Text>

      {workEnded && <Text style={styles.location}>{endAddress}</Text>}

      <View style={styles.divider} />

      <Text style={styles.total}>
        🕒 Total working time: <Text style={styles.bold}>{workingHours}</Text>
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

