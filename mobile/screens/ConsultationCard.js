import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ConsultationCard = ({ item }) => {
    const navigation = useNavigation();


    const  getDate = (date) =>{
        const dateObject = new Date(date);
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1;
        const day = dateObject.getDate();
        return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    }
    const getHour = (date) =>{
        const dateObject = new Date(date);
        const hours = dateObject.getUTCHours();
        const minutes = dateObject.getUTCMinutes();
        const seconds = dateObject.getUTCSeconds();

        return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }
    const handleCardPress = () => {
        const dermatologueId = item.rendezVous.patient.user.id;
        const patientId = item.rendezVous.id;
        const consultationId = item.id
        
        navigation.navigate('Diagnostic', {consultationId });
    };

    return (
        <TouchableOpacity onPress={handleCardPress}>
            <View style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={require('../assets/images/doctor-patient.png')}
                    />
                </View>
                <View style={{
                    flexDirection:"column"
                }}>

                    <View style={{
                        flexDirection:"row",
                        justifyContent:'space-between'
                    }}>
                        <Text style={styles.label}>Patient</Text>
                        <Text style={styles.value}> {item.rendezVous.patient.user.firstName}{' '}
                            {item.rendezVous.patient.user.lastName}</Text>
                    </View>
                    <View style={styles.hr}></View>

                    <View style={{
                        flexDirection:"row",
                        justifyContent:'space-between'
                    }}>
                        <Text style={styles.label}>Phone</Text>
                        <Text style={styles.value}>{item.rendezVous.patient.telephone}</Text>
                    </View>

                    <View style={styles.hr}></View>

                    <View style={{
                        flexDirection:"row",
                        justifyContent:'space-between'
                    }}>
                        <Text style={styles.label}>Date</Text>
                        <Text style={styles.value}>{getDate(item.rendezVous.dateDebut)}</Text>
                    </View>

                    <View style={styles.hr}></View>

                    <View style={{
                        flexDirection:"row",
                        justifyContent:'space-between'
                    }}>
                        <Text style={styles.label}>Hour</Text>
                        <Text style={styles.value}>{getHour(item.rendezVous.dateDebut)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

    imageContainer: {
        justifyContent:'center',
        display:'flex',
        alignItems:'center',
        marginRight: 15,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        borderRadius:50
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

export default ConsultationCard;