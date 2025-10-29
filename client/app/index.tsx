
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";
import Navigation from "./src/navigators";
import { Provider } from "react-redux";
import store from "./src/shared/store";


export default function Index() {
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
