import { createDrawerNavigator } from "@react-navigation/drawer";

import EmployeeDrawer from "../shared/componets/EmployeeDrawer";
import BottomTabs from "./BottomTab";
import { Dimensions } from "react-native";
import { useAppSelector } from "../shared/store/hooks";
import AdminDrawer from "../shared/componets/AdminDrawer";

export type DrawerParamList = {
  Home: undefined;
};


const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const screenWidth = Dimensions.get("window").width;
  const { role } = useAppSelector((state) => state.auth);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        swipeEdgeWidth: 100,
        drawerStyle: {
          width: screenWidth > 600 ? 400 : 280,
          backgroundColor: "#fff",
        },
      }}
      drawerContent={(props) =>{ return role === "admin" ? <AdminDrawer {...props} />  : <EmployeeDrawer {...props} />}}
    >
      <Drawer.Screen name="Home" component={BottomTabs} />
    </Drawer.Navigator>
  );
}

