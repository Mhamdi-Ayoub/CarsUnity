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
    SafeAreaView,
    StyleSheet,
    KeyboardAvoidingView
    , Platform
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import { CardReponderReclamation, Cardadmin } from '../components/Card';
import { FontAwesome } from '@expo/vector-icons';

import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import { API_URL } from '@env';
import { Toast } from 'react-native';

import { useTheme, tem } from '../components/global';


const Creereclamation = ({ navigation }) => {
    const { isDark, handlePress, isChecked } = useTheme();

    const state = useSelector((state) => state.user.value);
    const { id: userId } = state;
    const [text, setText] = useState('');
    const [posts, setPosts] = useState([]);

    useEffect(() => {


        const fetchPosts = async () => {
            try {
                const response = await fetch(`${API_URL}reclamation/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to select reclamation de le profile');
                }
                const data = await response.json();
                setPosts(data.reclamation); // Correction ici
                console.log("reclamation", data.reclamation)
            } catch (error) {
                console.error('Error fetching reclamations:', error);
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



    const handleSendReclamation = () => {



        if (text.trim() !== '') {


            const nouveauCommentaire = { content: text, user: userId, repender: "" };
            axios
                .post(`${API_URL}reclamation`,
                    nouveauCommentaire,
                )
                .then((res) => {
                    console.log(res.data);
                    if (res.data.status == "Ok") {

                        Toast.show({
                            type: "success",
                            text1: "ajouter Reclamation",
                        });
                        setText('')
                    }
                })

        }

    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tem.background, paddingHorizontal: 22 }}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 16 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", left: 0 }}>
                    <MaterialIcons name="keyboard-arrow-left" size={24} color={tem.shad} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: tem.text }}>Reclamation</Text>
            </View>


            <ScrollView contentContainerStyle={styles.scrollViewContainer}>



            {posts.map(post => (
                
                  <CardReponderReclamation  key={post._id}id={post._id} pdp={post.user.image} name={post.user.name} date={post.date_envoie} content={post.content} repender={post.repender} ></CardReponderReclamation>


                ))}
            </ScrollView>


            <View style={{ flexDirection: 'row' }}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.keyboardAvoidingContainer}>
                    <TextInput
                        style={styles.input2}
                        onChangeText={setText}
                        value={text}
                        placeholder="Entrez votre Reclamation ici"
                    />

                </KeyboardAvoidingView>
                <TouchableOpacity onPress={handleSendReclamation}>
                    <FontAwesome name="send" size={24} color={tem.shad} style={{ marginLeft: -25, marginTop: 10 }} />
                </TouchableOpacity>

            </View>




        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    scrollViewContainer: {
        alignItems: 'center',
        flexGrow: 1,
    }, keyboardAvoidingContainer: {
        alignItems: 'left',
        paddingBottom: 20,
        width: "94%",
        marginLeft: 10
    },
    input2: {
        height: 40,
        width: '90%',
        borderRadius: 20,
        backgroundColor: tem.shad,
        paddingHorizontal: 10,
        textAlign: 'left',
        marginTop: 5,
        marginBottom: -13
    }

});

export default Creereclamation;
