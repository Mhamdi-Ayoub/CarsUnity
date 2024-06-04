import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Image, SafeAreaView, View, TextInput, Text, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme, tem } from '../components/global';
import { Amis } from '../components/Card';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { API_URL } from '@env';
import axios from 'axios';

const ConversationScreen = ({ route }) => {
    const [favoriteMessages, setFavoriteMessages] = useState([]);
    const [favoriteMessages2, setFavoriteMessages2] = useState([]);

    const {idpropre, id , pdp, name } = route.params;
    //const { pdp, name } = route.params;
    const [messages, setMessages] = useState([]);

    const { isDark, handlePress, isChecked } = useTheme();
    const [text, setText] = useState('');
    const ch = "left"
    const ch2 = "right"
   
    const navigation = useNavigation();

    const handleDoubleClick = (messageId) => {
        if (favoriteMessages.length === 0) {
            setFavoriteMessages([messageId]);
        } else {
            const lastMessageId = favoriteMessages[favoriteMessages.length - 1];
            if (messageId === lastMessageId) {
                setFavoriteMessages(prevState => [...prevState, messageId]);
                if (favoriteMessages2.includes(messageId) === false) {
                    setFavoriteMessages2(prevState => [...prevState, messageId])
                }
            } else {
                setFavoriteMessages(prevState => prevState.slice(0, -1));

                setFavoriteMessages(prevState => [...prevState, messageId]);
            }
        }
        console.log("Double clic sur le message avec l'ID :", favoriteMessages);
    };

    const handleProfileIconPress = () => {
        navigation.goBack()
    };

    const scrollViewRef = useRef();
  
    useEffect(() => {
        const fetchProfileAndMessages = async () => {
            try {
              
                const messagesResponse = await fetch(`${API_URL}messages/${id}/${idpropre}`);
                if (!messagesResponse.ok) {
                    throw new Error('Failed to fetch messages');
                }
                const messagesData = await messagesResponse.json();
                setMessages(messagesData.messages);
            } catch (error) {
                console.error('Error fetching profile and messages:', error);
            }
        };
    
        const intervalId = setInterval(fetchProfileAndMessages, 1000);
    
        return () => clearInterval(intervalId);
    }, []);
    const handleFavoriteIconClick = (messageId) => {
        setFavoriteMessages2(prevFavoriteMessages2 => prevFavoriteMessages2.filter(id => id !== messageId));
        setFavoriteMessages(prevFavoriteMessages => prevFavoriteMessages.filter(id => id !== messageId));

    };

    const handleSendMessage = () => {
       
               const ms= {  content: text,image:"", sender: idpropre ,receiver:id}  
               setText("");
 
                axios
                  .post(`${API_URL}messages`, 
                  ms,
                  )
                  .then((res) => {
                    console.log(res.data);
                    if (res.data.status == "Ok") {
                      Toast.show({
                        type: "success",
                        text1: "inserted",
                      });
                                        }
                  });
                   };



    return (
        <SafeAreaView style={[styles.container,{backgroundColor: tem.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <View style={{ flexDirection: 'row', textAlign: 'left', height: 50 }}>
                <TouchableOpacity onPress={handleProfileIconPress} style={{ marginVertical: 0 }}>
                    <Ionicons name="arrow-back-outline" size={30} color={tem.text} style={{ marginTop: 5, marginLeft: 20 }} />
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', marginTop: 8, position: 'absolute', right: '20%', fontSize: 17, color: tem.text }}>{name} </Text>
                <Image
                    style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover", right: '5%', position: 'absolute' }}
                    source={{ uri: pdp }}
                />
            </View>

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>
                {messages.map((message, index) => (
                    <View key={message._id} style={{ alignItems: message.sender ==id ? 'flex-start' : 'flex-end' }}>

                        <View style={{
                            backgroundColor: isDark && message.receiver == id ? "#4592AF" :
                                !isDark && message.receiver == id ? "#D1E5F4" :
                                    !isDark && message.sender ==id ? "#F3F3F3" : "#637A9F",
                            width: message.content.length > 25 ? '70%' : 'auto',
                            marginLeft: message.sender ==id ? '2%' : '0',
                            marginRight: message.receiver == id ? '2%' : 0,
                            borderRadius: 15,
                           marginTop: index > 0 && messages[index - 1].receiver === message.receiver  ? 1 : 5,
                        }}>
                            <Text onPress={() => handleDoubleClick(message._id)} style={{ color: tem.text, marginLeft: 10, marginRight: 8, marginBottom: 8, marginTop: 2, fontSize: 17 }}>{message.content}</Text>
                        </View>
                        {favoriteMessages2.includes(message._id) && (
                            <TouchableOpacity onPress={() => handleFavoriteIconClick(message._id)}>

                                <Foundation name="heart" size={26} color="red" style={{ marginTop: -12 }} />
                            </TouchableOpacity>


                        )}
                    </View>
                ))}
            </ScrollView>
            <View style={{ flexDirection: 'row' }}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.keyboardAvoidingContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setText}
                        value={text}
                        placeholder="Entrez votre texte ici"
                    />

                </KeyboardAvoidingView>
                <TouchableOpacity onPress={handleSendMessage}>
                    <FontAwesome name="send" size={24} color={tem.shad} style={{ marginLeft: -25, marginTop: 10 }} />
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tem.background,
        paddingTop: 0,
        width: "100%",
    },
    scrollViewContainer: {
        flexGrow: 1,
    },
    keyboardAvoidingContainer: {
        alignItems: 'left',
        paddingBottom: 20,
        width: "94%",
        marginLeft: 10
    },
    input: {
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

export default ConversationScreen;