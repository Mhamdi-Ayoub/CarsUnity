import React, { useState } from 'react';
import {Image, Pressable, StatusBar, SafeAreaView, View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { API_URL } from '@env';
import { tem, useTheme } from '../components/global'
import { Octicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';


const Maildemodifer = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const navigation = useNavigation();
    const { isDark, handlePress, isChecked } = useTheme();
    const [isFocused, setIsFocused] = useState(false); // Ajoutez cet état pour gérer le focus
    const [email, setEmail] = useState("");

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };



    return (
        
        <SafeAreaView style={{justifyContent: 'center', falignItems: "center", backgroundColor: tem.background, alignItems: "center", flex: 1, }}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />



            <View style={{ marginTop: 0 }}>
                    <Image
                        style={{ width: 350, height: 250, resizeMode: "contain" }}
                        source={require('../assets/logo2.png')}
                    />
                </View>

            <Text style={styles.title}>Entrez votre email</Text>


            <View style={{ flexDirection: "row", marginLeft: 30, alignItems: "center", gap: 5 }}>
                                    <MaterialIcons name="email" size={24} color="gray" />
                                    <TextInput
                                        placeholder="Email"
                                        selectionColor={tem.text}
                                        underlineColorAndroid="transparent"
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        value={email}
                                        onChangeText={(text) => setEmail(text)}
                                        placeholderTextColor={tem.shad}
                                        style={{
                                            color: tem.text,
                                            paddingLeft: 6,
                                            height: 40,
                                            width: 300,
                                            borderBottomColor: isFocused ? tem.shad : tem.button,
                                            borderBottomWidth: 1,
                                        }}
                                    />
                                </View>
            <View style={{ alignItems: "center" }} >
                <Pressable
             
                    style={{

                        width: 160,
                        height: 50,
                        backgroundColor: tem.button,
                        padding: 15,
                        marginTop: 40,
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: 30,
                    }}>
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: tem.text, marginTop: -5 }}>Envoyer</Text>

                </Pressable>
            </View>
            <Text style={{ color:tem.shad,  marginLeft:20,marginRight:20,marginTop:200   ,   fontSize: 12}}>Ne vous inquiétez pas, il est facile de modifier votre mot de passe. Premièrement, envoyez-nous un e-mail pour obtenir un code. Ensuite, saisissez ce code ainsi que votre nouveau mot de passe, et voilà !</Text>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color:tem.text
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
});

export default Maildemodifer;
