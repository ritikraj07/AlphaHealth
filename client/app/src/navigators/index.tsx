import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../screens/Signin";
import { useAppSelector } from "../shared/store/hooks";
import DrawerNavigator from "./DrawerNavigator";

import EmployeeDetailScreen from "../screens/EmployeeDetailScreen";
import LeaveAppliedScreen from "../screens/LeaveAppliedScreen";



const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen name="Drawer" component={DrawerNavigator} />

          <Stack.Screen
            name="EmployeeDetailScreen"
            component={EmployeeDetailScreen}
          />
          <Stack.Screen
            name="LeaveAppliedScreen"
            component={LeaveAppliedScreen}
          />
        </Stack.Group>
      ) : (
        <Stack.Screen name="SignIn" component={SignIn} />
      )}
    </Stack.Navigator>
  );
}
