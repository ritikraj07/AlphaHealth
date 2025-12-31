import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'

import { Ionicons, Feather, EvilIcons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { RefreshControl } from 'react-native-gesture-handler';

/**
 * ReportsAnalytics screen
 * 
 * This screen allows employees to view their performance and customer coverage metrics.
 * 
 * It displays the number of days worked, calls completed, and average call duration for each doctor.
 * 
 * It also displays the doctor coverage rate and the target frequency for each doctor.
 * 
 * The screen also shows the average coverage rate for all doctors, as well as the number of doctors with low coverage rates.
 */
export default function ReportsAnalytics() {


  return (
    <ScrollView
      style={[styles.container, { backgroundColor: "white" }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={() => {}} />
      }
    >
      {/* Header Section */}
      <View
        style={[
          styles.header,
          {
            flexDirection: "column",
            alignItems: "flex-start",
            marginBottom: 0,
          },
        ]}
      >
        <Text style={styles.title}>Reports & Analytics</Text>
        <Text style={styles.subtitle}>
          Track your performance and customer coverage metrics
        </Text>
      </View>

      <View style={styles.gridContainer}>
        {/* Days Worked */}
        <View style={styles.leaveCard}>
          <View style={styles.header}>
            <Text style={styles.leaveName}>Days Worked</Text>
            <Feather name="calendar" size={24} color="grey" />
          </View>
          <Text style={styles.leaveCount}>0</Text>
          <Text style={styles.leaveDescription}>0% of working days</Text>
        </View>

        {/* Calls Completed */}
        <View style={styles.leaveCard}>
          <View style={styles.header}>
            <Text style={styles.leaveName}>Calls Completed</Text>
            <Feather name="users" size={24} color="lightblue" />
          </View>
          <Text style={styles.leaveCount}>0</Text>
          <Text style={styles.leaveDescription}>Avg: 0.0 per day</Text>
        </View>

        {/* Earned Leave */}
        <View style={styles.leaveCard}>
          <View style={styles.header}>
            <Text style={styles.leaveName}>POB Value</Text>
            <Feather name="dollar-sign" size={24} color="green" />
          </View>
          <Text style={styles.leaveCount}>₹ 0</Text>
          <Text style={styles.leaveDescription}>0 orders</Text>
        </View>

        {/* Coverage */}
        <View style={styles.leaveCard}>
          <View style={styles.header}>
            <Text style={styles.leaveName}>Coverage</Text>
            <Ionicons name="filter-circle-outline" size={24} color="blue" />
          </View>
          <Text style={styles.leaveCount}>0%</Text>
          <Text style={styles.leaveDescription}>Doctor coverage rate</Text>
        </View>
      </View>

      {/* ---------- */}
      {/* Doctor Coverage Analysis card */}

      <View style={[styles.leaveCard, { width: "100%" }]}>
        <View style={[styles.cardHeader]}>
          <Ionicons name="filter-circle-outline" size={24} color="black" />
          <Text style={[styles.title, { fontSize: 20 }]}>
            Doctor Coverage Analysis
          </Text>
        </View>
        <Text style={styles.subtitle}>
          Coverage vs target frequency for each doctor
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "700", marginRight: 10 }}>
              Dr. Smith
            </Text>
            <Text
              style={{
                backgroundColor: "deepskyblue",
                paddingHorizontal: 2,
                color: "white",
                borderRadius: 5,
              }}
            >
              high
            </Text>
          </View>
          <Text>0/4 calls</Text>
        </View>

        <View
          style={{
            width: "100%",
            height: 5,
            backgroundColor: "pink",
            marginVertical: 10,
            borderRadius: 5,
          }}
        ></View>
        <Text>0% coverage</Text>
      </View>

      {/* Performance Summary Card */}

      <View style={[styles.leaveCard, { width: "100%" }]}>
        <View style={[styles.cardHeader]}>
          <Ionicons name="medal-outline" size={24} color="black" />
          <Text style={[styles.title, { fontSize: 20 }]}>
            Performance Summary
          </Text>
        </View>
        <Text style={styles.subtitle}>
          Key achievements and areas for improvement
        </Text>

        <Text style={{ color: "green", fontWeight: "700", marginBottom: 20 }}>
          Achievements
        </Text>

        <Text style={{ color: "rgb(247,120,72)", fontWeight: "700" }}>
          Areas for Improvement
        </Text>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="time-outline" size={20} color="rgb(247,120,72)" />
            <Text style={styles.keyPoints}>
              Focus on high-potential doctors (0% covered)
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="time-outline" size={20} color="rgb(247,120,72)" />
            <Text style={styles.keyPoints}>Increase daily call frequency</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="time-outline" size={20} color="rgb(247,120,72)" />
            <Text style={styles.keyPoints}>Generate more purchase orders</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="time-outline" size={20} color="rgb(247,120,72)" />
            <Text style={styles.keyPoints}>
              Improve overall doctor coverage
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,

  },
  header: {
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 5,
    flexDirection:"row", 
    justifyContent: 'flex-start',
  },
 
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    
  },
  subtitle: {
    fontSize: 14,
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
  balanceSection: {
    marginBottom: 30,
    flexDirection:"row"
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  keyPoints:{
    fontSize:14,
    fontWeight:"300",
    marginLeft:4
    
  }

})