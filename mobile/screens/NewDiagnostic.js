import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Image, Platform, View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import { API_BASE_MODEL, API_BASE_URL } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { set } from 'lodash';

import Icon from 'react-native-vector-icons/FontAwesome';
import {Camera} from 'expo-camera'

export default function NewDiagnostic() {


  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState('off');
  const camera = useRef(null);

  const [image, setImage] = useState(null);
  const [imageString, setImageString] = useState(null);

  const [probability, setProbability] = useState(0)
  const [probablilties, setProbabilities] = useState([])
  const [maladiesDetected, setMaladiesDetected] = useState([])
  const [selectedSymptom, setSelectedSymptom] = useState([]);
  const symptoms = ['Rougeur', 'Démangeaisons', 'Irritation', 'Sécheresse', 'Eruption cutanée', 'Desquamation', 'Taches sombres'];
  const [checkBoxValues, setCheckBoxValues] = useState({
    Rougeur: false,
    Démangeaisons: false,
    Irritation: false,
    Sécheresse: false,
    "Eruption cutanée": false,
    "Desquamation": false,
    "Taches sombres": false,
  });

  const [data, setData] = useState({
    send: false,
    dateDiagnostic: "2023-12-13T08:09:02.385Z",
    picture: "",
    pictureContentType: "image/jpeg",
    description: "",
    prescription: "",
    probability: 0,
    probabilities: [],
    symptoms: [],
    consultations: {
      id: "",
    },
    maladies: [
      {
        id: "",
        fullName: "",
        abbr: ""
      }
    ],
    maladiesDetected: [
      {
        id: "",
        fullName: "",
        abbr: "",
        haveId:false,
      },
    ],
  });

  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false)
  const navigation = useNavigation();

  const [notifyGetMaladie, setNotifyGetMaladie] = useState(false)
  const [notifySendData, setNotifySendData] = useState(false)

  const [imageOfCamera, setImageOfcamera] = useState(false)
  const [imageCamera, setImageCamera] = useState(null)

  const convertImageCamera = async() =>{
    // console.log(imageCamera);
    const consultation_Id = await AsyncStorage.getItem("consultationId");
      setData((prevData) => ({
        ...prevData,
        consultations: {
          id: consultation_Id,
        },
      }));

    const response = await fetch(imageCamera);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result.split(',')[1];
          setData((prevData) => ({
            ...prevData,
            picture: base64data,
          }));
        };
        reader.readAsDataURL(blob);

        console.log("j ai termine");
        setImageOfcamera(false)
    
  }

  useEffect(()=>{
    convertImageCamera()
  },[imageOfCamera])

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log(status);
    if (status === 'granted') {
      setStartCamera(true);
    } else {
      Alert.alert('Access denied');
    }
  };

  const __takePicture = async () => {
    if (camera.current) {
      const photo = await camera.current.takePictureAsync();
      setImage(photo.uri)
      setImageCamera(photo.uri)
      console.log("image uri ");
      console.log(photo.uri);
      setImageOfcamera(true)

      setPreviewVisible(true);
      setCapturedImage(photo);
      setStartCamera(false)
  }};

  useEffect(()=>{
    if(previewVisible){
      __takePicture()
    }
  },[previewVisible])







  const __savePhoto = () => {
    // Implement your save photo logic here
  };

  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
  };

  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off');
    } else if (flashMode === 'off') {
      setFlashMode('on');
    } else {
      setFlashMode('auto');
    }
  };

  const __switchCamera = () => {
    setCameraType((prevType) =>
      prevType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };






  
  const handleCheckBoxChange = (symptom) => {
    setCheckBoxValues((prevValues) => ({
      ...prevValues,
      [symptom]: !prevValues[symptom],
    }));
  };



  const ConfirmSenddata = async () => {
    setVisible(true)
    const s = symptoms.filter((symptom) => checkBoxValues[symptom]);
    console.log('Selected Symptoms:', s);
    data.symptoms=s
    const apiUrl = API_BASE_MODEL + '/disease/predict';
    

    const formData = new FormData();
    formData.append('image',
    {
      uri: image,
      type: 'image/jpeg',
      name: 'image',
    }
    );

      await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response =>{
        console.log(response.data);
        setData((prevData) => ({
          ...prevData,
          probability:response.data.probability,
          probabilities: response.data.probabilities,
        }));
      }).catch(error =>{
        console.log(error);
      })


      await sendDataToBack();
  };

