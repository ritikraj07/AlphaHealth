import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../shared/store/hooks";

import { useDispatch } from "react-redux";
import { performLogout } from "../../shared/utils/logout";
import { NavProp } from "../../navigators";


const PRIMARY = "#e91e62";

const SettingsScreen = (props: any) => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useDispatch();
  

  const { name, role, userId } = useAppSelector((state) => state.auth);

  const appVersion =
    Constants.expoConfig?.version ||
    Constants.manifest2?.extra?.expoClient?.version ||
    "1.0.0";

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
        //   await AsyncStorage.multiRemove(["token", "role", "userId", "name"]);
          await performLogout(dispatch, props.navigation);
        },
      },
    ]);
  };

  const openPrivacy = () => {
    Linking.openURL("https://commingsoon.com/privacy");
  };

  const rateApp = () => {
    Alert.alert(
      "Coming Soon",
      "Rating the app will be available after Play Store release.",
    );
  };

  const contactAdmin = () => {
    Alert.alert(
      "Contact Admin",
      "Email: imritikraj0@gmail.com\nPhone: +91 9693452199",
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and application</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile */}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={52} color="#fff" />
          </View>

          <Text style={styles.name}>{name}</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {role?.charAt(0).toUpperCase() + role?.slice(1)}
            </Text>
          </View>

          <Text style={styles.id}>User ID</Text>
          <Text style={styles.userId}>{userId}</Text>
        </View>

        {/* Account */}

        <Text style={styles.section}>ACCOUNT</Text>

        <SettingItem
          icon="lock-reset"
          title="Change Password"
          onPress={() => navigation.navigate("ChangePasswordScreen")}
        />

        {/* Support */}

        <Text style={styles.section}>SUPPORT</Text>

        <SettingItem
          icon="account-tie"
          title="Contact Admin"
          onPress={contactAdmin}
        />

        <SettingItem
          icon="shield-lock"
          title="Privacy Policy"
          onPress={openPrivacy}
        />

        <SettingItem
          icon="star-circle"
          title="Rate PharmaPrime"
          onPress={rateApp}
        />

        {/* About */}

        <Text style={styles.section}>ABOUT</Text>

        <View style={styles.versionCard}>
          <Text style={styles.versionTitle}>PharmaPrime</Text>
          <Text style={styles.versionText}>Version {appVersion}</Text>
        </View>

        {/* Logout */}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" color="#fff" size={22} />

          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const SettingItem = ({
  icon,
  title,
  onPress,
}: {
  icon: any;
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={onPress}>
    <View style={styles.itemLeft}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={22} color={PRIMARY} />
      </View>

      <Text style={styles.itemText}>{title}</Text>
    </View>

    <MaterialCommunityIcons name="chevron-right" size={26} color="#94a3b8" />
  </TouchableOpacity>
);

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f8fafc",
  },

  header: {
    paddingHorizontal: 20,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#e91e62",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#f3f3f3",
  },

  subtitle: {
    marginTop: 5,
    color: "#f0f0f0",
    fontSize: 15,
  },

  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 28,
    elevation: 4,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  roleBadge: {
    marginTop: 10,
    backgroundColor: "#fde7ef",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },

  roleText: {
    color: PRIMARY,
    fontWeight: "700",
  },

  id: {
    marginTop: 20,
    color: "#94a3b8",
  },

  userId: {
    marginTop: 4,
    fontWeight: "700",
    color: "#111827",
  },

  section: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 12,
    color: "#94a3b8",
    fontWeight: "700",
    letterSpacing: 1,
  },

  item: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fde7ef",
    justifyContent: "center",
    alignItems: "center",
  },

  itemText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  versionCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 22,
    elevation: 2,
  },

  versionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  versionText: {
    marginTop: 6,
    color: "#64748b",
    fontSize: 15,
  },

  logoutButton: {
    marginHorizontal: 20,
    marginTop: 35,
    backgroundColor: "#ef4444",
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  logoutText: {
    marginLeft: 10,
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
});
