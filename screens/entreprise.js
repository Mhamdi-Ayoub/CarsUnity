// homeScreen.js
import React, { useState, useEffect, useRef } from 'react';

import { SafeAreaView, View, TextInput, Text, ScrollView, StyleSheet, StatusBar,TouchableOpacity } from 'react-native';
import { useTheme, tem } from '../components/global';
import { Amis, Card } from '../components/Card';
import { API_URL } from '@env';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from "react-redux";

import { useNavigation } from '@react-navigation/native';

const Entreprise = () => {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState([]);
  const navigation = useNavigation();

  const state = useSelector((state) => state.user.value);
  const { id: userId } = state;
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


    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}posts_entreprise`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        console.log(data);
        setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Gérer l'erreur ici, par exemple afficher un message d'erreur à l'utilisateur
      }
    };
    fetchPosts(); // Appel initial de la fonction fetchPosts
    fetchUser();

    const intervalId = setInterval(fetchPosts, 150000); // Appel de fetchPosts toutes les 5 secondes

    // Nettoyage de l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, []); // Le tableau vide signifie que useEffect ne sera exécuté qu'une seule fois après le montage initial du composant






  const { isDark, handlePress, isChecked } = useTheme();
  const images = [
    "https://static.vecteezy.com/ti/vecteur-libre/p1/4607794-la-fille-sourit-employee-de-bureau-la-femme-aux-cheveux-blancs-bureau-manager-designer-entrepreneur-blonde-vector-illustration-flat-avatar-vectoriel.jpg",
    "https://static.vecteezy.com/ti/vecteur-libre/p1/4607796-la-fille-sourit-employee-de-bureau-la-fille-a-lunettes-bureau-manager-designer-entrepreneur-vector-illustration-flat-avatar-vectoriel.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ompgOpNGVrXi2HZlbTQqdKc8ErMcOTMgW3K6YE0n28l_d_jIEo1Wp26fFW2hmMFi0UM&usqp=CAU",
    "https://static.vecteezy.com/ti/vecteur-libre/t2/4607797-man-face-emotive-icon-smiing-american-african-male-character-flat-vector-illustration-isolated-on-white-happy-human-psychological-portrait-positive-emotions-user-avatar-for-app-creation-de-sites-web-vectoriel.jpg",
    "https://static.vecteezy.com/ti/vecteur-libre/p3/4607806-homme-visage-emotif-icone-souriant-barbu-homme-caractere-en-jaune-plat-vector-illustration-isole-sur-blanc-heureux-humain-psychologique-portrait-positif-emotions-utilisateur-avatar-pour-app-web-design-vectoriel.jpg",
    "https://www.shareicon.net/data/512x512/2015/09/18/103160_man_512x512.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6DV--0QFWZYJ0vYl2vInKkgz6X8LCDeldzUi8WM3MnKQ837ov9guuSEiNP2xpgRqMR4I&usqp=CAU",
  ];

  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const scrollViewRef = useRef();

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const previousOffset = scrollViewRef.current ? scrollViewRef.current : 0;

    if (currentOffset > previousOffset && !isScrollingDown) {
      setIsScrollingDown(true); // L'utilisateur a fait défiler vers le bas
    } else if (currentOffset < previousOffset && isScrollingDown) {
      setIsScrollingDown(false); // L'utilisateur a fait défiler vers le haut
    }

    scrollViewRef.current = currentOffset;
  };



  bio = "3oumar el benzarti s7i7 howa men jerba hezze jwabi il jerba hez jwabi el jerba hez jaaaabiii 5alt mak7oul il 3yn jerba "

  return (
    <SafeAreaView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={{ flex: 1, backgroundColor: tem.background, alignItems: "center", paddingTop: 0, width: "100%" }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>


        <View>


          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {profile.amis && profile.entreprises.map((id, index) => (

              <View key={index} style={{ marginRight: 18, alignItems: 'center' }}>
                <Amis id={id} amis={true} etat={2} />

              </View>
            ))}
                    <TouchableOpacity onPress={() => navigation.navigate('Listefollow', { admin: "2", ok: true })}>

              <View style={{ alignItems: 'center', marginTop: 15, marginRight: 18 }}>
                <AntDesign name="pluscircleo"
                  size={60} color="gray" />
              </View>
            </TouchableOpacity>
          </ScrollView>



          <View style={{ marginTop: 3, marginLeft: 5, flex: 1, backgroundColor: tem.background, alignItems: 'center', width: "97%" }}>



            {posts.map(post => (
              <Card key={post.user._id} key2={post.user._id} idpost={post._id} description={post.content} title={post.user.name} date={post.createdAt} img={post.urls} pdp={post.user.image} admin={"2"} />
            ))
            }

          </View>






        </View>
      </ScrollView>
      <Text style={{ color: tem.background, marginTop: 20 }}>.</Text>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    marginTop: 35,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Entreprise;