import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';

import Card from './Card'; // Assurez-vous d'importer correctement votre composant Card

export default function CardSearch(props) {
  const { cards } = props; // cards est un tableau d'objets avec les propriétés name, phone, et date
  const [searchText, setSearchText] = useState('');

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      <FlatList
        data={filteredCards}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Card name={item.name} phone={item.phone} date={item.date} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingLeft: 10,
  },
});
