
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Navigation from "./src/navigators";
import { Provider } from "react-redux";
import store from "./src/shared/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCredentials } from "./src/shared/store/slices/authSlice";



export default function Index() {
const [isReady, setIsReady] = useState(false);

useEffect(() => {
  const hydrateAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");
      const userId = await AsyncStorage.getItem("userId");
      const name = await AsyncStorage.getItem("name");
      console.log("Hydrating auth...");
      console.log(token, "\n", role, "\n", userId, "\n", name);

      if (token && role && userId) {
        store.dispatch(
          setCredentials({
            token,
            role,
            _id: userId,
            name
          })
        );
      }
    } catch (error) {
      console.log("Auth hydration failed", error);
      
    } finally {
      setIsReady(true);
    }
  };

  hydrateAuth();
}, []);

if (!isReady) {
  return null; // TODO SplashScreen
}
  
  return (
    <Provider store={store}>
      <SafeAreaProvider>
      <StatusBar style="auto" translucent backgroundColor="white"   />
      <SafeAreaView style={{ flex: 1, backgroundColor:"black" }}>
        <Navigation />
      </SafeAreaView>
      </SafeAreaProvider>

      </Provider>
)
}
