import React, { useState, useRef, useEffect } from 'react';
import { Pressable, TouchableOpacity, Image, SafeAreaView, View, TextInput, Text, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme, tem } from '../components/global';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import axios from "axios";
import { API_URL } from '@env';

const ModifierPost = ({ route }) => {
    const { idpost, description1, title1, date1, img1, pdp1 } = route.params;
    const [msg, setMess] = useState("");
    const [text, setText] = useState(description1);

    const handleUpdate = async () => {
        try {
            const updatePost = {
                content: text,
                urls: img1
            };
            const response = await axios.put(`${API_URL}update-post/${idpost}`, updatePost);
            if (response.data.message === "Post mis à jour avec succès") {
                console.log(response.data);
                setMess(response.data.message);
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const { isDark } = useTheme();
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width;

    const onChangeText = (inputText) => {
        setText(inputText);
    };

    const handleProfileIconPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container,{backgroundColor: tem.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <TouchableOpacity onPress={handleProfileIconPress} style={{ marginTop: 5, marginLeft: 5 }}>
                <Ionicons name="arrow-back-outline" size={30} color={tem.shad} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'left', height: 50, paddingHorizontal: 20, marginTop: 5 }}>
                <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: pdp1 }}
                />
                <View style={{ flexDirection: 'col' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17, color: tem.text, marginTop: 8, marginLeft: 10 }}>{title1}</Text>
                    <Text style={{ fontSize: 12, color: tem.shad, marginTop: 1, marginLeft: 10 }}>{idpost}</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    multiline={true}
                />
                <View style={{ flexDirection: 'row' }}>
                    <ScrollView horizontal>
                        {img1.map((imageUri, index) => (
                            <Image
                                key={index}
                                style={{ width: windowWidth, height: 400, resizeMode: "cover", marginRight: 4 }}
                                source={{ uri: imageUri }}
                            />
                        ))}
                    </ScrollView>
                </View>
                <Pressable
                    style={{
                        width: "94%",
                        height: "auto",
                        backgroundColor: tem.shad,
                        padding: 10,
                        marginTop: 10,
                        marginRight: "3%",
                        marginLeft: "3%",
                        borderRadius: 15,
                    }}
                    onPress={handleUpdate}>
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: tem.button }}>Modifier le post</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tem.background,
    },
    scrollViewContainer: {
        alignItems: 'left',
        flexGrow: 1,
        marginTop: 10
    },
    input: {
        height: 240,
        width: '96%',
        marginLeft: "2%",
        borderRadius: 10,
        borderColor: tem.shad,
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: tem.text,
        textAlignVertical: 'top',
    },
});

export default ModifierPost;
