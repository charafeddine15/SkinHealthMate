import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Card(props) {
  const { name, phone, date } = props;
  return (
    <View style={styles.card}>
      <Image
        source={require('./user.jpg')} // Remplacez 'votre_image.png' par le chemin de votre image
        style={styles.image}
      />
      <Text style={styles.text}>Name: {name}</Text>
      <Text style={styles.text}>Phone: {phone}</Text>
      <Text style={styles.text}>Date: {date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    margin: 10,
    alignItems: 'center',
  },
  image: {
    width: 100, // Ajustez la largeur de l'image selon vos besoins
    height: 100, // Ajustez la hauteur de l'image selon vos besoins
    marginBottom: 10, // Espacement entre l'image et le texte
  },
  text: {
    fontSize: 16,
    marginBottom: 5, // Espacement entre les lignes de texte
  },
});
