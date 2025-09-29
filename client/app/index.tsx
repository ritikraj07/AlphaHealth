
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";
import Navigation from "./src/navigators";

export default function Index() {
  return (
    
      <SafeAreaProvider>
      <StatusBar style="auto" translucent backgroundColor="white"   />
      <SafeAreaView style={{ flex: 1, backgroundColor:"black" }}>
        <Navigation />
      </SafeAreaView>
      </SafeAreaProvider>
)
}
