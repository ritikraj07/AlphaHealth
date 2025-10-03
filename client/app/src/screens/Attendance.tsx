import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { global_styles } from '../shared/style'

export default function Attendance() {
  // Later we can dynamically set greeting (Morning/Evening) and button text (Start/End Day)
  const greeting = "Good Evening, Super!";
  const btnText = "START DAY";
  const bottomText = "Morning Attendance • Not Logged In";
  

  return (
    <View style={global_styles.container}>
      {/* Greeting */}
      <Text style={styles.greeting}>{greeting}</Text>

      {/* Card */}
      <View style={styles.card}>
        <LinearGradient
          colors={['#FF416C', '#8A2BE2']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btnWrapper}
        >
          <TouchableOpacity style={styles.btn}>
            <Ionicons name="play-outline" size={22} color="white" />
            <Text style={styles.btnText}>{btnText}</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Bottom Text */}
        <Text style={styles.bottomText}>{bottomText}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15
  },
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },
  btnWrapper: {
    borderRadius: 10,
    width: "85%",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16
  },
  bottomText: {
    marginTop: 10,
    fontSize: 13,
    color: "#666",
  }
})
