import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, RefreshControl, Alert, Modal, Pressable } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage/src/AsyncStorage';

import { API_BASE_URL } from './apiConfig';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { Button } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const [dermatologueDrawer, setDermatologueDrawer] = useState();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [nombreConsultation, setNombreConsultation] = useState(0);
  const [nombrePatient, setPatient] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation()
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getDermatologue();
      await getNombrePatient();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getDermatologue = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(API_BASE_URL + '/api/dermatologues/profile/' + username, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setFirstName(response.data.user.firstName);
      setLastName(response.data.user.lastName);
    } catch (error) {
      console.error(error + ' in get User profile');
      throw error;
    }
  };

  const getNombrePatient = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(API_BASE_URL + '/api/rendez-vous/statistique-data/' + username, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setNombreConsultation(response.data[0]);
      setPatient(response.data[1]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    setModalVisible(true);
  };
  const cancelLogout = () => {
    setModalVisible(false);
  };

  const confirmLogout = async () =>{
  await AsyncStorage.removeItem("token")
  await AsyncStorage.removeItem("username")
  navigation.navigate("Login");
  setModalVisible(false);
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        await getDermatologue();
        await getNombrePatient();
      } catch (error) {
        console.error('Error during initial fetch:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image style={styles.avatar} source={require('../screens/medecin.png')} />
          <Text style={styles.name}>{firstName} {lastName}</Text>

          <View style={styles.logoutIcon}>
            <Icon
              name="sign-out"
              size={30}
              color="#FFFFFF"
              onPress={handleLogout}
            />
          </View>
        </View>
      </View>


      <View style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // position: 'absolute',
        backgroundColor: '#ffffff',
        width:"100%",

      }} >
        <View style={styles.detailContent}>
          <Text style={styles.title}>Today Visits</Text>
          <Text style={styles.count}>{nombreConsultation}</Text>
        </View>
        <View style={styles.detailContent}>
          <Text style={styles.title}>Patients treated</Text>
          <Text style={styles.count}>{nombrePatient}</Text>
        </View>
      </View>



      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={{
              flexDirection:"row",
              display:"flex",
              justifyContent:"center",
              alignItems:"center"
            }}>

            <Pressable
              style={[styles.button, styles.buttonClose, {marginRight:45, width:70}]}
              onPress={() => cancelLogout()}>
              <Text style={styles.textStyle}>No</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.confirmButton, {marginLeft:45, width:70}]}
              onPress={() => confirmLogout()}>
              <Text style={styles.textStyle}>Yes</Text>
            </Pressable>
              
            </View>
          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#00CED1',
    marginTop:3,
  
  },
  headerContent: {
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  profileDetail: {
    alignSelf: 'center',
    marginTop: 230,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
  detailContent: {
    margin: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#00CED1',
  },
  count: {
    fontSize: 24,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
    marginTop: 40,
  },
  textInfo: {
    fontSize: 18,
    marginTop: 20,
    color: '#696969',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#00CED1',
  },
  description: {
    fontSize: 20,
    color: '#00CED1',
    marginTop: 10,
    textAlign: 'center',
  },
logoutIcon: {
  position: 'absolute',
  top: 10,
  right: 10,
},






centeredView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 22,
},
modalView: {
  margin: 20,
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 35,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},
button: {
  borderRadius: 12,
  padding: 10,
  elevation: 2,
},
buttonOpen: {
  backgroundColor: '#F194FF',
},
buttonClose: {
  backgroundColor: '#2196F3',
},
confirmButton: {
  backgroundColor: '#f20a0a',
},
textStyle: {
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
},
modalText: {
  fontSize:20,
  marginBottom: 20,
  textAlign: 'center',
},
}
)

export default Profile;