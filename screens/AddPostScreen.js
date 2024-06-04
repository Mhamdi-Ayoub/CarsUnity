import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Image, FlatList, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_URL } from '@env';
import { useSelector } from "react-redux";
import { useTheme, tem } from '../components/global';
import { Dimensions } from 'react-native';


const AddPostScreen = () => {

  const { isDark, handlePress, isChecked } = useTheme();

  const windowWidth = Dimensions.get('window').width;

  const navigation = useNavigation();
  const state = useSelector((state) => state.user.value);
  const { id: userId } = state;
  const [profile, setProfile] = useState([]);



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}user/${userId}`);
        console.log(response)

        if (!response.ok) {
          throw new Error('Failed to select profile');
        }
        const data = await response.json();
        setProfile(data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUser();


  }, []);
  const pdp1 = profile.image || "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745";
  const date1 = "jj-mm-aaaa";
  const title1 = `${profile.name} ${profile.lastname}`;
  const description1 = "";

  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagesBase64, setImagesBase64] = useState([]);



  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 4],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      console.log("selectedImages", selectedImages);
      if (selectedImages.length <= 10) {
        const isSafe = await checkImagesForViolence(selectedImages);
        if (isSafe) {
          setSelectedImages(selectedImages);

          // Convertir chaque image en base64 et les stocker dans imagesBase64
          const imagesAsBase64 = await Promise.all(selectedImages.map(async (imageUri) => {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const base64 = await blobToBase64(blob);
            return base64;
          }));
          setImagesBase64(imagesAsBase64);
        } else {
          console.log("One or more images contain violence. Please select different images.");
        }
      } else {
        console.log("Vous ne pouvez sélectionner que jusqu'à 10 images.");
      }
    }
  };

  const checkImagesForViolence = async (imageUris) => {
    for (const uri of imageUris) {
      const response = await fetch(uri);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

      const predictionResponse = await fetch('http://127.0.0.1:3000/predict', {
        method: 'POST',
        body: formData,
      });

      const predictionData = await predictionResponse.json();
      if (predictionData.prediction === "violence") {
        return false;
      }
    }
    return true;
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };




  const renderSelectedImageItem = ({ item }) => (
    <TouchableOpacity onPress={() => console.log(imagesBase64)}>
      <Image
        source={{ uri: item }}
        style={{
          height: 300,
          width: 400,
          borderRadius: 10,
          marginLeft: 5,
          marginRight: 5
        }}
      />
    </TouchableOpacity>
  );

  const onPress = () => {
    navigation.navigate("Home");
  };
  const handlePostSubmit = async () => {
    try {

      if (!userId) {
        console.error('User not Found');
        return;
      }
      const postData = { userId, content, imagesBase64 };
      await axios.post(`${API_URL}create-post`, postData);
      console.log('Post created successfully');
      setContent("");
      setSelectedImages([])
    } catch {
      console.log("Impossible de créer ce poste")
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tem.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />





      <View style={{ flexDirection: 'row', alignItems: 'left', height: 50, paddingHorizontal: 20, marginTop: 5 }}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={{ width: 50, height: 50, borderRadius: 25 }}
            source={{ uri: pdp1 }}
          />
          <View style={{ flexDirection: 'col' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: tem.text, marginTop: 8, marginLeft: 10 }}>{title1}</Text>
            <Text style={{ fontSize: 12, color: tem.shad, marginTop: 1, marginLeft: 10 }}>{date1}</Text>
          </View>
        </View>


        <Pressable
          style={{
            width: "40%",
            height: "auto",
            backgroundColor: tem.shad,
            padding: 10,
            marginTop: 10,
            marginRight: "0%",
            marginLeft: "10%",
            marginBottom: 0,
            borderRadius: 15,
          }}
          onPress={handlePostSubmit}>
          <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: tem.button, marginTop: -5 }}>Ajouter</Text>
        </Pressable>
      </View>






      <ScrollView contentContainerStyle={styles.scrollViewContainer}>

        <TextInput
          style={styles.input}
          defaultValue={description1}
          multiline={true}
          placeholder='Description'
          value={content}
          onChangeText={(text) => setContent(text)}
        />


        {selectedImages.length > 0 ? (
          <View style={{ flexDirection: 'row', marginBottom: 30 }}>
            <ScrollView horizontal>
              {selectedImages.map((imageUri, index) => (
                <Image
                  key={index}
                  style={{ width: windowWidth, height: 400, resizeMode: "cover", marginRight: 4 }}
                  source={{ uri: imageUri }}
                />
              ))}
            </ScrollView>
          </View>
        ) : (
          <TouchableOpacity onPress={handleImageSelection}>
            <Ionicons name="image-outline" style={{ marginTop: 200, marginLeft: "42%" }} size={80} color={tem.shad} />
          </TouchableOpacity>
        )}


        <Text style={{ color: tem.background }}>.</Text>
      </ScrollView>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tem.background,
  },
  scrollViewContainer: {
    alignItems: 'left',

    flexGrow: 1,
    marginTop: 10
  },
  keyboardAvoidingContainer: {
    alignItems: 'left',
    paddingBottom: 20,
    width: "94%",
    marginLeft: 10
  },

  input: {
    height: 180,
    width: '96%',
    marginLeft: "2%",
    borderRadius: 10,
    borderColor: tem.shad,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 5,
    textAlignVertical: 'top', // Pour que le texte démarre à partir du haut
  },
  miniinput: {
    height: 30,
    width: '47%',
    marginLeft: "2%",
    borderRadius: 10,
    borderColor: tem.shad,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
});
export default AddPostScreen;
