import React, { useState, useEffect, useRef } from 'react';
import { Pressable, TouchableOpacity, Image, SafeAreaView, View, TextInput, Text, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme, tem } from '../components/global';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useSelector } from "react-redux";
import { API_URL } from '@env';
import axios from 'axios';


const Addpost = ({ description1, title1, date1, img1, pdp1 }) => {
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
  pdp1 =profile.image ||  "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
  img1 = [

    'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg',
    'https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg',
  ];
  date1 = "jj-mm-aaaa"
  title1 =  profile.name +" "+profile.lastname||"ahmed"
  description1 = ""
  const { isDark, handlePress, isChecked } = useTheme();
  const navigation = useNavigation(); // Use useNavigation hook to access navigation
  const windowWidth = Dimensions.get('window').width;
  const [text, setText] = useState('');
  const onChangeText = (inputText) => {
    setText(inputText);
  };
  const ok = true
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
          }}>
          <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: tem.button,marginTop:-5 }}>Ajouter</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
     
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          defaultValue={description1}
          multiline={true}
          placeholder='Description'
        />


        {ok && (
          <View style={{
            flexDirection: 'row', marginBottom: 30,
          }}>
            <ScrollView horizontal>
              {img1.map((imageUri, index) => (
                <Image
                  key={index}
                  style={{ width: windowWidth, height: 400, resizeMode: "cover", marginRight: 4 }}
                  source={{ uri: imageUri }}
                />
              ))}
            </ScrollView>

          </View>
        )}
         {!ok && (
        <Ionicons name="image-outline" style={{marginTop:200,marginLeft:"42%"}} size={80} color={tem.shad} />
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

export default Addpost;

