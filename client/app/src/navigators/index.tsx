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
import CreateVisitScreen from "../screens/Visit/CreateVisitScreen";
import PlanDetailsScreen from "../screens/Plans/PlanDetailsScreen";
import CreatePOBScreen from "../screens/POB/CreatePOBScreen";


export type RootStackParamList = {
  navigate(arg0: string): void;
  SignIn: undefined;
  Drawer: undefined;
  EmployeeDetailScreen: undefined;
  LeaveAppliedScreen: undefined;
  DoctorChemistListScreen: undefined;
  DoctorChemistDetailsScreen: { item: any };
  EditDoctorChemist: { item: any };
  ProductScreen: undefined;
  ProductDetailScreen: { product: any } | undefined;
  EditProductScreen: { product: any };
  AddProductScreen: undefined;
  CreatePlanScreen: undefined;
  CreateVisitScreen: { item: any };
  PlanDetailsScreen: { item: any };
  CreatePOBScreen: undefined;
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
          <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
          <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
          <Stack.Screen name="EditProductScreen" component={EditProductScreen} />
          <Stack.Screen name="CreatePlanScreen" component={CreatePlanScreen} />
          <Stack.Screen name="CreateVisitScreen" component={CreateVisitScreen} />
          <Stack.Screen name="PlanDetailsScreen" component={PlanDetailsScreen} />
          <Stack.Screen name="CreatePOBScreen" component={CreatePOBScreen}/>
        </Stack.Group>
      ) : (
        <Stack.Screen name="SignIn" component={SignIn} />
      )}
    </Stack.Navigator>
  );
}
