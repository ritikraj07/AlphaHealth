import "react-native-gesture-handler";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { use, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";

import { Provider } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCredentials } from "./app/src/shared/store/slices/authSlice";

import * as SplashScreen from "expo-splash-screen";
import { ToastAndroid } from "react-native";
import Navigation from "./app/src/navigators";
import store from "./app/src/shared/store";
import { NavigationContainer } from "@react-navigation/native";
import { useServerStatus } from "./app/src/shared/componets/hooks/useServerStatus.ts";
import ServerConnectingOverlay from "./app/src/shared/componets/ServerConnectingOverlay";
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

  const serverStatus = useServerStatus();
  const isServerOnline = serverStatus === "online";

  if (!ready) {
    return null;
  }

  if (!isServerOnline) {
    return <ServerConnectingOverlay visible={isServerOnline} />;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="auto" translucent backgroundColor="white" />
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: "#e91e62",
              paddingBottom: -100,
            }}
          >
            <NavigationContainer>
              <Navigation />
            </NavigationContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
