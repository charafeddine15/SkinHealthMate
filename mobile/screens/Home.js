import { React, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Home() {
  const [maValeur, setMavaleur] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const valeurStockee = await AsyncStorage.getItem('maValeur');
        if (valeurStockee !== null) {
          setMavaleur(valeurStockee)
        }
      } catch (error) {
        console.error('erreur lors de la recuperation', error);

      }
    };
    getData();
  }, []);
  return (
    <View>
      <Text>  {maValeur}</Text>

    </View>
  )
}
export default Home;
