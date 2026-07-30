import React from "react";
import {
  
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  const handleEmailPress = () => {
    Linking.openURL("mailto:support@pharmaprime.com");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.lastUpdated}>Last Updated: July 30, 2026</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Pharma Prime ("we", "our", "us") is committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our mobile application
          (the "App"). Please read this policy carefully. If you do not agree
          with the terms, please do not use the App.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We may collect the following types of information:
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            •{" "}
            <Text style={styles.bold}>Personal Identifiable Information:</Text>{" "}
            Name, email address, phone number, date of birth, and
            government‑issued ID.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.bold}>Medical & Health Data:</Text>{" "}
            Prescription details, medication history, allergies, and health
            conditions (only with your explicit consent).
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.bold}>Location Data:</Text> Precise or
            approximate location to enable delivery services and mark attendance
            (with your permission).
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.bold}>Device & Usage Information:</Text>{" "}
            Device model, operating system, unique device identifiers, app usage
            statistics, and crash logs.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.bold}>Payment Information:</Text> If you make
            purchases, we collect payment details (processed by our third‑party
            payment gateway – we do not store full card details).
          </Text>
        </View>

        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        <Text style={styles.paragraph}>We use your data to:</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            • Provide, maintain, and improve the App.
          </Text>
          <Text style={styles.bulletItem}>
            • Process your orders and deliver medications.
          </Text>
          <Text style={styles.bulletItem}>
            • Send you transactional and promotional communications.
          </Text>
          <Text style={styles.bulletItem}>
            • Manage your attendance (if you are an employee).
          </Text>
          <Text style={styles.bulletItem}>
            • Comply with legal obligations and enforce our terms.
          </Text>
          <Text style={styles.bulletItem}>
            • Analyse usage trends to enhance user experience.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>4. Sharing Your Information</Text>
        <Text style={styles.paragraph}>
          We do not sell your personal data. We may share information with:
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            • <Text style={styles.bold}>Service Providers:</Text> Third‑party
            vendors (e.g., cloud hosting, analytics, push notifications) who
            process data on our behalf.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.bold}>Pharmacy Partners:</Text> To fulfil
            prescriptions and arrange deliveries.
          </Text>
          <Text style={styles.bulletItem}>
            • <Text style={styles.bold}>Legal Authorities:</Text> When required
            by law or to protect our rights.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement industry‑standard security measures, including
          encryption, access controls, and secure APIs, to protect your data.
          However, no method of transmission over the internet is 100% secure –
          we cannot guarantee absolute security.
        </Text>

        <Text style={styles.sectionTitle}>6. Your Rights & Choices</Text>
        <Text style={styles.paragraph}>
          Depending on your location, you may have the right to:
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            • Access, correct, or delete your personal data.
          </Text>
          <Text style={styles.bulletItem}>• Withdraw consent at any time.</Text>
          <Text style={styles.bulletItem}>
            • Opt‑out of marketing communications.
          </Text>
          <Text style={styles.bulletItem}>• Request data portability.</Text>
          <Text style={styles.bulletItem}>
            • Lodge a complaint with a supervisory authority.
          </Text>
        </View>
        <Text style={styles.paragraph}>
          To exercise these rights, please contact us using the details below.
        </Text>

        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          The App is not intended for children under the age of 13. We do not
          knowingly collect personal information from children. If we become
          aware that a child has provided us with data, we will delete it.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this policy from time to time. We will notify you of any
          changes by posting the new policy on this screen and updating the
          "Last Updated" date. Your continued use of the App constitutes
          acceptance of the updated policy.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy, please reach out to us:
        </Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactText}>
            📧 Email: imritikraj0@gmail.com
          </Text>
          <TouchableOpacity
            onPress={handleEmailPress}
            style={styles.emailButton}
          >
            <Text style={styles.emailButtonText}>Send Email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 20,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#334155",
    marginBottom: 8,
  },
  bulletList: {
    marginLeft: 8,
    marginBottom: 12,
  },
  bulletItem: {
    fontSize: 15,
    lineHeight: 22,
    color: "#334155",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "700",
    color: "#0F172A",
  },
  contactInfo: {
    backgroundColor: "#F1F5F9",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
  },
  contactText: {
    fontSize: 15,
    color: "#1E293B",
    marginBottom: 12,
  },
  emailButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emailButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  footer: {
    height: 40,
  },
});
