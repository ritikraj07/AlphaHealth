
import * as Location from 'expo-location';
export const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
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
