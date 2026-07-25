import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import SignIn from "../screens/Signin";
import { useAppSelector } from "../shared/store/hooks";
import DrawerNavigator from "./DrawerNavigator";

import EmployeeDetailScreen from "../screens/EmployeeDetailScreen";
import LeaveAppliedScreen from "../screens/LeaveAppliedScreen";
import DoctorChemistListScreen from "../screens/DoctorChemistListScreen";
import DoctorChemistDetailsScreen from "../screens/DoctorChemistDetailsScreen";
import ProductScreen from "../screens/ProductScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import AddProductScreen from "../screens/Products/AddProductScreen";
import EditProductScreen from "../screens/Products/EditProductScreen";
import CreatePlanScreen from "../screens/Plans/CreatePlanScreen";
import CreateVisitScreen from "../screens/Visit/DayPlanScreen";
import PlanDetailsScreen from "../screens/Plans/PlanDetailsScreen";
import CreatePOBScreen from "../screens/POB/CreatePOBScreen";
import AnalyticsDashboard from "../screens/Analytics/AnalyticsDashboard";
import NotificationPermission from "../screens/NotificationPermission";
import SettingsScreen from "../screens/settings/Setting";
import ChangePasswordScreen from "../screens/settings/ChangePassword";
import ForgotPasswordScreen from "../screens/ForgotPassword";

export type RootStackParamList = {
  navigate(arg0: string): void;
  SignIn: undefined;
  Drawer: undefined;
  EmployeeDetailScreen: { params: any } | { id: string } | undefined;
  LeaveAppliedScreen: undefined;
  DoctorChemistListScreen: undefined;
  DoctorChemistDetailsScreen: { item: any };
  EditDoctorChemist: { item: any };
  ProductScreen: undefined;
  ProductDetailScreen: { product: any } | undefined;
  EditProductScreen: { product: any };
  AddProductScreen: undefined;
  CreatePlanScreen: undefined;
  CreateVisitScreen: { item: any } | undefined;
  PlanDetailsScreen: { item: any };
  CreatePOBScreen: undefined;
  AnalyticsDashboard: undefined | { item: any };
  NotificationPermission: undefined;
  SettingsScreen: undefined | { item: any };
  ChangePasswordScreen: undefined | { item: any };
  ForgotPasswordScreen: undefined | { item: any };
};

// export type NavProp = RootStackParamList;

const Stack = createNativeStackNavigator<RootStackParamList>();

export type NavProp = NativeStackNavigationProp<RootStackParamList>;

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

          <Stack.Screen
            name="DoctorChemistListScreen"
            component={DoctorChemistListScreen}
          />
          <Stack.Screen
            name="DoctorChemistDetailsScreen"
            component={DoctorChemistDetailsScreen}
          />
          <Stack.Screen name="ProductScreen" component={ProductScreen} />
          <Stack.Screen
            name="ProductDetailScreen"
            component={ProductDetailScreen}
          />
          <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
          <Stack.Screen
            name="EditProductScreen"
            component={EditProductScreen}
          />
          <Stack.Screen name="CreatePlanScreen" component={CreatePlanScreen} />
          <Stack.Screen
            name="CreateVisitScreen"
            component={CreateVisitScreen}
          />
          <Stack.Screen
            name="PlanDetailsScreen"
            component={PlanDetailsScreen}
          />
          <Stack.Screen name="CreatePOBScreen" component={CreatePOBScreen} />
          <Stack.Screen
            name="AnalyticsDashboard"
            component={AnalyticsDashboard}
          />
          <Stack.Screen
            name="NotificationPermission"
            component={NotificationPermission}
          />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
            <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

