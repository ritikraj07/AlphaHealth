import { StyleSheet, Text, TouchableOpacity, View, Alert, ToastAndroid } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { global_styles } from '../shared/style'
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useMarkAttendanceMutation } from '../shared/store/api/attendanceApi';

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
    const [markAttendance, { isLoading: isMarking }] =
      useMarkAttendanceMutation();

  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<string>('');
  const [locationError, setLocationError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  
  // Dynamic states
  const [greeting, setGreeting] = useState("");
  const [btnText, setBtnText] = useState("START DAY");
  const [bottomText, setBottomText] = useState("Check-in for Attendance");
  const [isDayStarted, setIsDayStarted] = useState(false);



  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning, Super!");
    else if (hour < 18) setGreeting("Good Afternoon, Super!");
    else setGreeting("Good Evening, Super!");
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
      // i want to mark attendance in server after getting location
      // markAttendance(locationData); 
      // how to do this

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

  // Handle attendance button press
 const handleAttendance = async () => {
   try {
     const locationData = await getCurrentLocation();

     if (!locationData) {
       return;
     }
     console.log("Location data:", locationData);

     // IMPORTANT: Coordinates should be [longitude, latitude], not [latitude, longitude]
     const result = await markAttendance({
       type: "check-in",
       location: {
         coordinates: [locationData.longitude, locationData.latitude], // Fix the order
       },
     }).unwrap();

     console.log("Attendance result:", result);

     // result is the entire response object
     if (result.success) {
       ToastAndroid.show(result.message, ToastAndroid.SHORT);
     } else {

       ToastAndroid.show(result.message || "Unknown error", ToastAndroid.SHORT);
     }
   } catch (error: any) {
     console.error("Error marking attendance:", error);

     // Handle error from unwrap()
     const errorMessage =
       error?.data?.message || error?.message || "Failed to mark attendance";
     ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
   }
 };



  return (
    <View style={global_styles.container}>
      {/* Greeting */}
      <Text style={styles.greeting}>{greeting}</Text>

      {/* Location Display */}
      {location && (
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={18} color="#4CAF50" />
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Current Location</Text>
            {isGettingAddress ? (
              <Text style={styles.addressLoading}>Getting location details...</Text>
            ) : (
              <Text style={styles.addressText}>
                {address}
              </Text>
            )}
            <Text style={styles.coordinatesText}>
              📍 {location?.latitude?.toFixed(6)}, {location?.longitude?.toFixed(6)}
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
          colors={isDayStarted ? ['#FF6B6B', '#FF8E53'] : ['#FF416C', '#8A2BE2']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btnWrapper}
        >
          <TouchableOpacity 
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={handleAttendance}
            disabled={isLoading}
          >
            {isLoading ? (
              <Ionicons name="refresh" size={20} color="white" />
            ) : (
              <Ionicons 
                name={isDayStarted ? "stop-outline" : "play-outline"} 
                size={22} 
                color="white" 
              />
            )}
            <Text style={styles.btnText}>
              {isLoading ? 'PROCESSING...' : btnText}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Bottom Text */}
        <Text style={styles.bottomText}>{bottomText}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#BDE0FE',
  },
  addressContainer: {
    flex: 1,
    marginLeft: 12,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
    lineHeight: 20,
  },
  addressLoading: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6B7280',
    lineHeight: 20,
  },
  coordinatesText: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#DC2626'
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
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16
  },
  bottomText: {
    marginTop: 10,
    fontSize: 13,
    color: "#666",
  }
});








