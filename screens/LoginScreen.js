import React, { useState, useEffect } from "react";
import {Switch, SafeAreaView, StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, Pressable, ScrollView, StatusBar } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Alert } from 'react-native';
import { API_URL } from '@env';
import { useDispatch } from 'react-redux';
import * as authActions from "../../store/actions/auth";
//import { Login } from "../../store/actions/auth"
import { login } from "../features/user";
import { tem, useTheme } from '../components/global';
import { Octicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';


import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false); // Add state for loading
    const [error, setError] = useState(null); // Add state for error
    const handleFocus = () => {
        setIsFocused(true);
    };
    const [isFocused, setIsFocused] = useState(false); // Ajoutez cet état pour gérer le focus


    
    const handleBlur = () => {
        setIsFocused(false);
    };

    /*const handleLogin =  () => {
       
            dispatch(Login(email, password))
         
          navigation.navigate("bottom");

    };*/


    const handleLogin = () => {
        const user = {
            email: email,
            password: password
        };


        axios.post(`${API_URL}login`, user)
            .then((response) => {
                console.log(response);
                const token = response.data.token;
                const id = response.data.userId;
                AsyncStorage.setItem("authToken", token);
                console.log(id);
                navigation.navigate("bottom");
                dispatch(login({ id: id }));
            })
            .catch((error) => {
                Alert.alert("Login error", error.message);
                console.log("error ", error);
            });

    };

    /*
      //Login function
      const Login = async ( ) => {// resetForm ma3refthech chta3mel 
        //Declaring the action
        action = authActions.login(email, password);
        setError(null);
        try {
          await dispatch(action);
          navigation.navigate("bottom");
          
        } catch (err) {
          setError(err.message);
        }
      };
    */
    const { isDark, handlePress, isChecked } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: tem.background}, { alignItems: "center", flex: 1, }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />

            <Switch 
                  style={{marginLeft:"70%",marginTop:10, transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }} // Ajustez la taille du Switch selon vos préférences
                  value={isChecked}
                  onValueChange={handlePress}
                />
            <ScrollView >
                <View style={{ marginTop: 5, flex: 1, backgroundColor: tem.background, alignItems: "center" }}>




                    <View style={{ marginTop: 0  }}>
                        <Image
                            style={{ width: 350, height: 250, resizeMode: "contain" }}
                            source={require('../assets/logo2.png')}
                        />
                    </View>
                </View>


                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: tem.text, fontSize: 17, fontWeight: "bold", marginTop: 25 }}>Connectez-vous à votre compte</Text>
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





                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                        <Text style={{color:tem.text}}>Rester connecté</Text>
                        <Text style={{ fontWeight: "500", color: tem.text }}>Mot de passe oublié</Text>
                    </View>


              
                <View style={{ marginTop: 45 }} />


                <View style={{ alignItems: "center"}} >
                            <Pressable
                               onPress={handleLogin}
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
                                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: tem.text, marginTop: -10 }}> Connecter</Text>

                            </Pressable>
                        </View>









                
                <Pressable onPress={() => navigation.navigate("Register")} style={{ marginTop: 10 }}>
                    <Text style={{ textAlign: "center", fontSize: 16, color: tem.text }}>Vous n'avez pas de compte ? s'inscrire</Text>
                </Pressable>
                {/* </KeyboardAvoidingView> */}
            </ScrollView>

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
export default LoginScreen;

