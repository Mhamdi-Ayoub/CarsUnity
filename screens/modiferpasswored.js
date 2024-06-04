import React, { useState } from 'react';
import { Image, Pressable, StatusBar, SafeAreaView, View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { API_URL } from '@env';
import { tem, useTheme } from '../components/global';
import { Octicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
const Modifeerpassword = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const navigation = useNavigation();
    const { isDark, handlePress, isChecked } = useTheme();
    const [isFocused, setIsFocused] = useState(false); // Ajoutez cet état pour gérer le focus
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };


    const handleVerification = () => {
        const user = {
            verificationCode: verificationCode
        };

        // Utilisation des backticks (`) pour inclure IP_Adress dans la chaîne de l'URL
        axios.post(`${API_URL}verifCode`, user)
            .then((response) => {
                console.log(response);
                Alert.alert("Correct Code", "You have been registered successfully");
                navigation.navigate("Login");
            })
            .catch((error) => {
                Alert.alert("Code not correct", "Verify your code and try again");
                console.log("error", error);
            });
    };

    return (

        <SafeAreaView style={{ justifyContent: 'center', falignItems: "center", backgroundColor: tem.background, alignItems: "center", flex: 1, }}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />



            <View style={{ marginTop: -50 }}>
                <Image
                    style={{ width: 350, height: 250, resizeMode: "contain" }}
                    source={require('../assets/logo2.png')}
                />
            </View>


            <Text style={styles.title}>Entrée Nouvelle Mot de Passe</Text>

            <View style={{ flexDirection: "row", marginLeft: 30, alignItems: "center", gap: 5 }}>
                <Octicons name="number" size={30} color="gray" />
                <TextInput
                    placeholder="Code de Vérification"
                    selectionColor={tem.text}
                    underlineColorAndroid="transparent"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    keyboardType="numeric"

                    value={verificationCode}
                    onChangeText={(text) => setVerificationCode(text)}
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
            <View style={{ flexDirection: "row", marginLeft: 30, alignItems: "center", gap: 5, marginTop: 40 }}>
                <FontAwesome name="lock" size={30} color="gray" />
                <TextInput
                    placeholder="Noveau Mot Passe"
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
            <View style={{ flexDirection: "row", marginLeft: 30, alignItems: "center", gap: 5, marginTop: 40 }}>
                <FontAwesome name="lock" size={30} color="gray" />
                <TextInput
                    placeholder="Confirmer Mot Passe"
                    selectionColor={tem.text}
                    underlineColorAndroid="transparent"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={password2}
                    onChangeText={(text) => setPassword2(text)}
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


            <View style={{ alignItems: "center" }} >
                <Pressable
                    style={{

                        width: 120,
                        height: 40,
                        backgroundColor: tem.button,
                        padding: 15,
                        marginTop: 40,
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: 30,
                    }}>
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: tem.text, marginTop: -10 }}> Modifier</Text>

                </Pressable>

            </View>

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

export default Modifeerpassword;
