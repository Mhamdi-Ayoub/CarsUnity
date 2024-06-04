import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, Platform, SafeAreaView, StatusBar, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, View, Text, StyleSheet, Pressable } from 'react-native';
import { tem, useTheme } from '../components/global';
import { Amis, Card } from '../components/Card';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
//import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

import { SimpleLineIcons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { API_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import * as authActions from "../../store/actions/auth";


const ProfileEntreprise = () => {
    const state = useSelector((state) => state.user.value);
    const { id: userId } = state;
    const navigation = useNavigation();
    //const dispatch = useDispatch();
  //const userId = useSelector((state) => state.auth.userId);

    const [profile, setProfile] = useState([]);
    const [posts, setPosts] = useState([]);
  

    const windowWidth = Dimensions.get('window').width;
    const images = [
        "https://www.fiches-auto.fr/sdoms/shiatsu/uploaded/bareme-main-oeuvre.jpg",
        "https://img.fruugo.com/product/0/27/846084270_max.jpg",
        "https://images.ctfassets.net/t8hyxlfhaeun/1IB9NA8el13iT8lk9UAP25/f648182e07b79c559df0582fd2fbd934/freins_blanc_1000x1000.jpg",
        "https://th.bing.com/th/id/R.32b8ac08882dc333c6ffc23cde65f18d?rik=99RqoPAg3JBtWw&pid=ImgRaw&r=0",
        "https://cached.tptools.com/RS/SR/product/35/One-Step-Cleaner-and-Wax-3M-%5E_3m-39006_R_242e7897.jpg",
        "https://th.bing.com/th/id/R.983e4da36eb1b90d7568c8168e0aec6f?rik=4ok4CIQfSkPYNA&pid=ImgRaw&r=0",
        "https://th.bing.com/th/id/R.32b8ac08882dc333c6ffc23cde65f18d?rik=99RqoPAg3JBtWw&pid=ImgRaw&r=0",
        "https://cached.tptools.com/RS/SR/product/35/One-Step-Cleaner-and-Wax-3M-%5E_3m-39006_R_242e7897.jpg",
        "https://img.fruugo.com/product/6/78/587057786_max.jpg",

    ]


    const handleLogout = async () => {
        try {
         // const userId = getUserId(); 
      
         
            AsyncStorage.removeItem("userToken")
            navigation.navigate("Login")
         
          
        } catch (error) {
          console.error("Error logging out user 2", error);
          // Gérez ici les erreurs de connexion
        }
      };


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
                const response = await fetch(`${API_URL}post/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to select posted de le profile');
                }
                const data = await response.json();
                setPosts(data.posts); // Correction ici
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchUser();
        fetchPosts();

        const intervalId = setInterval(() => {
            fetchUser();
            fetchPosts();
        }, 15000); // Appel de fetchUser et fetchPosts toutes les 15 secondes

        return () => clearInterval(intervalId); // Nettoyage de l'intervalle lors du démontage du composant
    }, []);
    const bio = profile.bio || ''; // Initialize bio to an empty string if profile.bio is undefined
    const name = profile.name || ''; // Initialize name to an empty string if profile.name is undefined
    const lastname = profile.lastname || ''; // Initialize lastname to an empty string if profile.lastname is undefined
    const pdp = profile.image || ''; // Initialize pdp to an empty string if profile.image is undefined


    const [showOptions, setShowOptions] = useState(false); // État pour contrôler la visibilité de l'interface

    const [showFullbio, setShowFullbio] = useState(false);

    const { isDark } = useTheme(); // Récupérer la variable isDark du thème
    const [isScrollingDown, setIsScrollingDown] = useState(false); // État pour suivre si l'utilisateur fait défiler vers le bas

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





    return (
        <SafeAreaView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={0}
            style={[styles.container,{backgroundColor: tem.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />



            <ScrollView contentContainerStyle={styles.scrollViewContainer}>

              
            {showOptions && (
              <View transparent style={styles.optionsContainer}>
                {/* Contenu de l'interface d'options ici */}

                {profile.numportable && (
                  <View style={{ flexDirection: 'col' }}>
                    <Feather name="phone-call" size={24} color={tem.shad} />
                    <Text style={[styles.optionText, { marginLeft: 10 ,marginTop:5 }]}>{profile.numportable}</Text>
                  </View>
                )}

                {profile.workspace && (
                  <View style={{ flexDirection: 'col' }}>
                    <MaterialIcons name="workspaces-outline" size={24} color={tem.shad} />
                    <Text style={[styles.optionText, { marginLeft: 10,marginTop:5 }]}>{profile.workspace}</Text>
                  </View>
                )}

                {profile.date && (

                  <View style={{ flexDirection: 'col' }}>
                    <FontAwesome name="birthday-cake" size={24} color={tem.shad} />
                    <Text style={[styles.optionText, { marginLeft: 10 ,marginTop:5 }]}>{profile.date}</Text>              </View>

                )}

                {profile.age && (

                  <View style={{ flexDirection: 'col' }}>
                    <Fontisto name="date" size={24} color={tem.shad} />
                    <Text style={[styles.optionText, { marginLeft: 10 ,marginTop:5 }]}>{profile.age}</Text>


                  </View>
                )}




                <TouchableOpacity onPress={() => handleLogout()}>
                  <Text style={styles.optionText}>Déconnecter</Text>
                </TouchableOpacity>

              </View>
            )}



                <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
                    <SimpleLineIcons name="options-vertical" size={20} color={showOptions ? tem.button : tem.shad} style={{ marginLeft: "90%", marginTop: 15 }} />
                </TouchableOpacity>

                <View style={{ marginLeft: "36%", marginTop: -23, flexDirection: 'row', alignItems: 'center' }}>

                    <Image
                        style={{ width: 120, height: 120, marginRight: "70%", borderRadius: 60, resizeMode: "cover" }}
                        source={{ uri:profile.image }}

                    />

                </View>

                <View style={{ width: '100%', marginTop: 10 }}>

                    <Text style={{ fontWeight: 'bold', marginTop: 5, fontSize: 18, color: tem.text, alignItems: 'center', textAlign: 'center' }}>{profile.name} {profile.lastname} </Text>

                    <View style={{
                        width: '60%', marginTop: 10, marginLeft: "2%",
                    }}>
                        <Text style={{ fontSize: 14, color: tem.text }}>
                            {bio && (showFullbio ? bio : bio.substring(0, 70))}
                        </Text>
                        {bio.length > 70 && (
                            <View style={{ flexDirection: 'row' }}>
                                {!showFullbio && (
                                    <TouchableOpacity onPress={() => setShowFullbio(true)}>
                                        <Text style={{ color: tem.button, marginLeft: 12 }}>Voir plus</Text>
                                    </TouchableOpacity>
                                )}
                                {showFullbio && (
                                    <TouchableOpacity onPress={() => setShowFullbio(false)}>
                                        <Text style={{ color: tem.button, marginLeft: 12 }}>Voir moins</Text>
                                    </TouchableOpacity>
                                )}
                            </View>



                        )}
                    </View>





                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'left' }}>




                    <Pressable
                        style={{
                            width: "49%",
                            height: "auto",
                            backgroundColor: tem.shad,
                            padding: 10,
                            marginTop: 10,
                            marginLeft: "5%",

                            borderRadius: 15,
                        }}
                        android_ripple={{
                            color: isDark ? tem.shad : tem.button, // Couleur du ripple selon le thème
                            borderless: false, // Changez cette valeur si vous voulez un effet ripple sans bordure
                        }}
                        onPress={() => navigation.navigate('EditProfile', { pdp: pdp, name: name, lastname: lastname, description: bio, agee: profile.age , num: profile.numportable, local: profile.workspace,admin:"2" })}>

                        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: tem.text }}>modifer </Text>
                    </Pressable>

                    <TouchableOpacity onPress={() => navigation.navigate('messanger')} >
                        <FontAwesome6 name="facebook-messenger" size={24} color={tem.shad} style={{ marginLeft: "7%", marginTop: 3 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Listefollow', { admin: "2", ok: false })}>


                        <MaterialIcons name="domain-add" size={30} color={tem.shad} style={{ marginLeft: "7%", marginTop: 3 }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Listefollow', { admin: "3", ok: false })}>
                        <MaterialIcons name="add-shopping-cart" size={33} color={tem.shad} style={{ marginLeft: "7%", marginTop: 3 }} />
                    </TouchableOpacity>
                </View>



                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 10, marginTop: 5 }}
                >

                    {profile.entreprises && profile.entreprises.map((id, index) => (
                        <View key={index} style={{ marginRight: 18, alignItems: 'center' }}>
                         {id!=userId&&(   <Amis id={id} amis={true} etat={3} />)}
                        </View>
                    ))}
                    <TouchableOpacity onPress={() => navigation.navigate('Listefollow', { admin: "2", ok: true })}>

                        <View style={{ alignItems: 'center', marginTop: 15, marginLeft: 10 }}>
                            <AntDesign name="pluscircleo"
                                size={60} color="gray" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>

                
                <View style={{ marginTop: 3, marginLeft: 5, flex: 1, backgroundColor: tem.background, alignItems: 'center', width: "97%" }}>
                    {posts.map(post => (

                        <Card
                        key2={profile._id}
                            idpost={post._id}
                            key={post._id}
                            description={post.content}
                            title={`${name} ${lastname}`}
                            date={post.createdAt}
                            img={post.urls} // Utilisation d'un tableau vide car il s'agit d'un document texte
                            pdp={pdp}
                        />

                    ))}
                </View>

                {/*
                <View style={{ flexDirection: 'col', marginTop: 5 }}>

                </View>




                <View style={{ marginTop: 3, marginLeft: 5, flex: 1, backgroundColor: tem.background, alignItems: 'center', width: "97%" }}>

                    <Card description="Tapis 3p luxe I de gamme qualité🌸 produits Original Made in TUNIS 🇹🇳 🎗Dimensions disponibles :💥Mètrage exacte:
✅ Lkbiyra 115/170
✅ Esghar 70/120 = 98d " title="Ayoub Belgacem" date=" 20-10-2024" img={images} pdp='https://qph.cf2.quoracdn.net/main-thumb-46199720-200-ukqzklgrfowrbxnsjbppoktgzoxxvurk.jpeg' />
                    <Card description="azer azzegerggzegeegghogiuhoiuerhrguirbgboeribfvuyrehgyeogrouge" title="Ayoub Belgacem" date=" 20-10-2024" img={images} pdp='https://qph.cf2.quoracdn.net/main-thumb-46199720-200-ukqzklgrfowrbxnsjbppoktgzoxxvurk.jpeg' />
                    <Card description="azer oyggfviygfuyfcutfydxrdxcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccouygoiygiygoiygouhygbuhvbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbazzegerggzegeegghogiuhoiuerhrguirbgboeribfvuyrehgyeogrouge" title="Ayoub Belgacem" date=" 20-10-2024" img={images} pdp='https://qph.cf2.quoracdn.net/main-thumb-46199720-200-ukqzklgrfowrbxnsjbppoktgzoxxvurk.jpeg' />
                    <Card description="azer azzegerggzegeegghogiuhoiuerhrguirbgboeribfvuyrehgyeogrouge" title="Ayoub Belgacem" date=" 20-10-2024" img={images} pdp='https://qph.cf2.quoracdn.net/main-thumb-46199720-200-ukqzklgrfowrbxnsjbppoktgzoxxvurk.jpeg' />


                </View>
            */}
            </ScrollView>
            <Text style={{ color: tem.background, marginTop: 20 }}>.</Text>

        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    input: {
        flex: 1,
        color: tem.text,
        fontSize: 16,
    },
    optionsContainer: {
        position: 'absolute',
        top: 60, // Positionnez-le où vous voulez qu'il apparaisse
        right: 20,
        zIndex: 2,
        backgroundColor: "#ffffff",

        padding: 10,
        borderRadius: 10,
        shadowColor: tem.shad,
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 3,
        elevation: 5,
        width: "60%",
        height: 700,
        color: tem.text
    },
    card: {
        backgroundColor: tem.background,
        borderRadius: 10,

        shadowColor: tem.text,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 30,
        elevation: 5,
        width: "45%",
        height: 300,
        marginBottom: 12,
        marginLeft: "3%"

    },
    carddepost: {
        backgroundColor: tem.background,
        borderRadius: 10,

        shadowColor: tem.text,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 30,
        elevation: 5,
        width: "96%",
        height: 700,
        marginTop: 12,
        marginLeft: "2%"

    },
    container: {
        flex: 1,
        backgroundColor: tem.background,
        paddingTop: 0,
        width: "100%",
    },
    scrollViewContainer: {
        alignItems: 'left',
        flexGrow: 1,
    },
    keyboardAvoidingContainer: {
        flex: 1,
        marginLeft: "51%",
        width: "45%",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'left',
        backgroundColor: tem.shad,
        borderRadius: 15,

    },
    searchIcon: {
        marginRight: 10,
        marginBottom: 0
    },
    lastMessage: {
        color: tem.text,
        marginTop: 0,
    },
    imageNumber: {
        position: 'absolute',
        top: 70,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5,
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default ProfileEntreprise;