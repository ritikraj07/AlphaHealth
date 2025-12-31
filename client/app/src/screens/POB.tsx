import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { Ionicons, Feather, EvilIcons } from "@expo/vector-icons";
import { RefreshControl } from 'react-native-gesture-handler';


// Doctors Component
const DoctorsCard = () => {
  return (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>Doctors</Text>
        <Ionicons name="medical" size={24} color="#007AFF" />
      </View>
      <Text style={styles.categoryCount}>0</Text>
      <Text style={styles.categoryLabel}>Total orders</Text>
      <Text style={styles.categoryValue}>Value: ₹0</Text>
    </View>
  );
};

// Chemists Component
const ChemistsCard = () => {
  return (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>Chemists</Text>
        <Ionicons name="flask" size={24} color="#34C759" />
      </View>
      <Text style={styles.categoryCount}>0</Text>
      <Text style={styles.categoryLabel}>Total orders</Text>
      <Text style={styles.categoryValue}>Value: ₹0</Text>
    </View>
  );
};

// Hospitals Component
const HospitalsCard = () => {
  return (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>Hospitals</Text>
        <Ionicons name="business" size={24} color="#FF9500" />
      </View>
      <Text style={styles.categoryCount}>0</Text>
      <Text style={styles.categoryLabel}>Total orders</Text>
      <Text style={styles.categoryValue}>Value: ₹0</Text>
    </View>
  );
};



/**
 * Manage purchase orders from doctors, chemists, and hospitals
 * @returns {JSX.Element}
 */
export default function POB() {
  return (
    <ScrollView style={[styles.container]}
      showsVerticalScrollIndicator={false}
      refreshControl={
              <RefreshControl refreshing={false} onRefresh={() => {}} />
            }
     >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent} >
            <Text style={styles.title}>Purchase Order Booking (POB)</Text>
        <Text style={styles.subtitle}>Manage purchase orders from doctors, chemists, and hospitals</Text>
        </View>
        
        {/* Apply Leave Button */}
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Create POB</Text>
        </TouchableOpacity>
      </View>

      {/* Category Cards Section - Doctors, Chemists, Hospitals */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>Purchase Overview</Text>
        <View style={styles.categoryGrid}>
          <DoctorsCard />
          <ChemistsCard />
          <HospitalsCard />
        </View>
      </View>

      {/* Leave Balance Cards */}
      <View style={styles.gridContainer}>
        {/* This Month */}
        <View style={styles.leaveCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.leaveName}>This Month</Text>
            <EvilIcons name="heart" size={24} color="red" />
          </View>
          <Text style={styles.leaveCount}>5</Text>
          <Text style={styles.leaveDescription}>out of 5 remaining</Text>
        </View>

        {/* Monthly Value*/}
        <View style={styles.leaveCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.leaveName}>Monthly Value</Text>
            <Feather name="coffee" size={24} color="blue" />
          </View>
          <Text style={styles.leaveCount}>5</Text>
          <Text style={styles.leaveDescription}>out of 5 remaining</Text>
        </View>

        {/* Pending */}
        <View style={styles.leaveCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.leaveName}>Pending</Text>
            <Feather name="gift" size={24} color="green" />
          </View>
          <Text style={styles.leaveCount}>10</Text>
          <Text style={styles.leaveDescription}>out of 10 remaining</Text>
        </View>

        {/*Total Value */}
        <View style={styles.leaveCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.leaveName}>Total Value</Text>
            <Feather name="calendar" size={24} color="orange" />
          </View>
          <Text style={styles.leaveCount}>10</Text>
          <Text style={styles.leaveDescription}>fixed allocation</Text>
        </View>
      </View>

      {/* Leave History Section */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Purchase Order History</Text>
        <Text style={styles.historySubtitle}>Your recent purchase order bookings</Text>
        
        {/* Empty State */}
        <View style={styles.emptyState}>
          <Feather name="shopping-cart" size={50} color="grey" />
          <Text style={styles.emptyStateText}>No purchase orders yet</Text>
          <Text style={styles.emptyStateText}>Click "Create POB" to add your first order</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 5,
    paddingBottom: 30,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  headerContent:{
    width:'60%'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    lineHeight: 22,
  },
  applyButton: {
    backgroundColor: '#e91e62',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
    shadowColor: '#e91e62',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Category Cards Styles
  categorySection: {
    marginBottom: 30,
  },
  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  categoryCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  categoryValue: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  // Existing styles with fix for header conflict
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  leaveCard: {
    borderColor: '#e0e0e0',
    borderWidth: 0.5,
    borderRadius: 12,
    width: '48%', 
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leaveName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  leaveCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  leaveDescription: {
    fontSize: 12,
    color: 'grey',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  historySection: {
    marginBottom: 40,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    borderWidth: 0.1,
    borderColor: 'grey',
  },
  historySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
})