//   const dataJson = {
//     "dateDiagnostic": "2023-12-13T08:09:02.385Z",
//     "picture": "",
//     "pictureContentType": "image/jpeg",
//     "description": "",
//     "prescription": "",
//     "probability": probability,
//     "probabilities": probablilties,
//     "symptoms":selectedSymptom,
//     "consultations": {
//         "id": "6578587dd20828576b9e91fc",
//         "dateConsultation": "2023-12-12T13:00:00Z"
//     },
//     "maladies": [
//         {
//             "id": "656a2065816d2001e3943ff6",
//             "fullName": "Melanocytic nevi",
//             "abbr": "nv"
//         }
//     ],
//     "maladiesDetected": [
//         {
//             "id": "656a2065816d2001e3943ff6",
//             "fullName": "Melanocytic nevi",
//             "abbr": "nv"
//         }
//     ]
// }

  const sendDataToBack = useCallback( async () =>{
    const consultation_Id = await AsyncStorage.getItem("consultationId")
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(API_BASE_URL+"/api/diagnostics",data,{
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      
    } catch (error) {
      console.log(error);
    }
    setVisible(false)
    // navigation.navigate('Diagnostic', {consultationId:consultation_Id});
  })

const showData = () =>{
  console.log(data.probabilities);
  console.log(data.probability);
  console.log(data.symptoms);
  console.log(data.maladiesDetected);
}

useEffect(() => {
  const requestMediaPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission denied !!');
      }
    }
  };

  requestMediaPermission();
}, []);

  const pickImage = async () => {
    try {
      setStartCamera(false)
      setPreviewVisible(false)
      const consultation_Id = await AsyncStorage.getItem("consultationId");
      setData((prevData) => ({
        ...prevData,
        consultations: {
          id: consultation_Id,
        },
      }));
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1,
      });
  
      // console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        const imagePath = result.assets[0].uri;
  
        // Utiliser fetch pour obtenir le blob de l'image
        const response = await fetch(imagePath);
        const blob = await response.blob();
  
        // Convertir le blob en base64
        const reader = new FileReader();
        
        reader.onload = () => {
          const base64data = reader.result.split(',')[1];
          
          setData((prevData) => ({
            ...prevData,
            picture: base64data,
          }));
        };
  
        reader.readAsDataURL(blob);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération ou du traitement de l\'image:', error);
    }
  };
  


  const showImage = async () => {
    console.log("ELBAHJA jjjjjjjjjjjjjjjj");
    const imagePath = image; 
    const response = await fetch(imagePath);
    const blob = await response.blob();
    var reader = new FileReader();
    reader.onload = () => {
        // var base64data = reader.result;
        var base64data = reader.result.split(',')[1];
        // console.log(base64data);
        data.picture = base64data
        setData((prevData) => ({
          ...prevData,
          picture: base64data,
        }));
    };
    reader.readAsDataURL(blob);
    console.log("ELBAHJA HHHHHHH");
}

const updateData = async () => {
  const consultation_Id =  await AsyncStorage.getItem("consultationId")

  setData((prevData) => ({
    ...prevData,
    consultations: {
      ...prevData.consultations,
      id: consultation_Id,
    },
    probability:probability,
    probabilities: probablilties,

  }))
};


