import { createDrawerNavigator } from "@react-navigation/drawer";

import EmployeeDrawer from "../shared/componets/EmployeeDrawer";
import BottomTabs from "./BottomTab";
import { Dimensions } from "react-native";


const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    const screenWidth = Dimensions.get("window").width;

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
      drawerContent={(props) => <EmployeeDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={BottomTabs} />
    </Drawer.Navigator>
  );
}
