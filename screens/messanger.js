import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'; // Importer useSelector depuis React Redux

import { SafeAreaView, StatusBar, Text, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { tem, useTheme } from '../components/global';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import ConversationScreen from '../screens/conversation';
import { SimpleLineIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Amismessanger } from '../components/Card'
import { API_URL } from '@env';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';

const Messanger = () => {

    const [showamis, setShowamis] = useState(true);
    const [showentreprise, setShowentreprise] = useState(true);
    const [showprester, setShowprester] = useState(true);

    const [text, setText] = useState('');
    const { isDark, handlePress, isChecked } = useTheme();
    const navigation = useNavigation();
    const [optionClicked, setOptionClicked] = useState('');
    const handleProfileIconPress = () => {
        navigation.navigate('bottom');
    };
    const [showOptions, setShowOptions] = useState(false); // État pour contrôler la visibilité de l'interface

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
                console.log(data.user)
                setProfile(data.user);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };



        fetchUser();
    }, []);






    const renderItems = () => {
        return (
            <>
                <TouchableOpacity onPress={() => setShowamis(!showamis)}>
                    <View style={{ flexDirection: 'row' }}>

                        <Text style={{ color: tem.shad }}> voire tout les amis</Text>
                        <AntDesign name={showamis ? "upcircleo" : "downcircleo"} size={15} color={showamis ? tem.button : tem.shad} style={{ marginLeft: "59%" }} />
                    </View>
                </TouchableOpacity>
                {showamis && profile.amis && profile.amis.map((id, index) => (
                    <Amismessanger idpropre={userId} id={id} key={index} etat={1}  text={text}/>
                ))}





                <TouchableOpacity onPress={() => setShowentreprise(!showentreprise)}>
                    <View style={{ flexDirection: 'row' }}>

                        <Text style={{ color: tem.shad }}> voire tout les entreprise</Text>
                        <AntDesign name={showentreprise ? "upcircleo" : "downcircleo"} size={15} color={showentreprise ? tem.button : tem.shad} style={{ marginLeft: "50%" }} />
                    </View>
                </TouchableOpacity>
                {showentreprise && profile.entreprises && profile.entreprises.map((id, index) => (
                    <Amismessanger idpropre={userId} id={id} key={index} text={text} />
                ))}





                <TouchableOpacity onPress={() => setShowprester(!showprester)}>
                    <View style={{ flexDirection: 'row' }}>

                        <Text style={{ color: tem.shad }}> voire tout les prestatire</Text>

                        <AntDesign name={showprester ? "upcircleo" : "downcircleo"} size={15} color={showprester ? tem.button : tem.shad} style={{ marginLeft: "51%" }} />
                    </View>
                </TouchableOpacity>
                {showprester && profile.prestataires && profile.prestataires.map((id, index) => (
                    <Amismessanger idpropre={userId} id={id} key={index} text={text} />
                ))}
            </>
        )


    };


    return (
        <SafeAreaView style={[styles.container,{backgroundColor: tem.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={handleProfileIconPress} style={styles.iconContainer}>
                    <Ionicons name="arrow-back-outline" size={30} color={tem.shad} style={styles.icon} />
                </TouchableOpacity>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.keyboardAvoidingContainer}>
                    <View style={styles.inputContainer}>
                        <EvilIcons name="search" size={30} color={tem.text} style={styles.searchIcon} />
                        <TextInput
                            style={styles.input}
                            onChangeText={setText}
                            value={text}
                            placeholder="Rechercher"
                        />
                    </View>
                </KeyboardAvoidingView>
                <TouchableOpacity onPress={() => navigation.navigate('Creereclamation')}>

                <Text style={{color:tem.button,marginTop:0,marginRight:5}}>Reclamation</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {renderItems()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tem.background,
        paddingTop: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'left',
        paddingHorizontal: 10,
        marginTop: 2
    },
    iconContainer: {
        marginRight: 10,
    },
    icon: {
        marginTop: 0,
        marginRight: 2
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'left',
        backgroundColor: tem.shad,
        marginHorizontal: 20,
        borderRadius: 20,
    },
    searchIcon: {
        marginRight: 10,
        marginBottom: 5
    },
    keyboardAvoidingContainer: {
        flex: 1,
        marginRight: "2%",
        marginLeft: -5
    },
    input: {
        flex: 1,
        color: tem.background,
        fontSize: 16,
    },
    scrollViewContainer: {
        marginTop: 10,
    },

});

export default Messanger;