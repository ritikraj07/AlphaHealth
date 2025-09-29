import { StyleSheet,Image, Text, TouchableOpacity, View, TextInput,
   ScrollView ,
   
  } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'

export default function SignIn() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Employee');

  const handleSignIn = () => {
    // Add your authentication logic here
    navigation.navigate('Main' as never);
  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
     {/* Header */}
     <View style={{alignItems:"center"}}>
      <Image style={styles.logo} source={require("../shared/images/logo.png")} />
      <Text style={styles.title}  >
        Employee Management System
      </Text>
      <Text style={styles.subtile}>Sign in to your account to continue</Text>
     </View>

     {/* Sign in form */}
      <View style={styles.inputCard} >

        <Text style={styles.lable} >Sign In</Text>
        <Text style={[styles.subtile,{fontSize:12}]} >Enter your credentials to access the system</Text>

        
        <Text style={styles.lable} >Email</Text>
        <TextInput style={styles.input} placeholder='your.email@company.com' value={email} onChangeText={setEmail} />

        <Text style={styles.lable} >Password</Text>
        <TextInput style={styles.input} placeholder='Enter your password'  value={password} onChangeText={setPassword} secureTextEntry />


        <TouchableOpacity style={styles.btm} onPress={handleSignIn} >
          <Text style={styles.btmText} >Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}

      <View style={styles.footer}>
        
        <Text style={{color:"grey"}} >Employee Management System v1.0 </Text>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(252,244,249)',
    alignContent:"center",
    
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 70,
  },
  logo:{
    width: 150,
    height: 70,
    resizeMode: 'contain',
    marginBottom:10
  },
  title:{
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subtile:{
    fontSize: 14,
    marginBottom: 20,
    marginTop:0,
    color:"grey"

  },
  inputCard:{
    margin:5,
    padding:15,
    borderRadius:10,
    backgroundColor:"white",
    shadowColor: "#685a5aff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  lable:{
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius:5,
    backgroundColor:"white"
  },

  btm:{
    padding:10,
    borderRadius:10,
    backgroundColor:"rgb(233,31,98)",
    marginTop:10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1
  }, 
  btmText:{
    fontSize: 14,
    fontWeight: 'bold',
    color:"white",
    textAlign:"center"
  },
  footer:{
    position:"absolute",
    bottom:10,
    left:0,
    right:0,
    alignItems:"center",
    
  }
  
})