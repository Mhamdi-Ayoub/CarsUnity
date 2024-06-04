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
const Listefollow = ({route}) => {
    const {admin, ok } = route.params;

    const state = useSelector((state) => state.user.value);
    const { id: userId } = state;
    const [entreprise, setEntreprise] = useState([]);
    const [entreprisefollower, setEntreprisefollower] = useState([]);
    const [prestataire, setPrestataire] = useState([]);
    const [prestatirefollower, setPrestatirefollower] = useState([]);

    const { isDark, handlePress, isChecked } = useTheme();
    const pdp = "https://th.bing.com/th/id/OIP.W6rZ0iO9rEfUStFAMWoozQAAAA?rs=1&pid=ImgDetMain";
    const [showadd, setShowadd] = useState(ok);
    const scrollViewRef = useRef();
    const navigation = useNavigation();

    const handleProfileIconPress = () => {
        navigation.goBack();
    };
    useEffect(() => {
        const fetchEntreprise = async () => {
            try {
                const response = await axios.get(`${API_URL}non-entreprise/${userId}`);
                console.log(response.data);

                setEntreprise(response.data.nonEntreprise);
            } catch (error) {
                console.error('Error fetching entreprises:', error);
            }
        };

        const fetchPrestatire = async () => {
            try {
                const response = await axios.get(`${API_URL}non-prestataires/${userId}`);
                console.log(response.data);

                setPrestataire(response.data.nonPrestataires);
            } catch (error) {
                console.error('Error fetching entreprises:', error);
            }
        };

        const listEntreprise = async () => {
            try {
                const response = await axios.get(`${API_URL}entreprises-utilisateur/${userId}`);
                console.log(response.data);

                setEntreprisefollower(response.data.entreprises);
            } catch (error) {
                console.error('Error fetching entreprises:', error);
            }
        };


        const listPrestataire = async () => {
            try {
                const response = await axios.get(`${API_URL}prestatire-utilisateur/${userId}`);
                console.log(response.data);

                setPrestatirefollower(response.data.prestataires);
            } catch (error) {
                console.error('Error fetching entreprises:', error);
            }
        };

        // Appelez fetchEntreprise au lieu de fetchUser
        fetchEntreprise();
        listPrestataire();
        fetchPrestatire();
        listEntreprise();

        scrollViewRef.current.scrollToEnd({ x: 0, y: 0, animated: true });




    }, []);




    const ajouterentreprise = (Id) => {


        axios
            .post(`${API_URL}ajouter-entreprise/${userId}/${Id}`)
            .then((res) => {
                console.log(res.data);
                if (res.data.status == "Ok") {
                    Toast.show({
                        type: "success",
                        text1: "ajouter",
                    });
                }
            });
    };
    
    const suprimerentreprise = (Id) => {


        axios
            .delete(`${API_URL}supprimer-entreprise/${userId}/${Id}`)
            .then((res) => {
                console.log(res.data);
                if (res.data.status == "Ok") {
                    Toast.show({
                        type: "success",
                        text1: "suprimer entreprise",
                    });
                }
            });
    };
    
    const ajouterprestataire = (Id) => {


        axios
            .post(`${API_URL}ajouter-prestataire/${userId}/${Id}`)
            .then((res) => {
                console.log(res.data);
                if (res.data.status == "Ok") {
                    Toast.show({
                        type: "success",
                        text1: "ajouter",
                    });
                }
            });
    };
    const suprimerprestatire = (Id) => {


        axios
            .delete(`${API_URL}supprimer-prestataire/${userId}/${Id}`)
            .then((res) => {
                console.log(res.data);
                if (res.data.status == "Ok") {
                    Toast.show({
                        type: "success",
                        text1: "suprimer prestatire",
                    });
                }
            });
    };



    // Dans votre fonction renderCards
    const renderCards = () => {
        return entreprise.map(item => (
            <View key={item._id} style={[styles.card, { zIndex: 2 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop:10, paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: item.image }} />
                        <Text style={[styles.description, { fontWeight: "bold", fontSize: 16, color: tem.text, marginLeft: 10 }]}>{item.name}</Text>
                    </View>
                    {showadd && (
                        <TouchableOpacity onPress={() => suprimerentreprise(item._id)}>
                            <View style={{ width: 60, height: 30, backgroundColor: "#D8D9DA", alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}>
                                <Text style={{ color: tem.button, fontWeight: 'bold' }}>{'Suivre'}</Text>



                            </View>
                        </TouchableOpacity>
                    )}
                    {!showadd && (
                        <TouchableOpacity onPress={() => ajouterentreprise(item._id)}>
                            <View style={{ width: 60, height: 30, backgroundColor: "#D8D9DA", alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}>
                                <Text style={{ color: tem.button, fontWeight: 'bold' }}>{'suivi'}</Text>



                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        ));
    };
    const listedefollow = () => {
        return entreprisefollower.map(item => (
            <View key={item._id} style={[styles.card, { zIndex: 2 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: item.image }} />
                        <Text style={[styles.description, { fontWeight: "bold", fontSize: 16, color: tem.text, marginLeft: 10 }]}>{item.name}</Text>
                    </View>
                    {showadd && (
                        <TouchableOpacity onPress={() => suprimerentreprise(item._id)}>
                            <View style={{ width: 60, height: 30, backgroundColor: "#D8D9DA", alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}>
                                <Text style={{ color: tem.button, fontWeight: 'bold' }}>{'Suivre'}</Text>



                            </View>
                        </TouchableOpacity>
                    )}
                    {!showadd && (
                        <TouchableOpacity onPress={() => ajouterentreprise(item._id)}>
                            <View style={{ width: 60, height: 30, backgroundColor: "#D8D9DA", alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}>
                                <Text style={{ color: tem.button, fontWeight: 'bold' }}>{'suivi'}</Text>



                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        ));
    };

    const renderRepeatedCards = () => {
        const repeatedCards = [];

        for (let i = 0; i < 10; i++) {
            repeatedCards.push(
                <View key={i} style={styles.cardaxepte}>
                    <Image
                        style={{ width: 50, height: 50, marginTop: 15, marginLeft: 10, borderRadius: 25, resizeMode: "cover" }}
                        source={{ uri: pdp }}
                    />
                    <Text style={{ marginTop: 10, color: tem.text, fontWeight: "bold", fontSize: 16 }}>ahmed hamoude</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <AntDesign name="closecircleo" size={24} color={tem.shad} />
                        <AntDesign name="checkcircleo" size={24} color={tem.button} style={{ marginLeft: 20 }} />
                    </View>
                </View>
            );
        }

        return repeatedCards;
    };

    const renderCards2 = () => {
        return prestataire.map(item => (
            <View key={item._id} style={[styles.card, { zIndex: 2 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop:10,paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: item.image }} />
                        <Text style={[styles.description, { fontWeight: "bold", fontSize: 16, color: tem.text, marginLeft: 10 }]}>{item.name}</Text>
                    </View>
                    {showadd && (
                        <TouchableOpacity onPress={() => suprimerprestatire(item._id)}>
                            <View style={{ width: 60, height: 30, backgroundColor: "#D8D9DA", alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}>
                                <Text style={{ color: tem.button, fontWeight: 'bold' }}>{'suivi'}</Text>



                            </View>
                        </TouchableOpacity>
                    )}
                    {!showadd && (
                        <TouchableOpacity onPress={() => ajouterprestataire(item._id)}>
                            <View style={{ width: 60, height: 30, backgroundColor: "#D8D9DA", alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}>
                                <Text style={{ color: tem.button, fontWeight: 'bold' }}>{'Suivre'}</Text>



                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        ));
    };

    const listedefollow2 = () => {
        return prestatirefollower.map(item => (
            <View key={item._id} style={[styles.card, { zIndex: 2 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: item.image }} />
                        <Text style={[styles.description, { fontWeight: "bold", fontSize: 16, color: tem.text, marginLeft: 10 }]}>{item.name}</Text>
                    </View>
                    {showadd && (
                        <TouchableOpacity onPress={() => suprimerprestatire(item._id)}>
                            <View style={{ width: 60, height: 30, backgroundColor: "#D8D9DA", alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}>
                                <Text style={{ color: tem.button, fontWeight: 'bold' }}>{'Suivre'}</Text>



                            </View>
                        </TouchableOpacity>
                    )}
                    {!showadd && (
                        <TouchableOpacity onPress={() => ajouterprestataire(item._id)}>
                            <View style={{ width: 60, height: 30, backgroundColor: "#D8D9DA", alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}>
                                <Text style={{ color: tem.button, fontWeight: 'bold' }}>{'suivi'}</Text>



                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        ));
    };
    return (
        <SafeAreaView style={[styles.container,{backgroundColor: tem.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 16 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", left: 0 }}>
                        <Ionicons name="arrow-back-outline" size={30} color={tem.shad} style={{ marginTop: 0, marginLeft: 20 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: tem.text }}>{admin == "2"&&ok?"Suivi Entreprise":admin == "2"&&!ok?"Suivre Entreprise":admin == "3"&&ok?"Suivi prestataire":"Suivre prestataire"}</Text>
                </View>




            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>
                {admin == "2" && (<>
                    {!ok && (renderCards())}
                    {ok && (listedefollow())}
                </>)}
                {admin == "3" && (<>
                    {!ok && (renderCards2())}
                    {ok && (listedefollow2())}
                </>)}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: tem.background,
        borderRadius: 20,
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
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 30,
        elevation: 5,
        height: 140,
        marginTop: 10,
        marginBottom: 10,

        marginLeft: 10,
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

export default Listefollow;

