// ConsultationCard.js

import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView} from 'react-native';
import {Card, Paragraph, Title} from "react-native-paper";
import { Root, Popup } from 'popup-ui'
const DiagnosticCard = ({ item }) => {

    const [openModal, setOpenModal] = useState(false)
    const maladies = {0: "akiec", 1: "bcc", 2: "bkl", 3: "df", 4: "mel", 5: "nv", 6: "vasc"}
    const [probabilities, setProbabilities] = useState(item.probabilities)
    const [symptoms, setSymptoms] = useState(item.symptoms)
    const [maladiePretected, setMaladiePretected] = useState(item.maladiesDetected[0].abbr)
    const [description, setDescription] = useState(item.description);
    const [prescription, setPrescription] = useState(item.prescription);
    const  getDate = (date) =>{
        const dateObject = new Date(date);
        dateObject.setHours(dateObject.getHours()+1)
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1;

        const day = dateObject.getDate();
        return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    }
    const getHour = (date) =>{
        const dateObject = new Date(date);
        dateObject.setHours(dateObject.getHours()+1)
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const seconds = dateObject.getSeconds();
        return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }

    const handleClickItem = () =>{
        // alert("item clicked ...")
        // alert(item.dateDiagnostic)
        setOpenModal(true)
    }

    function getIndexByValue(value) {
        const values = Object.values(maladies);
        const index = values.indexOf(value);
        return probabilities[index];
    }

    function renderModal(){
        return(
            <Modal visible={openModal} animationType="slide" transparent={true}>


                <View style={styles.modalView}>


                        <View style={styles.backgroundModal}>
                            <Text style={styles.cardTitle}>Diagnostic details</Text>
                            <View style={styles.hr}></View>

                            <ScrollView>
                                <View style={styles.card}>
                                    <Text style={styles.titre}>Statistics</Text>
                                    <View style={styles.hr}></View>

                                    {probabilities.map((e, index) => (
                                        <View key={index} style={styles.probabilityContainer}>
                                            <View style={{flexDirection:"row", justifyContent: 'space-between',}}>
                                                <Text style={styles.probabilityTitle}>{maladies[index]}</Text>
                                                <Text style={styles.probabilityValue}>{e}%</Text>
                                            </View>
                                            <View style={styles.hr}></View>
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.container}>
                                    <View style={styles.card}>
                                        <Text style={styles.titre}>Diagnostic image</Text>
                                        <View style={styles.imageContainer}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: `data:image/png;base64,${item.picture}` }}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.card}>
                                        <Text style={styles.titre}>Degree of Certainty</Text>
                                        <View style={{flexDirection:"row", justifyContent: 'space-between',}}>
                                            <Text style={styles.probabilityTitle}>{maladiePretected}</Text>
                                            <Text style={styles.probabilityValue}>{getIndexByValue(maladiePretected)}%</Text>
                                        </View>
                                    </View>

                                    <View style={styles.card}>
                                        <Text style={styles.titre}>Symptoms</Text>
                                        {
                                            symptoms.map((e,index) =>(
                                                <Text key={index} style={styles.paragraphe}>* {e}</Text>
                                            ))
                                        }
                                    </View>

                                    <View style={styles.card}>
                                        <Text style={styles.titre}>Requirements</Text>
                                        <Text style={styles.paragraphe}>{description ? "*":''} {description}</Text>
                                        <Text style={styles.paragraphe}>{prescription ? "*":''} {prescription}</Text>
                                    </View>
                                </View>


                            </ScrollView>
                        </View>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setOpenModal(false)}
                    >
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    return (
        <TouchableOpacity onPress={handleClickItem}>
            <View style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: `data:image/png;base64,${item.picture}` }}
                    />
                </View>

                <View style={{
                    flexDirection:"column"
                }}>

                    <View style={{
                        flexDirection:"row",
                        justifyContent:'space-between'
                    }}>
                        <Text style={styles.label}>Disease</Text>
                        <Text style={styles.value}> {item.maladies[0].abbr}</Text>
                    </View>
                    <View style={styles.hr}></View>

                    <View style={{
                        flexDirection:"row",
                        justifyContent:'space-between'
                    }}>
                        <Text style={styles.label}>Probabilty</Text>
                        <Text style={styles.value}> {item.probability}</Text>
                    </View>
                    <View style={styles.hr}></View>


                    <View style={{
                        flexDirection:"row",
                        justifyContent:'space-between'
                    }}>
                        <Text style={styles.label}>Date</Text>
                        <Text style={styles.value}> {getDate(item.dateDiagnostic)}</Text>
                    </View>
                    <View style={styles.hr}></View>

                    <View style={{
                        flexDirection:"row",
                        justifyContent:'space-between'
                    }}>
                        <Text style={styles.label}>Hour</Text>
                        <Text style={styles.value}> {getHour(item.dateDiagnostic)}</Text>
                    </View>
                </View>
            </View>
            {renderModal()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // cardContainer: {
    //     borderWidth: 1,
    //     borderColor: '#ddd',
    //     borderRadius: 5,
    //     padding: 10,
    //     marginBottom: 10,
    //     flexDirection: 'row',
    // },
    textContainer: {
        marginTop:10,
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    // label: {
    //     fontWeight: 'bold',
    //     // color: ''
    //     fontSize: 18,
    // },

    modalView:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    backgroundModal:{
        backgroundColor:"white",padding:15,width:"98%",borderRadius:10,height:"98%"
    },

    carddContainer: {
        backgroundColor: '#F9EADC',
        padding: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width:"100%",
        display:"flex",


    },
    carContainer:{
        marginTop:12,
        backgroundColor: '#F9EADC',
        padding: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width:"100%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    // cardTitle: {
    //     textAlign:'center',
    //     fontSize: 20,
    //     fontWeight: 'bold',
    //     marginBottom: 8,
    //
    // },
    titleCard:{
        fontSize:14,
        fontWeight: 'bold',
        padding:10,
        textAlign:"center",
    },
    cardContent: {
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'transparent',
        padding: 10,
    },
    closeButtonText: {
        color: 'red',
        fontSize: 40,
    },

    // hr: {
    //     borderBottomColor: 'black',
    //     borderBottomWidth: 1,
    //     marginVertical: 10,
    // },

    imageeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // // paddingHorizontal: 16,
        marginTop: 10,
        // width:"100%",
        backgroundColor: '#F9EADC',
        // marginRight: 10,
    },
    imageItem: {
        flex: 1,
        alignItems: 'center',
    },
    verticalLine: {
        width: 1,
        backgroundColor: 'black',
    },
    requirements:{
        alignItems: 'flex-start',
    }
,


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
    titre: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    paragraphe: {
        fontSize: 20,
        lineHeight: 24,
    }
    ,
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 8,
        marginTop: 8,
        marginBottom:12
    },


    // cardContainer: {
    //     flexDirection: 'column',
    //     backgroundColor: '#fff',
    //     borderRadius: 8,
    //     padding: 16,
    //     margin: 16,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 4,
    //     elevation: 4,
    // },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    // hr: {
    //     borderBottomColor: '#ccc',
    //     borderBottomWidth: 1,
    //     marginVertical: 8,
    // },
    probabilityContainer: {
        marginBottom: 8,
    },
    probabilityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    probabilityValue: {
        fontSize: 16,
        color: '#555',
    },


    cardContainer: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },

    hr: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 8,
    },
    label:{
        fontSize: 16,
        // fontWeight: 'bold',
        marginBottom: 1,
    },
    value:{
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 1,
    },


});

export default DiagnosticCard;
