import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import Attendance from "../screens/Attendance";
import Dashboard from "../screens/Dashboard";
import DocCheMan from "../screens/DocCheManagement";
import LeaveMana from "../screens/LeaveManagement";
import POB from "../screens/POB";
import ReportsAnalytics from "../screens/ReportsAnalytics";
import SignIn from "../screens/Signin";
import Navbar from "../shared/componets/Navbar";
import { View } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
   <View style={{flex:1}} >
    <Navbar />
     <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#d78fceff", // Blue active color
        tabBarInactiveTintColor: "#8E8E93", // Gray inactive color
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          height: 80,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: "#E5E5E5",
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "500",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        }
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard}
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
      <Tab.Screen 
        name="Doctor" 
        component={DocCheMan}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "medical" : "medical-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
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

export default function Navigation() {
  return (
    <Stack.Navigator 
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* SignIn as first screen */}
      <Stack.Screen 
        name="SignIn" 
        component={SignIn}
      />
      {/* Bottom tabs after sign in */}
      <Stack.Screen 
        name="Main" 
        component={BottomTabs}
      />
    </Stack.Navigator>
  );
}