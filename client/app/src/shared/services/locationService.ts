// utils/locationService.ts
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
}

export interface LocationError {
  message: string;
  code?: string;
}

class LocationService {
  // Request location permission
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  // Get current location with address
  async getCurrentLocation(): Promise<{ location: LocationData | null; error: LocationError | null }> {
    try {
      // 1. Request permission
      const hasPermission = await this.requestLocationPermission();
      
      if (!hasPermission) {
        return {
          location: null,
          error: { 
            message: 'Permission to access location was denied',
            code: 'PERMISSION_DENIED'
          }
        };
      }

      // 2. Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        // timeout: 15000, // 15 seconds timeout
      });

      const { latitude, longitude } = currentLocation.coords;
      
      const locationData: LocationData = {
        latitude,
        longitude,
        coordinates: [longitude, latitude]
      };

      // 3. Get address
      const address = await this.getAddressFromCoordinates(latitude, longitude);
      if (address) {
        locationData.address = address;
      }

      return { location: locationData, error: null };

    } catch (error) {
      console.error('Error getting location:', error);
      return {
        location: null,
        error: { 
          message: 'Failed to get your current location',
          code: 'LOCATION_ERROR'
        }
      };
    }
  }

  // Get address from coordinates
  async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string | null> {
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (addressResponse.length > 0) {
        return this.formatAddress(addressResponse[0]);
      }
      
      return `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      
    } catch (error) {
      console.error('Error getting address:', error);
      return `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  }

  // Format address in a readable way
  private formatAddress(locationInfo: any): string {
    const parts = [];
    
    // Priority 1: Specific location identifiers
    if (locationInfo.name && !locationInfo.name.match(/^\d/)) {
      parts.push(locationInfo.name);
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

    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  }

  // Show permission alert
  showPermissionAlert(): void {
    Alert.alert(
      'Location Permission Required',
      'This app needs location access to get your current address.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Open Settings',
          onPress: () => {
            // You can use Linking.openSettings() if needed
            console.log('Open settings pressed');
          }
        }
      ]
    );
  }

  // Validate if coordinates are valid
  isValidCoordinates(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180 &&
      !isNaN(latitude) && !isNaN(longitude)
    );
  }

  // Calculate distance between two coordinates (in kilometers)
  calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Export a singleton instance
export const locationService = new LocationService();