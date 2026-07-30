import { 
  StyleSheet, Text, TouchableOpacity, View, Alert, ToastAndroid, 
  ScrollView, RefreshControl 
} from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useGetMyTodaysAttendanceQuery, useMarkAttendanceMutation } from '../shared/store/api/attendanceApi';
import AttendanceSummaryCard from "../shared/componets/AttendanceSummaryCard";
import { useAppSelector } from '../shared/store/hooks';
import AttendanceSkeleton from '../shared/componets/skeletons/AttendanceSkeleton';

// Mapping for disabled statuses
const DISABLED_STATUSES = ["absent", "leave", "holiday"];
const STATUS_MESSAGES = {
  absent: {
    title: "You were marked absent today",
    subtext: "Please contact your manager if this is a mistake.",
    icon: "ban-outline",
    color: "#EF4444",
  },
  leave: {
    title: "You are on leave today",
    subtext: "Enjoy your day off!",
    icon: "bed-outline",
    color: "#F59E0B",
  },
  holiday: {
    title: "Today is a holiday",
    subtext: "No attendance required.",
    icon: "gift-outline",
    color: "#3B82F6",
  },
};

export default function Attendance() {
  const { data: myTodaysAttendance, isLoading: isLoadingMyTodaysAttendance, isError, isFetching, refetch } = useGetMyTodaysAttendanceQuery();
  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();
  const { name } = useAppSelector((state: { auth: any; }) => state.auth);

  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<string>('');
  const [locationError, setLocationError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // UI states
  const [greeting, setGreeting] = useState("");
  const [btnText, setBtnText] = useState("START DAY");
  const [bottomText, setBottomText] = useState("Check-in for Attendance");
  const [isDayStarted, setIsDayStarted] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);

  const attendanceData = myTodaysAttendance?.data;
  const currentStatus = attendanceData?.attendance?.status;
  const isDisabledStatus = currentStatus ? DISABLED_STATUSES.includes(currentStatus) : false;

  // ── Update UI based on status ──
  useEffect(() => {
    if (!attendanceData) return;
    setStatus(currentStatus || null);

    if (isDisabledStatus) {
      setIsDayStarted(false);
      return;
    }

    if (!attendanceData.workStarted) {
      setIsDayStarted(false);
      setBtnText("START DAY");
      setBottomText("Check-in for Attendance");
    } else if (attendanceData.workStarted && !attendanceData.workEnded) {
      setIsDayStarted(true);
      setBtnText("END DAY");
      setBottomText("Check-out for Attendance");
    } else if (attendanceData.workEnded) {
      setIsDayStarted(false);
      setBtnText("DAY COMPLETED");
      setBottomText("You have completed your work for today");
    }
  }, [attendanceData, currentStatus, isDisabledStatus]);

  // ── Greeting ──
  useEffect(() => {
    const hour = new Date().getHours();
    let prefix = "Good Morning";
    if (hour >= 12 && hour < 18) prefix = "Good Afternoon";
    else if (hour >= 18) prefix = "Good Evening";
    setGreeting(`${prefix}, ${name}`);
  }, [name]);

  // ── Location helpers (unchanged) ──
  const getDetailedAddress = async (latitude: number, longitude: number) => {
    try {
      let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addressResponse.length > 0) return formatAddress(addressResponse[0]);
      addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addressResponse.length > 0) return formatAddress(addressResponse[0]);
      return `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch {
      return `📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const formatAddress = (locationInfo: any) => {
    const parts = [];
    if (locationInfo.name && !/^\d/.test(locationInfo.name)) parts.push(locationInfo.name);
    if (locationInfo.street) parts.push(locationInfo.street);
    if (locationInfo.district && locationInfo.district !== locationInfo.city) parts.push(locationInfo.district);
    if (locationInfo.city) parts.push(locationInfo.city);
    if (locationInfo.region && locationInfo.region !== locationInfo.city) parts.push(locationInfo.region);
    if (locationInfo.postalCode) parts.push(locationInfo.postalCode);
    if (locationInfo.country && locationInfo.country !== 'India') parts.push(locationInfo.country);
    return parts.length ? parts.join(', ') : 'Address not available';
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setLocationError(null);
      setAddress('');

      const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
      if (permStatus !== 'granted') {
        setLocationError('Location permission denied');
        Alert.alert('Permission Required', 'We need location to mark attendance.');
        return null;
      }

      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
      const { latitude, longitude } = coords;
      const locationData = { latitude, longitude, coordinates: [longitude, latitude] };
      setLocation(locationData);

      const detailedAddress = await getDetailedAddress(latitude, longitude);
      setAddress(detailedAddress);

      return locationData;
    } catch (error) {
      console.error('Location error:', error);
      setLocationError('Failed to get location');
      Alert.alert('Location Error', 'Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Handle attendance ──
  const handleAttendance = async () => {
    if (isDisabledStatus) return;

    const locationData = await getCurrentLocation();
    if (!locationData) return;

    try {
      await markAttendance({
        type: isDayStarted ? "check-out" : "check-in",
        location: { coordinates: [locationData.longitude, locationData.latitude] },
      }).unwrap();

      ToastAndroid.show(
        isDayStarted ? "Checked out successfully" : "Checked in successfully",
        ToastAndroid.SHORT
      );
      refetch();
    } catch (error: any) {
      const msg = error?.data?.message || error?.message || "Failed to mark attendance";
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };

  // ── Loading / Error ──
  if (isLoadingMyTodaysAttendance) return <AttendanceSkeleton />;
  if (isError) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Failed to load attendance</Text>
    </View>
  );

  const isButtonDisabled = isLoading || isMarking || isDisabledStatus || attendanceData?.workEnded;
  const statusInfo = status ? STATUS_MESSAGES[status as keyof typeof STATUS_MESSAGES] : null;

  // ── Render ──
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView
        style={[styles.container]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}          // becomes true when refetch() is called
            onRefresh={refetch}              // triggers the query refetch
            colors={["#2563EB"]}             // Android
            tintColor="#2563EB"              // iOS
            title="Pull to refresh"          // optional
          />
        }
      >
        <Text style={styles.greeting}>{greeting}</Text>

        {/* Location display */}
        {location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={18} color="#4CAF50" />
            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>Current Location</Text>
              <Text style={styles.addressText}>{address}</Text>
              <Text style={styles.coordinatesText}>
                📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        )}

        {locationError && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color="#FF6B6B" />
            <Text style={styles.errorText}>{locationError}</Text>
          </View>
        )}

        {/* Attendance Card */}
        <View style={styles.card}>
          {isDisabledStatus && statusInfo ? (
            <View style={styles.disabledContainer}>
              <Ionicons name={statusInfo.icon as any} size={48} color={statusInfo.color} />
              <Text style={[styles.disabledTitle, { color: statusInfo.color }]}>
                {statusInfo.title}
              </Text>
              <Text style={styles.disabledSubtext}>{statusInfo.subtext}</Text>
            </View>
          ) : (
            <>
              <LinearGradient
                colors={
                  attendanceData?.workEnded
                    ? ["#22C55E", "#135029ff"]
                    : isDayStarted
                    ? ["#FF6B6B", "#FF8E53"]
                    : ["#FF416C", "#8A2BE2"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.btnWrapper, isButtonDisabled && styles.btnWrapperDisabled]}
              >
                <TouchableOpacity
                  style={styles.btn}
                  onPress={handleAttendance}
                  disabled={isButtonDisabled}
                >
                  {isLoading || isMarking ? (
                    <Ionicons name="refresh" size={20} color="white" />
                  ) : (
                    <Ionicons
                      name={
                        attendanceData?.workEnded
                          ? "checkmark-circle-outline"
                          : isDayStarted
                          ? "stop-outline"
                          : "play-outline"
                      }
                      size={22}
                      color="white"
                    />
                  )}
                  <Text style={styles.btnText}>
                    {isLoading || isMarking ? "PROCESSING..." : btnText}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
              <Text style={styles.bottomText}>{bottomText}</Text>
            </>
          )}
        </View>

        {/* Summary card (only for "present" status) */}
        {!isDisabledStatus && attendanceData?.workStarted && (
          <AttendanceSummaryCard
            user={name}
            attendance={attendanceData.attendance}
            workingHours={attendanceData.workingHours}
            workEnded={attendanceData.workEnded}
            // status={status}
          />
        )}
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0F9FF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#BDE0FE",
  },
  addressContainer: {
    flex: 1,
    marginLeft: 12,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  addressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E40AF",
    lineHeight: 20,
  },
  coordinatesText: {
    fontSize: 11,
    color: "#6B7280",
    fontStyle: "italic",
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#DC2626",
  },
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },
  btnWrapperDisabled: {
    opacity: 0.6,
  },
  btnWrapper: {
    borderRadius: 10,
    width: "85%",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  bottomText: {
    marginTop: 10,
    fontSize: 13,
    color: "#666",
  },
  disabledContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  disabledTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },
  disabledSubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },
});
