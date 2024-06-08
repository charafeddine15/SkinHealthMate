import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar";
import { API_BASE_URL } from './apiConfig';
import { useIsFocused } from '@react-navigation/native';

import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput, ImageBackground
} from 'react-native';
import axios from "axios";
import {jwtDecode} from 'jwt-decode';
import { decode as base64Decode } from 'base-64';

import jwt_decode from "jwt-decode";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();
  const [showError, setError] = useState(false);
  const [shouldlogin, setLogin] = useState(null)
  const isFocused = useIsFocused();

    const saveToken = async (token) =>{
        try {
            await asyncStorage.setItem("token",token);
            console.log('Token sauvegardé avec succès.');
        }catch (error){
            console.log(error)
            alert("Erreur lors de la sauvegarde du token")
        }
    }




  const backgroundImage = require('./background.jpg');


  const dataUser ={
    "username":username,
    "password":password
  };
  const handleSignIn = async () => {
    console.log("Check test");
    let responsse = await axios.post(API_BASE_URL+"/api/authenticate",dataUser)
        .then(response =>{
          console.log(response.data)
          const token = response.data.id_token;
          saveToken(token)
          const object = JSON.parse(atob(token.split('.')[1]))
          if (object.auth ==="ROLE_DERMATOLOGUE"){
              asyncStorage.setItem("token",token)
              asyncStorage.setItem("username",dataUser.username);
              setUsername("")
              setPassword("")
            navigation.navigate("Dermatologist assistant");
          }
          else {
            alert("this application is dedicated to doctors")
          }

        })
        .catch(error =>{
            console.log("Error in login ")
          console.log(error)
          setError(true)
        })

  };

  const checkValidationToken = async () =>{
    console.log("we will check token");
    try {
      const token = await asyncStorage.getItem("token")
        const response = await axios.get(API_BASE_URL+"/api/dermatologues",{
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).then(response =>{
          console.log("Token valide");
          navigation.navigate("Dermatologist assistant");
        }).catch(error =>{
          console.log("token invalid");
          setLogin(true)
        })
      }    
    catch (error) {
      setLogin(true)
    }
  }

// useEffect(() => {
//     if (isFocused) {
//       checkValidationToken();
//     }
//   }, [isFocused]);



  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      
      {
        true && 
        <View style={styles.container}>     
        <Text style={styles.connectText}>Sign in</Text>
          <View style={styles.inputView}>
            <TextInput
                style={styles.TextInput}
                placeholder="Username"

                placeholderTextColor="#003f5c"
                onChangeText={(username) => setUsername(username)}
                value={username}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
                style={styles.TextInput}
                placeholder="Password"
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                value={password}
            />
          </View>
           
            {
              showError && 
              <View style={{color:"red", justifyContent:"center",display:"flex", alignItems:"center"}}>
              <Text style={{color:"red", fontSize:16}}>Invalid authentication credentials.</Text>
            </View>
            }
        
          <TouchableOpacity onPress={handleSignIn}style={styles.loginBtn}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgot_button}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      }
        </ImageBackground >

  );
}



const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  width: '100%', 
  height: '100%', 
  resizeMode: 'cover',
  justifyContent: 'center',
  },
   container: {
    flex: 0,
    backgroundColor: "#E6E6E6",
    alignItems: "center",
    borderRadius: 20,
    // padding: 50, 
    marginTop: 20, 
    marginBottom: 20,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "#FFF",
    // borderRadius: 30,
    width: "80%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 40,
    backgroundColor: "#0B5ED7",
  },
  connectText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});