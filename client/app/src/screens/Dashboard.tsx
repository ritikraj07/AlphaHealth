import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { global_styles } from '../shared/style'

export default function Dashboard() {

  return (
    <View style={global_styles.container} >
      <Text>Dashboard</Text>
      <TouchableOpacity onPress={() => {console.log("Signin") }} >
        <Text>Signin</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
container:{
  flex:1,
  justifyContent:"center",
  alignItems:"center"
}
})