const handleSubmit = async () => {
  setVisible(true);
  try {
    // const token = await AsyncStorage.getItem("token");

    const s = symptoms.filter((symptom) => checkBoxValues[symptom]);

    console.log('Selected Symptoms:', s);
    const apiUrl = API_BASE_MODEL + '/disease/predict';

    const formData = new FormData();
    formData.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'image',
    });

    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data);
    await new Promise((resolve) => {
      setData((prevData) => ({
        ...prevData,
        probability: response.data.probability,
        probabilities: response.data.probabilities,
        symptoms:s,
        send: !data.send,
      }));

      setData((prevData) => ({
        ...prevData,
        maladiesDetected: [
          {
            ...prevData.maladiesDetected[0],
            abbr: response.data.predicted_disease,
            
          },
        ],
      }));

      const newDate = new Date().toISOString();
      setData((prevData) => ({
        ...prevData,
        dateDiagnostic: newDate,
      }));

      // console.log("We are changing the value of abbr by handleSubmit");
      resolve();
      setNotifyGetMaladie(true);
    });
    // setVisible(false);
  } catch (error) {
    console.error(error);
    setVisible(false);
  }
};




useEffect(() =>{
  if (notifyGetMaladie) {
    getMaladieByAbbr();
  }
},[notifyGetMaladie])




useEffect(() => {
  const fetchData = async () => {
    const consultation_Id = await AsyncStorage.getItem("consultationId");
    if (notifySendData) {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await axios.post(API_BASE_URL + "/api/diagnostics", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setData((prevData) => ({
          ...prevData,
          probability: 0,
          probabilities: [],
          symptoms:[],
          send: false,
        }));

        // console.log(res.data);
        setVisible(false);
        navigation.navigate('Diagnostic', {consultationId:consultation_Id});
      } catch (error) {
        console.error(error);
        setVisible(false);
        navigation.navigate('Diagnostic', {consultationId:consultation_Id});
      }
    }
  };

  fetchData();
}, [notifySendData]);


const getMaladieByAbbr = async() =>{
  try {
    const token = await AsyncStorage.getItem("token");
    axios.get(API_BASE_URL+"/api/maladies/maladie/name/"+data.maladiesDetected[0].abbr,{
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    }).then(response =>{
      // console.log(response.data);
      setData((prevData) => ({
        ...prevData,
        maladiesDetected: [
          {
            ...prevData.maladiesDetected[0],
            id: response.data.maladie.id,
          },
        ],
      }));

      setData((prevData) => ({
        ...prevData,
        maladies: [
          {
            ...prevData.maladies[0],
            id: response.data.maladie.id,
          },
        ],
      }));

      setData((prevData) => ({
        ...prevData,
        send: !data.send,
      }));

      // console.log("We are changing the value of id of maladie by getMaladiesByAbbr ");
      setNotifySendData(true)
    }).catch(error =>{
      console.log(error);
    })
  } catch (error) {
    console.log(error);
  }
}




  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: image }}
            />
            {image == null ? <Text>Tap here to upload your image</Text> : <Text></Text>}
          </View>
        </View>
      
        {!startCamera &&  <TouchableOpacity  onPress={__startCamera}>
            <View style={{marginLeft:10}}>
              <Icon name="camera" size={20} color="black" />
            </View>
          </TouchableOpacity>}
      </TouchableOpacity>

      {image && !startCamera && 
      <ScrollView style={styles.scrollView}>
      <View style={styles.checkboxContainer}>
        {symptoms.map((symptom, index) => (
          <CheckBox
            key={index}
            title={symptom}
            checked={checkBoxValues[symptom]}
            onPress={() => handleCheckBoxChange(symptom)}
          />
        ))}
      </View>
    </ScrollView>
      }

      {
        <Modal visible={visible} transparent={true} animationType="slide">
        <View style={styles.containerLoading}>
          <View style={styles.horizontal}>
            <ActivityIndicator size="large" color="green" />
          </View>
        </View>
      </Modal>
      }

      {
        image && !startCamera && <Button title="Confirm" onPress={handleSubmit} />
      }

      {startCamera && (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={cameraType}
            ratio="16:9"
            ref={camera}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={() => setPreviewVisible(true)}
              >
                {/* <Text style={styles.captureButtonText}>Take Picture</Text> */}
                <Icon name="camera" size={30} color="black" />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  imageContainer: {
    alignItems: 'center',
  },
  scrollView: {
    marginTop: 10,
    flex: 1,
  },
  checkboxContainer: {
    marginTop: 20,
  },

  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },




  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20
  },
  captureButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  captureButtonText: {
    fontSize: 16,
    color: 'black',
  },
});
