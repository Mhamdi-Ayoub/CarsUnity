import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  SafeAreaView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import { Cardadmin } from '../components/Card';

import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import { API_URL } from '@env';
import { Toast } from 'react-native';

import { useTheme, tem } from '../components/global';


const Admin = ({ navigation }) => {
  const { isDark, handlePress, isChecked } = useTheme();

  const state = useSelector((state) => state.user.value);
  const { id: userId } = state;
  const [posts, setPosts] = useState([]);

  useEffect(() => {


    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}reclamations`);
        if (!response.ok) {
          throw new Error('Failed to select reclamationse');
        }
        const data = await response.json();
        setPosts(data.reclamations); // Correction ici
        console.log("reclamations", data.reclamations)
      } catch (error) {
        console.error('Error fetching reclamations', error);
      }
    };

    fetchPosts();

    const intervalId = setInterval(() => {
      //     fetchUser();
      //     fetchPosts();
    }, 150000); // Appel de fetchUser et fetchPosts toutes les 15 secondes

    return () => clearInterval(intervalId); // Nettoyage de l'intervalle lors du démontage du composant
  }, []);


  const [isFocused, setIsFocused] = useState(false); // Ajoutez cet état pour gérer le focus

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };






  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tem.background2, paddingHorizontal: 22 }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background2} />

      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", left: 0 }}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color={tem.shad} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: tem.text }}>Administration</Text>
      </View>
      <View style={{ alignItems: "center", marginTop: 10, marginBottom: 10 }}>
        <Text style={{ color: tem.shad }}> les reclamation de Utilisateur</Text>
      </View>

      <ScrollView horizontal >

        {posts.map(post => (
          post.user.admin == "1" && post.repender == "" && (
            <Cardadmin key={post._id} id={post.user.admin} pdp={post.user.image} name={post.user.name} date={post.date_envoie} content={post.content}  ></Cardadmin>
          )

        ))}



      </ScrollView>

      <View style={{ alignItems: "center", marginTop: 10, marginBottom: 10 }}>
        <Text style={{ color: tem.shad }}> les reclamation de L'entreprise</Text>
      </View>


      <ScrollView horizontal>
        {posts.map(post => (
          post.user.admin == "2" && post.repender == "" && (
            <Cardadmin key={post._id} id={post.user.admin} pdp={post.user.image} name={post.user.name} date={post.date_envoie} content={post.content}  ></Cardadmin>
          )

        ))}  </ScrollView>


      <View style={{ alignItems: "center", marginTop: 10, marginBottom: 10 }}>
        <Text style={{ color: tem.shad }}>les reclamation de Prestataire</Text>
      </View>

      <ScrollView horizontal>

        {posts.map(post => (
          post.user.admin == "3" && post.repender == "" && (
            <Cardadmin key={post._id} id={post.user.admin} pdp={post.user.image} name={post.user.name} date={post.date_envoie} content={post.content}  ></Cardadmin>
          )

        ))}
      </ScrollView>




















    </SafeAreaView>
  );
};

export default Admin;
