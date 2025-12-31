import { StyleSheet, Text, TouchableOpacity, View, Alert, ToastAndroid, ScrollView } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { global_styles } from '../shared/style'
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useGetMyTodaysAttendanceQuery, useMarkAttendanceMutation } from '../shared/store/api/attendanceApi';
import { formatDate } from '../shared/services/formateDate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AttendanceSummaryCard from "../shared/componets/AttendanceSummaryCard";
import { useAppSelector } from '../shared/store/hooks';
import AttendanceSkeleton from '../shared/componets/skeletons/AttendanceSkeleton';

// import { locationService } from '../shared/services/locationService';

/**
 * Attendance component that fetches user location and allows them to mark their attendance.
 * Fetches location using Expo's location service and formats the address in a more readable way using Expo's geocoding service.
 * Handles attendance button press and calls markAttendance function.
 * Calls markAttendance function which makes the API call to the attendance server.
 * 
 * 
 * State:
 *   location - Current location of the user.
 *   address - Formatted address based on user location.
 *   locationError - Error message if user denies location permission or if location fetch fails.
 *   isLoading - Boolean indicating if location fetch is in progress.
 *   isGettingAddress - Boolean indicating if address formatting is in progress.
 *   greeting - Morning/afternoon/evening greeting based on current time.
 *   btnText - Text of the attendance button based on whether attendance has been marked.
 *   bottomText - Text below the attendance button indicating whether attendance has been marked.
 *   isDayStarted - Boolean indicating whether attendance has been marked for the day.
 */
