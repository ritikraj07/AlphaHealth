import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../screens/Signin";
import { useAppSelector } from "../shared/store/hooks";
import DrawerNavigator from "./DrawerNavigator";


const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
      ) : (
        <Stack.Screen name="SignIn" component={SignIn} />
      )}
    </Stack.Navigator>
  );
}
