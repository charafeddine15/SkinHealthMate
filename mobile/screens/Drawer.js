import React, { useEffect, useState } from 'react';
import "react-native-gesture-handler";
import { View, Text, Image } from "react-native";
import axios from 'axios';
import {
  SimpleLineIcons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";

import Backups from "./Backups";
import Consultations from "./Consultations";
import Contact from "./Contact";
import Profile from "./Profile";
import GetPremium from "./GetPremium";
import Home from "./Home";
import RateApp from "./RateApp";
import Settings from "./Settings";
import Timer from "./Timer";
import { API_BASE_URL } from './apiConfig';
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Drawer() {
  const [dermatologueDrawer,setDermatologueDrawer]=useState();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [token, setToken] = useState("")
  const getToken = async ()=>{
        const token = await AsyncStorage.getItem('token');
        setToken(token)
  }



  useEffect(() => {
    const getDermatologue = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(API_BASE_URL + '/api/dermatologues/profile/'+username,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
          }).then((response) => {
            setFirstName(response.data.user.firstName)
            setLastName(response.data.user.lastName)
          });

      } catch (error) {
        console.error(error + " in get User profile");
      }
    };

    getDermatologue();
  }, []);

    const Drawer = createDrawerNavigator();
  return (

    
      <Drawer.Navigator
        drawerContent={
          (props) => {
            return (
              <SafeAreaView>
                <View
                  style={{
                    height: 200,
                    width: '100%',
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomColor: "#f4f4f4",
                    borderBottomWidth: 1
                  }}
                >
                  <Image
                  source={require('./medecin.png')}
                   
                    style={{
                      height: 130,
                      width: 130,
                      borderRadius: 65
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 22,
                      marginVertical: 6,
                      fontWeight: "bold",
                      color: "#111"
                    }}
                  >  {` ${firstName} ${lastName}`}</Text>
                </View>
                <DrawerItemList {...props} />
              </SafeAreaView>
            )
          }
        }
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#fff",
            width: 250
          },
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold"
          },
          drawerLabelStyle: {
            color: "#111"
          }
        }}
      >
        {/*<Drawer.Screen*/}
        {/*  name="Home"*/}
        {/*  options={{*/}
        {/*    drawerLabel: "Home",*/}
        {/*    title: "Home",*/}
        {/*    drawerIcon: () => (*/}
        {/*      <SimpleLineIcons name="home" size={20} color="#808080" />*/}
        {/*    )*/}
        {/*  }}*/}
        {/*  component={Home}*/}
        {/*/>*/}
        {/*<Drawer.Screen*/}
        {/*  name="Timer"*/}
        {/*  options={{*/}
        {/*    drawerLabel: "Timer",*/}
        {/*    title: "Timer",*/}
        {/*    drawerIcon: () => (*/}
        {/*      <MaterialIcons name="timer" size={20} color="#808080" />*/}
        {/*    )*/}
        {/*  }}*/}
        {/*  component={Timer}*/}
        {/*/>*/}
        <Drawer.Screen
          name="Consultations"
          options={{
            drawerLabel: "Consultations",
            title: "Consultations",
            drawerIcon: () => (
              <MaterialIcons name="people" size={20} color="#808080" />
            )
          }}
          component={Consultations}
        />
        <Drawer.Screen
          name="Profile"
          options={{
            drawerLabel: "Profile",
            title: "Profile",
            drawerIcon: () => (
              <MaterialIcons name="dashboard-customize" size={20} color="#808080" />
            )
          }}
          component={Profile}
        />
        {/* <Drawer.Screen
          name="Settings"
          options={{
            drawerLabel: "Settings",
            title: "Settings",
            drawerIcon: () => (
              <SimpleLineIcons name="settings" size={20} color="#808080" />
            )
          }}
          component={Settings}
        /> */}

        {/* <Drawer.Screen
          name="Backups"
          options={{
            drawerLabel: "Backups",
            title: "Backups",
            drawerIcon: () => (
              <MaterialIcons name="backup" size={20} color="#808080" />
            )
          }}
          component={Backups}
        /> */}

        {/* <Drawer.Screen
          name="Get Premium"
          options={{
            drawerLabel: "Get Premuim",
            title: "Get Premium",
            drawerIcon: () => (
              <MaterialCommunityIcons name="certificate" size={20} color="#808080" />
            )
          }}
          component={GetPremium}
        /> */}
        {/* <Drawer.Screen
          name="Rate this App"
          options={{
            drawerLabel: "Rate this App",
            title: "Rate this App",
            drawerIcon: () => (
              <FontAwesome name="star" size={20} color="#808080" />
            )
          }}
          component={RateApp}
        /> */}

        {/* <Drawer.Screen
          name="Contact"
          options={{
            drawerLabel: "Contact",
            title: "Contact",
            drawerIcon: () => (
              <MaterialCommunityIcons name="message-alert-outline" size={20} color="#808080" />
            )
          }}
          component={Contact}
        /> */}
      </Drawer.Navigator>
   
  )
}