export default function Attendance() {
  const { data: myTodaysAttendance, isLoading: isLoadingMyTodaysAttendance, isError, error, isFetching, refetch } = useGetMyTodaysAttendanceQuery();
  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();
  const {name, userId} = useAppSelector((state: { auth: any; }) => state.auth);

  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<string>('');
  const [locationError, setLocationError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  
  // Dynamic states
  const [greeting, setGreeting] = useState("");
  const [btnText, setBtnText] = useState("START DAY");
  const [bottomText, setBottomText] = useState("Check-in for Attendance");
  const [isDayStarted, setIsDayStarted] = useState<boolean>(false);
  const isButtonDisabled = isLoading || myTodaysAttendance?.data?.workEnded;




useEffect(() => {
  const data = myTodaysAttendance?.data;
  if (!data) return;

  if (!data.workStarted) {
    setIsDayStarted(false);
    setBtnText("START DAY");
    setBottomText("Check-in for Attendance");
    return;
  }

  if (data.workStarted && !data.workEnded) {
    setIsDayStarted(true);
    setBtnText("END DAY");
    setBottomText("Check-out for Attendance");
    return;
  }

  // ✅ DAY COMPLETED STATE
  if (data.workEnded) {
    setIsDayStarted(false);
    setBtnText("DAY COMPLETED");
    setBottomText("You have completed your work for today");
  }
}, [
  myTodaysAttendance?.data?.workStarted,
  myTodaysAttendance?.data?.workEnded,
]);



  // -----------

console.log("myTodaysAttendance", myTodaysAttendance?.data);

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning, "+ name);
    else if (hour < 18) setGreeting("Good Afternoon, " + name);
    else setGreeting("Good Evening, " + name);
  }, []);



  // Get detailed address with multiple attempts
  const getDetailedAddress = async (latitude: number, longitude: number) => {
    try {
      // First attempt: Get address with high accuracy
      let addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (addressResponse.length > 0) {
        return formatAddress(addressResponse[0]);
      }

      // Second attempt: Sometimes trying with different parameters helps
      addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
        // Use different parameters for better results
      });

      if (addressResponse.length > 0) {
        return formatAddress(addressResponse[0]);
      }

      return `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

    } catch (error) {
      console.error('Error in detailed address lookup:', error);
      return `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  // Format address in a more readable way
  const formatAddress = (locationInfo: any) => {
    const parts = [];
    
    // Priority 1: Specific location identifiers
    if (locationInfo.name && !locationInfo.name.match(/^\d/)) {
      parts.push(locationInfo.name); // Building name, landmark, etc.
    }
    
    // Priority 2: Street level
    if (locationInfo.street) {
      parts.push(locationInfo.street);
    }
    
    // Priority 3: Area level
    if (locationInfo.district && locationInfo.district !== locationInfo.city) {
      parts.push(locationInfo.district);
    }
    
    // Priority 4: City
    if (locationInfo.city) {
      parts.push(locationInfo.city);
    }
    
    // Priority 5: Region/State
    if (locationInfo.region && locationInfo.region !== locationInfo.city) {
      parts.push(locationInfo.region);
    }
    
    // Priority 6: Postal code
    if (locationInfo.postalCode) {
      parts.push(locationInfo.postalCode);
    }
    
    // Priority 7: Country
    if (locationInfo.country && locationInfo.country !== 'India') { // Adjust based on your country
      parts.push(locationInfo.country);
    }

    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  };

  // Request location permission and get current location
  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setLocationError(null);
      setAddress('');

      // 1. Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        Alert.alert(
          'Location Permission Required',
          'This app needs location access to mark your attendance.',
          [{ text: 'OK' }]
        );
        return null;
      }

      // 2. Get current location
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        // timeInterval: 10000,
      });

      const { latitude, longitude } = currentLocation.coords;
      
      const locationData = {
        latitude,
        longitude,
        coordinates: [longitude, latitude]
      };

      // Update states
      setLocation(locationData);
      console.log('Location:', locationData);

      // !IMPORTANT: Coordinates should be [longitude, latitude], not [latitude, latitude]

      // 3. Get detailed address
      const detailedAddress = await getDetailedAddress(latitude, longitude);
      setAddress(detailedAddress);

      console.log('Location fetched:', { latitude, longitude, address: detailedAddress });
      return locationData;

    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Failed to get your current location');
      Alert.alert('Location Error', 'Could not fetch your location. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  const handleAttendance = async () => {
    try {
      const locationData = await getCurrentLocation();
      if (!locationData) return;

      await markAttendance({
        type: isDayStarted ? "check-out" : "check-in",
        location: {
          coordinates: [locationData.longitude, locationData.latitude],
        },
      }).unwrap();

      ToastAndroid.show(
        isDayStarted ? "Checked out successfully" : "Checked in successfully",
        ToastAndroid.SHORT
      );

      // 🔥 REFRESH backend state
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to mark attendance";
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    }
  };



  // -----------
  
  if (isLoadingMyTodaysAttendance || isFetching) {
    return <AttendanceSkeleton />;
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Failed to load attendance</Text>
      </View>
    );
  }




  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView
        style={[styles.container]}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={styles.greeting}>{greeting}</Text>

        {/* Location Display */}
        {location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={18} color="#4CAF50" />
            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>Current Location</Text>
              {isGettingAddress ? (
                <Text style={styles.addressLoading}>
                  Getting location details...
                </Text>
              ) : (
                <Text style={styles.addressText}>{address}</Text>
              )}
              <Text style={styles.coordinatesText}>
                📍 {location?.latitude?.toFixed(6)},{" "}
                {location?.longitude?.toFixed(6)}
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

        {/* Card */}
        <View style={styles.card}>
          <LinearGradient
            colors={
              myTodaysAttendance?.data?.workEnded
                ? ["#22C55E", "#135029ff"] // ✅ completed (green)
                : isDayStarted
                ? ["#FF6B6B", "#FF8E53"] // ⛔ end day
                : ["#FF416C", "#8A2BE2"] // ▶ start day
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.btnWrapper,
              isButtonDisabled && styles.btnWrapperDisabled,
            ]}
          >
            <TouchableOpacity
              style={styles.btn}
              onPress={handleAttendance}
              disabled={isButtonDisabled}
            >
              {isLoading ? (
                <Ionicons name="refresh" size={20} color="white" />
              ) : (
                <Ionicons
                  name={
                    myTodaysAttendance?.data?.workEnded
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
                {isLoading ? "PROCESSING..." : btnText}
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Bottom Text */}
          <Text style={styles.bottomText}>{bottomText}</Text>
        </View>
        {myTodaysAttendance?.data?.workStarted && (
          <AttendanceSummaryCard
            user={name}
            attendance={myTodaysAttendance.data.attendance}
            workingHours={myTodaysAttendance.data.workingHours}
            workEnded={myTodaysAttendance.data.workEnded}
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
  addressLoading: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#6B7280",
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
});








