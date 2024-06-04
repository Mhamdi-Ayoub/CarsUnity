import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import axios from 'axios'; // Bibliothèque pour effectuer des requêtes HTTP

export default function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [prediction, setPrediction] = useState('');

  const predictViolence = async () => {
    try {
      // Effectuer une requête POST vers l'endpoint backend avec l'URL de l'image
      const response = await axios.post('http://localhost:3000/predict-violence', { imageUrl });
      // Mettre à jour l'état avec le résultat de la prédiction
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Erreur lors de la prédiction de l'image:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
        placeholder="Entrez l'URL de l'image"
        onChangeText={text => setImageUrl(text)}
        value={imageUrl}
      />
      <Button title="Prédire" onPress={predictViolence} />
      {prediction && <Text>Résultat de la prédiction : {prediction}</Text>}
    </View>
  );
}
