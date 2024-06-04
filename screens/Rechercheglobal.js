import React, { useState, useEffect, useRef } from 'react';
import { TextInput, Platform, KeyboardAvoidingView, Switch, Image, View, Pressable, TouchableOpacity, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { tem, useTheme } from '../components/global';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Amis, Card } from '../components/Card';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { API_URL } from '@env';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Login } from "../../store/actions/auth"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

const Rechercheglobal = ({ }) => {
    const { isDark, handlePress, isChecked } = useTheme();
    const scrollViewRef = useRef();
    const handleScroll = (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const previousOffset = scrollViewRef.current ? scrollViewRef.current : 0;

        if (currentOffset > previousOffset && !isScrollingDown) {
            setIsScrollingDown(true); // L'utilisateur a fait défiler vers le bas
        } else if (currentOffset < previousOffset && isScrollingDown) {
            setIsScrollingDown(false); // L'utilisateur a fait défiler vers le haut
        }

        scrollViewRef.current = currentOffset;
    };
    const navigation = useNavigation();


    const handleProfileIconPress = () => {
        navigation.navigate('bottom');
    };
    const [servise, setServise] = useState([]);


    const [text, setText] = useState('');
    const [selecter, setselecter] = useState(1);
    const [useres, setUseres] = useState([]);
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_URL}search-post/${text}`);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            console.log(data);
            setPosts(data.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Gérer l'erreur ici, par exemple afficher un message d'erreur à l'utilisateur
        }
    };

    useEffect(() => {

    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}search-user/${text}`);
            console.log(response)

            if (!response.ok) {
                throw new Error('Failed to select useres');
            }
            const data = await response.json();
            setUseres(data.users);
            console.log(data.users)

            const response2 = await fetch(`${API_URL}search-post/${text}`);
            if (!response2.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data2 = await response2.json();
            console.log(data2);
            setPosts(data2.posts);


            const response3 = await fetch(`${API_URL}search-service/${text}`);
            if (!response3.ok) {
                throw new Error('Failed to fetch servises');
            }
            const data3 = await response3.json();
            console.log(data3);
            setServise(data3.servises);

        } catch (error) {
            console.error('Error fetching useres:', error);
        }
    };
    const renderCards1 = () => {
        const cards = [];
        if (useres && useres.length) {
            for (let i = 0; i < useres.length; i++) {
                if (useres[i].admin === "1") {
                    cards.push(
                        <View key={useres[i]._id} style={[styles.card, { zIndex: 2 }]}>
                            <View style={{ borderRadius: 15, width: 60, height: 30, backgroundColor: "#D8D9DA", position: "absolute", left: "80%", marginTop: 20, zIndex: 3 }}>
                                <Text style={{ color: tem.text, marginTop: 3, marginLeft: 15 }}>Voire</Text>
                            </View>

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
                                    {useres[i].name && !useres[i].lastname && (
                                        <Text style={{ marginLeft: 10, marginTop: 20, color: tem.text, fontWeight: "bold", fontSize: 16 }}>
                                            {useres[i].name}
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













    const renderItems = () => {

        const result = [];
        const length = servise.length;
        for (let i = 0; i < length; i += 2) {
            result.push(

                <View key={i} style={{ flexDirection: 'row',marginTop:10 }}>
                    <View key={useres[i]._id} style={{
                        backgroundColor: tem.background,
                        borderRadius: 10,

                        shadowColor: tem.text,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 0 },
                        shadowRadius: 30,
                        elevation: 5,
                        width: "45%",
                        height: 300,
                        marginBottom: 12,
                        marginLeft: "3%"
                    }}>
                        {servise[i].promo && servise[i].promo != "" && (<><Ionicons name="notifications" size={24} color="#FDE49E" />
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: tem.text, fontWeight: 'bold', marginTop: -15, fontSize: 16 }}>{servise[i].prix}£</Text>
                            </View></>)}

                        {servise[i].promo == "" && (<>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: tem.text, fontWeight: 'bold', marginTop: 5, fontSize: 16 }}>{servise[i].prix}£</Text>
                            </View>
                        </>)}
                        <Text style={styles.lastMessage}>{servise[i].content && servise[i].content.length > 90 ? servise[i].content.substring(0, 90) + '...' : servise[i].content}</Text>
                        <View style={{ zIndex: 0 }}>

                            <Image style={{ width: "100%", height: 200, resizeMode: "contain" }}
                                source={{ uri: servise[i].urls[0] }}
                            />

                            {servise[i].promo && servise[i].promo != "" && (<Text style={styles.imageNumber}>-{servise[i].promo} %</Text>)}
                        </View>
                    </View>


                    {servise[i + 1] && (
                        <View key={i + 1} style={{
                            backgroundColor: tem.background,
                            borderRadius: 10,

                            shadowColor: tem.text,
                            shadowOpacity: 0.3,
                            shadowOffset: { width: 0, height: 0 },
                            shadowRadius: 30,
                            elevation: 5,
                            width: "45%",
                            height: 300,
                            marginBottom: 12,
                            marginLeft: "3%"
                        }}>
                            {servise[i + 1].promo && servise[i + 1].promo != "" && (<><Ionicons name="notifications" size={24} color="#FDE49E" />
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: tem.text, fontWeight: 'bold', marginTop: -15, fontSize: 16 }}>{servise[i + 1].prix}£</Text>
                                </View></>)}

                            {servise[i + 1].promo == "" && (<>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: tem.text, fontWeight: 'bold', marginTop: 5, fontSize: 16 }}>{servise[i + 1].prix}£</Text>
                                </View>
                            </>)}
                            <Text style={styles.lastMessage}>{servise[i + 1].content && servise[i + 1].content.length > 90 ? servise[i + 1].content.substring(0, 90) + '...' : servise[i + 1].content}</Text>
                            <View style={{ zIndex: 0 }}>

                                <Image style={{ width: "100%", height: 200, resizeMode: "contain", }}
                                    source={{ uri: servise[i + 1].urls[0] }}
                                />

                                {servise[i + 1].promo && servise[i + 1].promo != "" && (<Text style={styles.imageNumber}>-{servise[i + 1].promo} %</Text>)}
                            </View>
                        </View>)}
                </View>



            );
        }
        return result;
    };







    const renderCards2 = () => {
        const cards = [];
        if (useres && useres.length) {
            for (let i = 0; i < useres.length; i++) {
                if (useres[i].admin === "2") {
                    cards.push(
                        <View key={useres[i]._id} style={[styles.card, { zIndex: 2 }]}>
                            <View style={{ borderRadius: 15, width: 60, height: 30, backgroundColor: "#D8D9DA", position: "absolute", left: "80%", marginTop: 20, zIndex: 3 }}>
                                <Text style={{ color: tem.text, marginTop: 3, marginLeft: 15 }}>Voire</Text>
                            </View>

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
                                    {useres[i].name && !useres[i].lastname && (
                                        <Text style={{ marginLeft: 10, marginTop: 20, color: tem.text, fontWeight: "bold", fontSize: 16 }}>
                                            {useres[i].name}
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

    const renderCards3 = () => {
        const cards = [];
        if (useres && useres.length) {
            for (let i = 0; i < useres.length; i++) {
                if (useres[i].admin === "3") {
                    cards.push(
                        <View key={useres[i]._id} style={[styles.card, { zIndex: 2 }]}>
                            <View style={{ borderRadius: 15, width: 60, height: 30, backgroundColor: "#D8D9DA", position: "absolute", left: "80%", marginTop: 20, zIndex: 3 }}>
                                <Text style={{ color: tem.text, marginTop: 3, marginLeft: 15 }}>Voire</Text>
                            </View>

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
                                    {useres[i].name && !useres[i].lastname && (
                                        <Text style={{ marginLeft: 10, marginTop: 20, color: tem.text, fontWeight: "bold", fontSize: 16 }}>
                                            {useres[i].name}
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




    return (
        <SafeAreaView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={0}
            style={{ flex: 1, backgroundColor: tem.background, paddingTop: 0, width: "100%" }}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />

            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={handleProfileIconPress} style={{ marginRight: 10 }}>
                    <Ionicons name="arrow-back-outline" size={30} color={tem.shad} style={{ marginTop: 0, marginRight: 2 }} />
                </TouchableOpacity>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{
                    flex: 1,
                    marginRight: "6%",
                    marginLeft: -5
                }}>
                    <View style={styles.inputContainer}>
                        <EvilIcons name="search" size={30} color={tem.text} style={{
                            marginRight: 10,
                            marginBottom: 2
                        }} />
                        <TextInput
                            style={styles.input}
                            onChangeText={setText}
                            value={text}
                            placeholder="Rechercher"
                            onSubmitEditing={fetchUsers} // Appeler la fonction pour mettre à jour le commentaire lors de la soumission

                        />
                    </View>
                </KeyboardAvoidingView>
            </View>

            <View style={{ width: '100%', overflowX: 'scroll', display: 'flex', flexDirection: 'row', height: 30 }}>

                <TouchableOpacity onPress={() => { setselecter(1) }} >

                    <Text style={{ color: selecter == 1 ? tem.button : tem.shad, marginLeft: 10, fontSize: 18 }}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setselecter(2) }} >

                    <Text style={{ color: selecter == 2 ? tem.button : tem.shad, marginLeft: 30, fontSize: 18 }}>Entreprise</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setselecter(3) }} >

                    <Text style={{ color: selecter == 3 ? tem.button : tem.shad, marginLeft: 30, fontSize: 18 }}>Prestatire</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setselecter(4) }} >

                    <Text style={{ color: selecter == 4 ? tem.button : tem.shad, marginLeft: 30, fontSize: 18 }}>Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setselecter(5) }} >

                    <Text style={{ color: selecter == 5 ? tem.button : tem.shad, marginLeft: 30, fontSize: 18 }}>Actualiter</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setselecter(6) }} >

                    <Text style={{ color: selecter == 6 ? tem.button : tem.shad, marginLeft: 30, fontSize: 18, marginRight: 10 }}>Servises</Text>
                </TouchableOpacity>
            </View>




            <ScrollView
                style={{ marginTop: 2 }}>
                {selecter == 1 && (
                    renderCards1()
                )}


                {selecter == 2 && (
                    renderCards2()
                )}

                {selecter == 3 && (
                    renderCards3()
                )}

                {selecter == 4 && (<>{posts.map(post => (
                    <>{post.user.admin == 1 && (
                        <Card key={post.user._id} key2={post.user._id} idpost={post._id} description={post.content} title={post.user.name} date={post.createdAt} img={post.urls} pdp={post.user.image} admin={post.user.admin} />

                    )}
                    </>
                ))
                }</>
                )}

                {selecter == 5 && (<>{posts.map(post => (
                    <>{post.user.admin == 2 && (
                        <Card key={post.user._id} key2={post.user._id} idpost={post._id} description={post.content} title={post.user.name} date={post.createdAt} img={post.urls} pdp={post.user.image} admin={post.user.admin} />

                    )}
                    </>
                ))
                }</>
                )}


{selecter == 6 && (
                    renderItems()
                )}


                <Text style={{ color: tem.background, marginTop: 10 }}>.</Text>


            </ScrollView>












        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    /*container: {
      flex: 1,
      justifyContent: 'top',
      backgroundColor: tem.background,
      alignItems: 'center',
      width: "100%"
    },*/
    input: {
        flex: 1,
        color: tem.background,
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tem.shad,
        marginHorizontal: 20,
        borderRadius: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 2
    }, lastMessage: {
        color: tem.text,
        marginTop: 0,
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
    optionsContainer: {
        position: 'absolute',
        top: 60, // Positionnez-le où vous voulez qu'il apparaisse
        right: 20,
        zIndex: 2,
        backgroundColor: "#ffffff",

        padding: 10,
        borderRadius: 10,
        shadowColor: tem.shad,
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 3,
        elevation: 5,
        width: "60%",
        height: 700,
        color: tem.text
    }, card: {
        backgroundColor: tem.background,
        borderRadius: 30,
        shadowColor: tem.text,
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 30,
        elevation: 5,
        width: "95%",
        marginTop: 8,
        height: 70,

    }, imageNumber: {
        position: 'absolute',
        top: 70,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5,
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default Rechercheglobal;

