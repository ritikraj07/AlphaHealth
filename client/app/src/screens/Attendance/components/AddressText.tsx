import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";

interface Props {
  coordinates?: [number, number]; // expected: [longitude, latitude]
}

// Shared cache across all instances
const addressCache = new Map<string, string>();

const AddressText = ({ coordinates }: Props) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // ── Validate coordinates ──
    if (!coordinates || coordinates.length !== 2) {
      setAddress("Invalid location data");
      setLoading(false);
      return;
    }

    let [lng, lat] = coordinates;

    // If coordinates look like [latitude, longitude] (lat > 90 or lng > 180), swap them
    if (Math.abs(lat) > 90 && Math.abs(lng) <= 90) {
      [lng, lat] = [lat, lng];
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setAddress("Invalid coordinate values");
      setLoading(false);
      return;
    }

    const key = `${lat},${lng}`;

    // ── Cache hit ──
    if (addressCache.has(key)) {
      setAddress(addressCache.get(key)!);
      setLoading(false);
      return;
    }

    // ── Fetch address (with double attempt) ──
    const fetchAddress = async () => {
      try {
        setLoading(true);

        // First attempt
        let result = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });
        let formatted = `Near ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        if (result.length > 0 && result[0]) {
          formatted = formatAddress(result[0]);
        } else {
          // Second attempt – sometimes the first call returns empty, retry
          result = await Location.reverseGeocodeAsync({
            latitude: lat,
            longitude: lng,
          });
          if (result.length > 0 && result[0]) {
            formatted = formatAddress(result[0]);
          }
        }

        addressCache.set(key, formatted);
        if (isMounted.current) {
          setAddress(formatted);
        }
      } catch (err) {
        console.warn("Reverse geocode failed:", err);
        const fallback = `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        addressCache.set(key, fallback);
        if (isMounted.current) {
          setAddress(fallback);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchAddress();
  }, [coordinates]);

  // ── Render ──
  if (!coordinates || coordinates.length !== 2) {
    return <Text style={styles.address}>No location data</Text>;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#2563EB" />
        <Text style={styles.loadingText}>Fetching address…</Text>
      </View>
    );
  }

  return <Text style={styles.address}>{address}</Text>;
};

// ── Formatting (same as in Attendance) ──
function formatAddress(location: Location.LocationGeocodedAddress) {
  const parts: string[] = [];

  if (location.name && !/^\d/.test(location.name)) {
    parts.push(location.name);
  }
  if (location.street) parts.push(location.street);
  if (location.district && location.district !== location.city)
    parts.push(location.district);
  if (location.city) parts.push(location.city);
  if (location.region && location.region !== location.city)
    parts.push(location.region);
  if (location.postalCode) parts.push(location.postalCode);
  if (location.country && location.country !== "India")
    parts.push(location.country);

  return parts.length ? parts.join(", ") : "Address not available";
}

export default React.memo(AddressText);

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  loadingText: {
    marginLeft: 8,
    color: "#888",
    fontSize: 12,
  },
  address: {
    marginTop: 4,
    color: "#666",
    fontSize: 13,
    lineHeight: 20,
  },
});
