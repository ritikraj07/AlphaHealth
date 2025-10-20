import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { global_styles } from '../shared/style'

import { useNavigation } from '@react-navigation/native'

export default function Dashboard() {

  const navigation = useNavigation();

  const handleTouch = (scree: string)=>{
    navigation.navigate(scree as never);
  }
  return (
    <View style={global_styles.container} >
      
      <Text>Dashboard</Text>
      <TouchableOpacity style={styles.btm} onPress={() => {handleTouch("AdminDashboard")}} >
        <Text>Admin Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btm} onPress={() => {handleTouch("EmployeeDashboard")}} >
        <Text>Employee Dashboard</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
container:{
  flex:1,
  justifyContent:"center",
  alignItems:"center"
},
btm:{
  justifyContent:"center",
  alignItems:"center",
  backgroundColor:"green",
  width:"60%",
  height:50,
  marginTop:10
}
})