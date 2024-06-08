import { View, Text ,ScrollView} from 'react-native'
import React from 'react';
import Card from "./Card";
import CardSearch from "./CardSearch";

export default function Timer() {
  const data = [
    { name: 'Doe John', phone: '123-456-7890' , date:'21-02-2022' },
    { name: 'Smith Jane', phone: '987-654-3210' ,date:'21-02-2022'},
    { name: 'Johnson Bob', phone: '555-123-4567' ,date:'21-02-2022'},
    // Ajoutez d'autres données au besoin
  ];
  return (
    <ScrollView>
    {data.map((item, index) => (
      <Card key={index} name={item.name} phone={item.phone}  date={item.date} />
    ))}
  
  </ScrollView>
  )
}