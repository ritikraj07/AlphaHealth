import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import Attendance from "../screens/Attendance";
// import Dashboard from "../screens/Dashboard";
import DocCheMan from "../screens/DocCheManagement";
import LeaveMana from "../screens/LeaveManagement";
import POB from "../screens/POB";
import ReportsAnalytics from "../screens/ReportsAnalytics";
import SignIn from "../screens/Signin";
import Navbar from "../shared/componets/Navbar";
import { View } from "react-native";

import AdminDashboard from "../screens/Dashboards/AdminDashboard";
import EmployeeDashboard from "../screens/Dashboards/EmployeeDashboard";
import { useAppSelector } from "../shared/store/hooks";


const Tab = createBottomTabNavigator();

/**
 * Bottom navigation tabs for the application
 * 
 * @param {object} user - User object with role, either "admin" or "employee"
 * @returns {JSX.Element} Bottom navigation tabs component
 */
const BottomTabs = () => {
  const role = useAppSelector((state) => state.auth.role);
  // console.info("Current User--->", role);
  

  
  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <Navbar />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#e91e62", // Blue active color
          tabBarInactiveTintColor: "#8E8E93", // Gray inactive color
          headerShown: false,

          tabBarStyle: {
            backgroundColor: "#fffffff3",
            borderTopWidth: 0,

            ...(role === "admin"
              ? {
                  height: 70,
                  marginHorizontal: 16,
                  // marginBottom: 12,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  // borderRadius: 24,
                  elevation: 12,
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                position: "absolute",
                bottom: 0,
                  
                }
              : {
                  height: 80,
                  borderTopWidth: 1,
                  borderTopColor: "#E5E5E5",
                  elevation: 0,
                  shadowOpacity: 0,
                }),
          },
          tabBarLabelStyle: {
            fontSize: role === "admin" ? 10 : 9,
            fontWeight: "500",
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={role === "admin" ? AdminDashboard : EmployeeDashboard}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        {role !== "admin" && (
          <Tab.Screen
            name="Attendance"
            component={Attendance}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "calendar" : "calendar-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        )}
        <Tab.Screen
          name="Doctor"
          component={DocCheMan}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <FontAwesome6
                name={focused ? "user-doctor" : "user-doctor"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        {role !== "admin" && (
          <Tab.Screen
            name="Leave"
            component={LeaveMana}
            options={{
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? "airplane" : "airplane-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        )}

        <Tab.Screen
          name="POB"
          component={POB}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "briefcase" : "briefcase-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Reports"
          component={ReportsAnalytics}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "bar-chart" : "bar-chart-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};



export default BottomTabs;