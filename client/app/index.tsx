
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Navigation from "./src/navigators";
import { Provider } from "react-redux";
import store from "./src/shared/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCredentials } from "./src/shared/store/slices/authSlice";

import * as SplashScreen from "expo-splash-screen";
import { ToastAndroid } from "react-native";
SplashScreen.preventAutoHideAsync();



export default function Index() {
const [ready, setReady] = useState(false);

useEffect(() => {
  async function prepareApp() {
    try {
      // 🔹 Hydrate auth
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");
      const userId = await AsyncStorage.getItem("userId");
      const name = await AsyncStorage.getItem("name");

      if (token && role && userId) {
        store.dispatch(
          setCredentials({
            token,
            role,
            _id: userId,
            name,
          })
        );
      }

      // Optional minimum splash duration (UX polish)
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (e) {
      // We might want to provide this error information to an error reporting service
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
      console.log("Startup error", e);
    } finally {
      setReady(true);
      await SplashScreen.hideAsync();
    }
  }

  prepareApp();
}, []);


if (!ready) {
  return null;
}

  
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="auto" translucent backgroundColor="white" />
        <SafeAreaView style={{
          flex: 1, backgroundColor: "#e91e62",
          paddingBottom: -100
        }}>
          <Navigation />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}


