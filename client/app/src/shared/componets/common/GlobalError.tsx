import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
  onSupport?: () => void;
  showRetry?: boolean;
  showSupport?: boolean;
}

export default function GlobalError({
  title = "Oops!",
  message,
  onRetry,
  onSupport,
  showRetry,
  showSupport,
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={64} color="#e91e63" />

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {showRetry && onRetry && (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}

      {showSupport && (
        <TouchableOpacity
          style={[styles.retryBtn, styles.supportBtn]}
          onPress={onSupport}
        >
          <Text style={styles.supportText}>Contact Support</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },

  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  retryBtn: {
    marginTop: 24,
    backgroundColor: "#e91e63",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
  },

  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  supportBtn: {
    backgroundColor: "#444",
    marginTop: 12,
  },

  supportText: {
    color: "#fff",
    fontSize: 14,
  },
});
