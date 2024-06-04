import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Image, SafeAreaView, View, TextInput, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useTheme, tem } from '../components/global';
import { Amis } from '../components/Card';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { API_URL } from '@env';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddPersonneScreen = () => {
    const state = useSelector((state) => state.user.value);
    const { id: userId } = state;
    const personne = true
    const { isDark, handlePress, isChecked } = useTheme();
    const pdp = "https://th.bing.com/th/id/OIP.W6rZ0iO9rEfUStFAMWoozQAAAA?rs=1&pid=ImgDetMain";
    const name = "iheb zayati";
    const bio = "3oumar el benzarti s7i7 howa men jerba hezze jwabi il jerba hez jwabi el jerba hez jaaaabiii 5alt mak7oul il 3yn jerba ";
    const [showadd, setShowadd] = useState(false);
    const scrollViewRef = useRef();
    const navigation = useNavigation();
    const [useres, setUseres] = useState([]);
    const [listedinve, setListedinve] = useState([]);
    const [msg, setMess] = useState("");


    const handleProfileIconPress = () => {
        navigation.goBack();
    };
    const handleaxeptere = async (idd) => {
        try {

            const response = await axios.post(`${API_URL}accepter/${userId}/${idd}`);
            if (response.data.message === "Invitation accepted successfully") {
                console.log(response.data);
                setMess(response.data.message);
            }
        } catch (error) {
            console.error('Error axepeter personne:', error);
        }
    };



    const handleademende = async (idd) => {
        setShowadd(true)
        try {

            const response = await axios.post(`${API_URL}invitation/${userId}/${idd}`);
            if (response.data.message === "User added to invitation list successfully") {
                console.log(response.data);
                setMess(response.data.message);
            }
        } catch (error) {
            console.error('Error demende e invetation :', error);
        }
    };




    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_URL}non-friends2/${userId}`);
                console.log(response)

                if (!response.ok) {
                    throw new Error('Failed to select useres');
                }
                const data = await response.json();
                setUseres(data.nonFriends);

            } catch (error) {
                console.error('Error fetching useres:', error);
            }
        };

        const fetchinve = async () => {
            try {
                const response = await fetch(`${API_URL}listeinvitation/${userId}`);
                console.log(response)

                if (!response.ok) {
                    throw new Error('Failed to select liste de invetation');
                }
                const data = await response.json();
                setListedinve(data.invitedUsers[0]);
            } catch (error) {
                console.error('Error fetching liste de invetation:', error);
            }
        };
        //navigation.goBack();
        fetchUser();
        fetchinve();

        const intervalId = setInterval(() => {
            fetchUser();
            fetchinve();
        }, 20000); // Appel de fetchUser et fetchPosts toutes les 15 secondes
        // Scroll à la fin de la ScrollView lorsque le composant est monté
        scrollViewRef.current.scrollToEnd({ x: 0, y: 0, animated: true });
        return () => clearInterval(intervalId); // Nettoyage de l'intervalle lors du démontage du composant




    }, []);


    const renderCards2 = () => {
        const cards = [];
        if (useres && useres.length) {
            for (let i = 0; i < useres.length; i++) {
                if (useres[i].admin === "1") {
                    cards.push(
                        <View key={useres[i]._id} style={[styles.card, { zIndex: 2 }]}>
                            {!showadd && (
                                    <TouchableOpacity onPress={() => handleademende(useres[i]._id)}>
                                        {personne && (
                                            <Feather name="user-plus" size={35} style={{ color: tem.shad,position: "absolute", left: "85%", marginTop:10}} />
                                        )}
                                        {!personne && (
                                            <View style={{ width: 60, height: 30, backgroundColor: "#D8D9DA", marginTop: 22, alignItems: 'center', borderRadius: 15, marginLeft: "52%", zIndex: 3 }}>
                                                <Text style={{ color: tem.text, marginTop: 3 }}>suivre</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                )}
                                {showadd && (
                                    <View>
                                        {!personne && (
                                            <View style={{ width: 60, height: 30, backgroundColor: "#D8D9DA", marginTop: 22, alignItems: 'center', borderRadius: 15, marginLeft: "80%", zIndex: 3 }}>
                                                <Text style={{ color: tem.button, marginTop: 3 }}>suivi</Text>
                                            </View>
                                        )}
                                        {personne && (
                                            <Feather name="user-check" size={35} style={{ color: tem.button,position: "absolute", left: "85%",  marginTop:10}} />
                                        )}
                                    </View>
                                )}
                                <TouchableOpacity onPress={() => navigation.navigate('Usersprofiel', { userId: useres[i]._id })}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            style={{ width: 50, height: 50, marginTop: 10, marginLeft: 10, borderRadius: 25, resizeMode: "cover" }}
                                            source={{ uri: useres[i].image }}
                                        />
                                        {useres[i].name && useres[i].lastname && (
                                            <Text style={{ marginLeft: 10, marginTop: 20, color: tem.text, fontWeight: "bold", fontSize: 16 }}>
                                                {useres[i].name + " " + useres[i].lastname}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                               
                            </View>
                    );
                }
            }
        }
        return cards;
    };
    



    const renderRepeatedCards = () => {
        const repeatedCards = [];
        if (listedinve && listedinve.length) {
            for (let i = 0; i < listedinve.length; i++) {
                repeatedCards.push(
                    <View key={i} style={styles.cardaxepte}>
                        <TouchableOpacity onPress={() => navigation.navigate('Usersprofiel', { userId: listedinve[i]._id })}>

                            <Image
                                style={{ width: 50, height: 50, marginTop: 15, marginLeft: 10, borderRadius: 25, resizeMode: "cover" }}
                                source={{ uri: listedinve[i].image }}
                            />
                        </TouchableOpacity>
                        {listedinve[i].name && listedinve[i].lastname && (
                            <Text style={{ marginTop: 10, color: tem.text, fontWeight: "bold", fontSize: 16 }}>
                                {listedinve[i].name + " " + listedinve[i].lastname}
                            </Text>
                        )}
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <AntDesign name="closecircleo" size={24} color={tem.shad} />
                            <TouchableOpacity onPress={() => handleaxeptere(listedinve[i]._id)}>
                                <AntDesign name="checkcircleo" size={24} color={tem.button} style={{ marginLeft: 20 }} />
                            </TouchableOpacity>

                        </View>
                    </View>
                );
            }
        }
        return repeatedCards;
    };



    return (
        <SafeAreaView style={[styles.container, { backgroundColor: tem.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />


            <View >



                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 16 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", left: 0 }}>
                        <Ionicons name="arrow-back-outline" size={30} color={tem.shad} style={{ marginTop: 0, marginLeft: 20 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: tem.text }}>Ajouter amis</Text>
                </View>








                {personne && (

                    <ScrollView horizontal>
                        {renderRepeatedCards()}

                    </ScrollView>
                )}

            </View>





            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>

                {
                    renderCards2()
                }
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: tem.background,
        borderRadius: 30,
        shadowColor: tem.text,
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 30,
        elevation: 5,
        width: "95%",
        marginTop: 10,
        height: 70
    },
    cardaxepte: {
        backgroundColor: tem.background,
        borderRadius: 10,
        alignItems: 'center',

        shadowColor: tem.text,
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 10,
        elevation: 5,
        height: 140,
        marginTop: 10,
        marginBottom: 10,

        marginLeft: 10,
        marginRight: 10,
        width: 150,

    },
    container: {
        flex: 1,
        backgroundColor: tem.background,
        paddingTop: 0,
        width: "100%"
    },
    scrollViewContainer: {
        alignItems: 'center',
        flexGrow: 1,
    },
});

export default AddPersonneScreen;