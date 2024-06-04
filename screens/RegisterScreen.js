// Importez useState
import React, { useState } from 'react';
import { Switch, TouchableOpacity, StyleSheet, Alert, Text, View,StatusBar, SafeAreaView, Pressable, Image, TextInput, KeyboardAvoidingView } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Importez correctement useNavigation
import { Ionicons } from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';
import { Checkbox } from 'expo-checkbox';

import { Octicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '@env';
import axios from 'axios';
import { tem, useTheme } from '../components/global';
import { Foundation } from '@expo/vector-icons';

import { useDispatch } from 'react-redux';
import { signup } from '../../store/actions/auth'; // Assuming signup is in a separate file
import { Amis, Card } from '../components/Card';



const RegisterScreen = () => {
    const [isCheckUser, setIsCheckUser] = useState("1");
    const navigation = useNavigation(); // Utilisez useNavigation ici
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profisionalemail, setProfisionalemail] = useState("");
    const [password, setPassword] = useState("");
    const [link, setLink] = useState("");
    const [patinda, setPatinda] = useState("");
    const [numero, setNumero] = useState("");
    const [isFocused, setIsFocused] = useState(false); // Ajoutez cet état pour gérer le focus
    const [champ, setChamp] = useState(0)
    const { isDark, handlePress, isChecked } = useTheme();

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };


    const dispatch = useDispatch();


    const handleRegister = async () => {
        const user = {
            name: name,
            email: email,
            password: password,
            isCheckUser: isCheckUser,
            profisionalemail: profisionalemail,
            link: link,
            patinda: patinda,
            numero: numero
        };
        console.log(user);

        /*  
        try { dispatch({ type: 'UPDATE_SIGNUP_INFO', payload: { name, email, password, isCheckUser,profisionalemail,link,patinda,numero } }); // Update state before dispatching signup
             await signup();
             setName("");
             setEmail("");
             setPassword("");
           } catch (error) {
             // Handle errors appropriately (optional)
           }
       
       */
        axios.post(`${API_URL}register`, user)
            .then((response) => {
                console.log(response);
                Alert.alert("Registration successful", "You have been registered successfully");

                navigation.navigate("Verification");
            })
            .catch((error) => {
                Alert.alert("Registration failed", "An error occurred during registration");
                console.log("error", error);
            });

    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: tem.background }, { alignItems: "center", flex: 1, }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />


            <View style={{ marginTop: 35, flex: 1, backgroundColor: tem.background, alignItems: "center" }}>




                <View style={{ marginTop: 0 }}>
                    <Image
                        style={{ width: 350, height: 250, resizeMode: "contain" }}
                        source={require('../assets/logo2.png')}
                    />
                </View>


                <KeyboardAvoidingView>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: tem.text, fontSize: 17, fontWeight: "bold", marginTop: 25 }}>Créer votre compte</Text>
                    </View>

                    {champ == 0 && (
                        <View>

                            <View style={{ marginTop: 39 }}>

                                <View style={{ flexDirection: "row", marginLeft: 30, alignItems: "center", gap: 5 }}>
                                    <Ionicons name="person" size={24} color="gray" />
                                    <TextInput
                                        placeholder="Nom"
                                        selectionColor={tem.text}
                                        underlineColorAndroid="transparent"
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        value={name}
                                        onChangeText={(text) => setName(text)}
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

                            </View>

                            <View style={{ marginTop: 40 }}>
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
                            </View>

                            <View style={{ marginTop: 40 }}>
                                <View style={{ flexDirection: "row", marginLeft: 30, alignItems: "center", gap: 5 }}>
                                    <FontAwesome name="lock" size={30} color="gray" />
                                    <TextInput
                                        placeholder="Mot de Passe"
                                        selectionColor={tem.text}
                                        underlineColorAndroid="transparent"
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        value={password}
                                        onChangeText={(text) => setPassword(text)}
                                        placeholderTextColor={tem.shad}
                                        style={{
                                            paddingLeft: 6,
                                            height: 40,
                                            width: 300,
                                            color: tem.text,
                                            borderBottomColor: isFocused ? tem.shad : tem.button,
                                            borderBottomWidth: 1,
                                        }}
                                    />
                                </View>
                            </View>


                        </View>
                    )}
                    {champ == 1 && (
                        <View>






                            <View style={{ marginTop: 30, flexDirection: "row", alignItems: "center", gap: 5 }}>

                                <Ionicons name="person" size={24} color="gray" />
                                <View style={{ flexDirection: "row", alignItems: "center", width: 300, height: 50, borderBottomColor: isFocused ? tem.shad : tem.button, borderBottomWidth: 1, }}>
                                    <Text style={{ fontSize: 15, color: tem.shad, marginTop: -10 }}> Utilisateur</Text>
                                    <Checkbox
                                        value={isCheckUser == "1"}
                                        onValueChange={() => setIsCheckUser("1")}
                                        style={{ marginLeft: "72%" }}
                                    />
                                </View>
                            </View>

                            <View style={{ marginTop: 30, flexDirection: "row", alignItems: "center", gap: 5 }}>

                                <Ionicons name="business" size={24} color="gray" />
                                <View style={{ flexDirection: "row", alignItems: "center", width: 300, height: 50, borderBottomColor: isFocused ? tem.shad : tem.button, borderBottomWidth: 1, }}>
                                    <Text style={{ fontSize: 15, color: tem.shad, marginTop: -10 }}>  Entreprise</Text>
                                    <Checkbox
                                        value={isCheckUser == "2"}
                                        onValueChange={() => setIsCheckUser("2")}
                                        style={{ marginLeft: "73%" }}
                                    />
                                </View>
                            </View>


                            <View style={{ marginTop: 30, flexDirection: "row", alignItems: "center", gap: 5 }}>

                                <MaterialIcons name="local-grocery-store" size={24} color="gray" />
                                <View style={{ flexDirection: "row", alignItems: "center", width: 300, height: 50, borderBottomColor: isFocused ? tem.shad : tem.button, borderBottomWidth: 1, }}>
                                    <Text style={{ fontSize: 15, color: tem.shad, marginTop: -10 }}> Prestataire</Text>
                                    <Checkbox
                                        value={isCheckUser == "3"}
                                        onValueChange={() => setIsCheckUser("3")}
                                        style={{ marginLeft: "72%" }}
                                    />
                                </View>
                            </View>
               
                        </View>
                    )}
                    {champ == 2 && (
                        <View>
                            {isCheckUser == "3" && (
                                <View>
                                    <View style={{ marginTop: 39 , marginLeft: 30 }}>

                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                            <Foundation name="telephone" size={24} color="gray" />
                                            <TextInput
                                                placeholder="N° Professionnel"
                                                selectionColor={tem.text}
                                                underlineColorAndroid="transparent"
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                value={numero}
                                                onChangeText={(text) => setNumero(text)}
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

                                    </View>

                                    <View style={{ marginTop: 40 , marginLeft: 30 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                            <MaterialIcons name="email" size={24} color="gray" />
                                            <TextInput
                                                placeholder="Email Professionnel"
                                                selectionColor={tem.text}
                                                underlineColorAndroid="transparent"
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                value={profisionalemail}
                                                onChangeText={(text) => setProfisionalemail(text)}
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
                                    </View>

                                    <View style={{ marginTop: 40 , marginLeft: 30 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                            <MaterialIcons name="security" size={30} color="gray" />
                                            <TextInput
                                                placeholder="N° Patente"
                                                selectionColor={tem.text}
                                                underlineColorAndroid="transparent"
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                value={patinda}
                                                onChangeText={(text) => setPatinda(text)}
                                                placeholderTextColor={tem.shad}
                                                style={{
                                                    paddingLeft: 6,
                                                    height: 40,
                                                    width: 300,
                                                    color: tem.text,
                                                    borderBottomColor: isFocused ? tem.shad : tem.button,
                                                    borderBottomWidth: 1,
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}
                            {isCheckUser == "2" && (
                                <View>
                                    <View style={{ marginTop: 39 , marginLeft: 30}}>

                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                            <Foundation name="telephone" size={24} color="gray" />
                                            <TextInput
                                                placeholder="N° Professionnel"
                                                selectionColor={tem.text}
                                                underlineColorAndroid="transparent"
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                value={numero}
                                                onChangeText={(text) => setNumero(text)}
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

                                    </View>

                                    <View style={{ marginTop: 40, marginLeft: 30 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                            <MaterialIcons name="email" size={24} color="gray" />
                                            <TextInput
                                                placeholder="Email professionnel"
                                                selectionColor={tem.text}
                                                underlineColorAndroid="transparent"
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                value={profisionalemail}
                                                onChangeText={(text) => setProfisionalemail(text)}
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
                                    </View>

                                    <View style={{ marginTop: 40 , marginLeft: 30}}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                            <AntDesign name="link" size={30} color="gray" />
                                            <TextInput
                                                placeholder="Lien"
                                                selectionColor={tem.text}
                                                underlineColorAndroid="transparent"
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                value={link}
                                                onChangeText={(text) => setLink(text)}
                                                placeholderTextColor={tem.shad}
                                                style={{
                                                    paddingLeft: 6,
                                                    height: 40,
                                                    width: 300,
                                                    color: tem.text,
                                                    borderBottomColor: isFocused ? tem.shad : tem.button,
                                                    borderBottomWidth: 1,
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}

                        </View>
                    )}










                    <View style={{ marginTop: 20 }}>

                        {champ > 0 && (
                            <View style={{ alignItems: "right", position: "absolute", flexDirection: "row", left: -15 }} >
                                <Pressable
                                    onPress={() => setChamp(champ - 1)}
                                    style={{
                                        marginLeft:30,
                                        width: 120,
                                        height: 40,
                                        backgroundColor: tem.button,
                                        padding: 15,
                                        marginTop: 40,

                                        borderRadius: 30,
                                    }}>

                                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: tem.text, marginTop: -10 }}>Retour </Text>

                                </Pressable>
                            </View>
                        )}

                        <View style={{ marginLeft: "60%", alignItems: "right" }} >
                            <Pressable
                                onPress={() => {
                                    if ((champ > 0 && isCheckUser === "1") || (champ > 1 && isCheckUser !== "1")) {
                                        handleRegister();
                                    } else {
                                        setChamp(champ + 1);
                                    }
                                }} style={{

                                    width: 120,
                                    height: 40,
                                    backgroundColor: tem.button,
                                    padding: 15,
                                    marginTop: 40,
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    borderRadius: 30,
                                }}>
                                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: tem.text, marginTop: -10 }}>{champ > 0 & isCheckUser == "1" ? "Créer" : champ > 1 & isCheckUser != "1" ? "Créer" : 'Suivant'} </Text>

                            </Pressable>
                        </View>

                    </View>

                    <Pressable style={{ marginTop: 10 }} onPress={() => navigation.navigate("Login")}>
                        <Text style={{ color: tem.text, fontSize: 16, textAlign: "center" }}>Vous avez déjà un compte? Se connecter</Text>
                    </Pressable>
                </KeyboardAvoidingView>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    button: {
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default RegisterScreen;
