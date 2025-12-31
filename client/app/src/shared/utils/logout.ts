import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { apiSlice } from "../store/api/apiSlice";
import { clearCredentials } from "../store/slices/authSlice";

export const performLogout = async (
  dispatch: any,
  navigation: any
) => {
  // 1. Clear persisted data
  await AsyncStorage.multiRemove(["token", "role", "userId"]);

  // 2. Clear Redux auth state
  dispatch(clearCredentials());

  // 3. Clear RTK Query cache
  dispatch(apiSlice.util.resetApiState());

  // 4. Reset navigation stack
  // navigation.dispatch(
  //   CommonActions.reset({
  //     index: 0,
  //     routes: [{ name: "SignIn" }],
  //   })
  // );
};
