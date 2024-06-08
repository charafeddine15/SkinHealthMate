import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, RefreshControl } from 'react-native';
import ConsultationCard from './ConsultationCard';
import { API_BASE_URL } from './apiConfig';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const Consultations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [token, setToken] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const getToken = async () => {
    try {
      const t = await AsyncStorage.getItem("token");
      const username = await AsyncStorage.getItem("username")
      const response = await axios.get(
          API_BASE_URL + '/api/consultations/listeConsultations/dermato/'+username,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${t}`
            },
          }
      );
      // console.log(response.data);
      setConsultations(response.data);
    } catch (error) {
      console.log(error);
      console.log("error dans la partie consultation");
    }
  };

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    await getToken();
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  const searchFilter = (text) => {
    setSearchQuery(text);
    const query = text.toLowerCase();
    const filteredData = consultations.filter(item =>
      item.rendezVous.patient.user.firstName.toLowerCase().includes(query) ||
      item.rendezVous.patient.user.lastName.toLowerCase().includes(query) ||
      item.rendezVous.patient.telephone.toLowerCase().includes(query) ||
      item.rendezVous.dateDebut.toLowerCase().includes(query)
    );
    setFilteredConsultations(filteredData);
  };

  const renderItem = ({ item }) => (
      <ConsultationCard item={item} />
  );

  return (
      <View style={styles.container}>
        <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            onChangeText={searchFilter}
            value={searchQuery}
        />
        <FlatList
            data={filteredConsultations.length > 0 ? filteredConsultations : consultations}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={fetchData}
              />
            }
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 60,
  },
  searchInput: {
    height: 40,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#A9A9A9',
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: -50,
  },
});

export default Consultations;
