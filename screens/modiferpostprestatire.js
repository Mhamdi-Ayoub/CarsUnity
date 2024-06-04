import React, { useState, useRef, useEffect } from 'react';
import { Pressable, TouchableOpacity, Image, SafeAreaView, View, TextInput, Text, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme, tem } from '../components/global';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useSelector } from "react-redux";
import { API_URL } from '@env';
import axios from 'axios';
import * as ImagePicker from "expo-image-picker";


const Modiferpostprestataire = ({ route }) => {
    const { idpost, description1, img1,promo1,prix1 } = route.params;

    const [selectedImages, setSelectedImages] = useState(img1);
    const [imagesBase64, setImagesBase64] = useState(img1);


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
            if (selectedImages.length <= 10) {
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
                console.log("Vous ne pouvez sélectionner que jusqu'à 10 images.");
            }
        }
    };

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


  const pdp1 =profile.image ||  "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
  
  const date1 = "jj-mm-aaaa"
  const title1 =  profile.name +" "+profile.lastname||"ahmed"

    const blobToBase64 = async (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    };

/*
    const handlePostSubmit = async () => {
        try {
            if (!userId) {
                console.error('User not Found');
                return;
            }

            const postData = { prix, promo, userId, content, imagesBase64 };
            await axios.post(`${API_URL}create-service`, postData);
            console.log('Post created successfully');
            setContent("");
        } catch {
            console.log("Post faut")
        }
    }
*/

    // Soumission du formulaire
    const handlePostSubmit = async () => {
        try {
            // Vérification de l'existence de l'ID utilisateur
            if (!userId) {
                console.error('User not found');
                return;
            }
            // Création des données à soumettre
            const postData = { prix, promo,content, userId, imagesBase64 };

            // Envoi des données au serveur
            await axios.put(`${API_URL}update-service/${idpost}`, postData);

            console.log('service updated successfully');
            // Réinitialisation du contenu après soumission
            setContent('');
            setPromo('')
            setPrix('')
            setSelectedImages([])
            navigation.navigate('bottom')

        } catch (error) {
            console.error('Error updated post:', error);
            console.log("service failed");
        }
    };



    const { isDark, handlePress, isChecked } = useTheme();
    const navigation = useNavigation(); // Use useNavigation hook to access navigation
    const windowWidth = Dimensions.get('window').width;

    const [content, setContent] = useState(description1);
    const [promo, setPromo] = useState(promo1);
    const [prix, setPrix] = useState(prix1);

    const onChangeText = (inputText) => {
        setContent(inputText);
    };
    const onChangePromo = (inputText) => {
        setPromo(inputText);
    };
    const onChangeprix = (inputText) => {
        setPrix(inputText);
    };
    const ok = false
    const handleProfileIconPress = () => {
        navigation.goBack(); // Go back when profile icon is pressed
    };

    return (
        <SafeAreaView style={[styles.container,{backgroundColor: tem.background }]}>
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
                    onPress={handlePostSubmit}
                >
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: tem.button, marginTop: -5 }}>Modifer</Text>
                </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        style={styles.miniinput}
                        onChangeText={onChangeprix}
                        value={prix}
                        defaultValue={description1}
                        placeholder="prix d'une pièce"
                    />

                    <TextInput
                        style={styles.miniinput}
                        onChangeText={onChangePromo}
                        value={promo}
                        defaultValue={description1}
                        placeholder='promo en %'
                    />
                </View>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={content}
                    defaultValue={description1}
                    multiline={true}
                    placeholder='Description'
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
}

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

export default Modiferpostprestataire;