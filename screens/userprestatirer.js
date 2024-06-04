import React, { useState, useRef } from 'react';
import { Dimensions, Platform, SafeAreaView, StatusBar, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, View, Text, StyleSheet, Pressable } from 'react-native';
import { tem, useTheme } from '../components/global';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Amis } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const UserPrestataire = ({ route, navigation }) => {
    const { pdp, name, description, amis } = route.params;


    const handleProfileIconPress = () => {
        navigation.goBack(); // Go back when profile icon is pressed
    };
    let prixprodwit = 15
    const windowWidth = Dimensions.get('window').width;
    const [text, setText] = useState('');
    const der = "prowit na58slou bil il kraheb il motourat il 3jalla kan iy7eb iywali mazout iywalii melle5er ouin mat7oto yt7at machalahha 3ilh"
    const [selectedCard, setSelectedCard] = useState(null);
    const postes = [
        "https://www.fiches-auto.fr/sdoms/shiatsu/uploaded/bareme-main-oeuvre.jpg",
        "https://img.fruugo.com/product/0/27/846084270_max.jpg",
        "https://images.ctfassets.net/t8hyxlfhaeun/1IB9NA8el13iT8lk9UAP25/f648182e07b79c559df0582fd2fbd934/freins_blanc_1000x1000.jpg",
        "https://th.bing.com/th/id/R.32b8ac08882dc333c6ffc23cde65f18d?rik=99RqoPAg3JBtWw&pid=ImgRaw&r=0",
        "https://cached.tptools.com/RS/SR/product/35/One-Step-Cleaner-and-Wax-3M-%5E_3m-39006_R_242e7897.jpg",
        "https://th.bing.com/th/id/R.983e4da36eb1b90d7568c8168e0aec6f?rik=4ok4CIQfSkPYNA&pid=ImgRaw&r=0",
        "https://th.bing.com/th/id/R.32b8ac08882dc333c6ffc23cde65f18d?rik=99RqoPAg3JBtWw&pid=ImgRaw&r=0",
        "https://cached.tptools.com/RS/SR/product/35/One-Step-Cleaner-and-Wax-3M-%5E_3m-39006_R_242e7897.jpg",
        "https://img.fruugo.com/product/6/78/587057786_max.jpg",

    ]
    const [showadd, setShowadd] = useState(amis);

    bio = description
    const [showOptions, setShowOptions] = useState(false); // État pour contrôler la visibilité de l'interface

    const [showFullbio, setShowFullbio] = useState(false);

    const { isDark } = useTheme(); // Récupérer la variable isDark du thème
    const [isScrollingDown, setIsScrollingDown] = useState(false); // État pour suivre si l'utilisateur fait défiler vers le bas

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

    const [intValue, setIntValue] = useState(prixprodwit);
    const [text2, setText2] = useState('');
    const modifee = (text) => {
        let newValue = parseInt(text, 10);

        if (!isNaN(newValue)) {
            setIntValue(newValue * prixprodwit);
            setText2(newValue.toString());
        }
        if (isNaN(newValue)) {
            newValue = 1
            setIntValue(newValue * prixprodwit);
            setText2(newValue.toString());
        }
    };
    const handleImageClick = (imageUri, der1) => {
        setSelectedCard({
            description: der1,
            title: name,
            date: "20-10-2024",
            img: [imageUri],
            pdp: pdp
        });
    }


    const renderItems = () => {


        const result = [];
        const length = postes.length;
        for (let i = 0; i < length; i += 2) {
            result.push(

                <View key={i} style={{ flexDirection: 'row' }}>
                    <View style={[styles.card, { marginTop: -46 }]}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: tem.text, fontWeight: 'bold', marginTop: 5, fontSize: 16 }}>196£</Text>
                        </View>
                        <Text style={styles.lastMessage}>{der && der.length > 90 ? der.substring(0, 90) + '...' : der}</Text>
                        <View style={{ zIndex: 0 }}>
                            <TouchableOpacity key={i} onPress={() => handleImageClick(postes[i], der)}>

                                <Image style={{ width: "100%", height: 200, resizeMode: "contain" }}
                                    source={{ uri: postes[i] }}
                                />
                            </TouchableOpacity>
                            <Text style={styles.imageNumber}>21%</Text>
                        </View>
                    </View>


                    {postes[i + 1] && (
                        <View key={i + 1} style={[styles.card, { marginTop: 1 }]}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: tem.text, fontWeight: 'bold', marginTop: 5, fontSize: 16 }}>196£</Text>
                            </View>
                            <Text style={styles.lastMessage}>{der && der.length > 90 ? der.substring(0, 90) + '...' : der}</Text>
                            <View style={{ zIndex: 0 }}>
                                <TouchableOpacity key={i + 1} onPress={() => handleImageClick(postes[i + 1], der)}>

                                    <Image style={{ width: "100%", height: 200, resizeMode: "contain", }}
                                        source={{ uri: postes[i + 1] }}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.imageNumber}>20%</Text>
                            </View>
                        </View>)}
                </View>



            );
        }
        return result;
    };


    return (
        <SafeAreaView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={0}
            style={[styles.container,{backgroundColor: tem.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />
            {selectedCard && (<View style={[styles.container, { marginBottom: 40 }]}>

                <ScrollView contentContainerStyle={styles.scrollViewContainer}>



                    <View style={{ flexDirection: 'row' }}>
                        <ScrollView horizontal>
                            {postes.map((imageUri, index) => (
                                <Image
                                    key={index}
                                    style={{ width: windowWidth, height: 400, resizeMode: "cover", marginRight: 4 }}
                                    source={{ uri: imageUri }}
                                />
                            ))}
                        </ScrollView>
                    </View>



                    <TouchableOpacity onPress={() => { setSelectedCard(null); }} >

                        <Ionicons name="arrow-back-outline" size={30} color={tem.shad} style={{ zIndex: 1, position: 'absolute', top: -390, left: 10, }} />
                    </TouchableOpacity>




                    <View style={{ flexDirection: 'row' }}>

                        <Image

                            style={{ width: 60, height: 60, resizeMode: "cover", borderRadius: 30, marginLeft: "3%", marginTop: 10 }}
                            source={{ uri: pdp }}
                        />
                        <Text style={{ color: tem.text, marginLeft: "1%", marginTop: 30, fontSize: 16, fontWeight: 'bold', }}>{name}</Text>

                    </View>
                    <View style={{
                        width: '96%', marginTop: 10, marginLeft: "2%",
                    }}>
                        <Text style={{ fontSize: 14, color: tem.text }}>
                            {showFullbio ? bio : bio.substring(0, 70)}
                        </Text>
                        {bio.length > 70 && (
                            <View style={{ flexDirection: 'row' }}>
                                {!showFullbio && (
                                    <TouchableOpacity onPress={() => setShowFullbio(true)}>
                                        <Text style={{ color: tem.button, marginLeft: 12 }}>Voir plus</Text>
                                    </TouchableOpacity>
                                )}
                                {showFullbio && (
                                    <TouchableOpacity onPress={() => setShowFullbio(false)}>
                                        <Text style={{ color: tem.button, marginLeft: 12 }}>Voir moins</Text>
                                    </TouchableOpacity>
                                )}
                            </View>



                        )}
                    </View>
                    <View style={{
                        alignItems: 'center',
                    }}>

                        <Text style={{ marginTop: 20, color: tem.button, fontSize: 20, fontWeight: 'bold', }}>Total={intValue}$</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
                                <TextInput
                                    style={{
                                        backgroundColor: tem.shad,
                                        borderRadius: 15,
                                        paddingHorizontal: 10,
                                        width: "100%"
                                    }}
                                    value={text2}
                                    onChangeText={modifee}
                                    placeholder="nombre de produit"
                                    keyboardType="numeric"
                                />
                            </KeyboardAvoidingView>
                        </View>
                        <Text style={{ fontSize: 15, color: tem.button, marginLeft: 5 }}>Le prix de la produit= {prixprodwit}</Text>
                    </View>





                    <View style={{
                        alignItems: 'center',
                    }}>
                        <MaterialIcons name="payment" size={30} color={tem.button} />
                    </View>

                </ScrollView>
            </View>




            )}


            {!selectedCard && (
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>

                <TouchableOpacity onPress={handleProfileIconPress} style={{ marginVertical: 0 }}>
                    <Ionicons name="arrow-back-outline" size={30} color={tem.text} style={{ marginTop: 5, marginLeft: 20 }} />
                </TouchableOpacity>

                <View style={{ marginLeft: "36%", marginTop: -23, flexDirection: 'row', alignItems: 'center' }}>

                    <Image
                        style={{ width: 120, height: 120, marginRight: "70%", borderRadius: 60, resizeMode: "cover" }}
                        source={{ uri: pdp }}

                    />

                </View>

                <View style={{ width: '100%', marginTop: 10 }}>
                    {/* Wrap the text in a Text component */}
                    {/*<Text style={{ fontWeight: 'bold', marginTop: 10, fontSize: 15, color: tem.text }}>mouhamed omar ben ali </Text>
*/}
                    <Text style={{ fontWeight: 'bold', marginTop: 5, fontSize: 18, color: tem.text, alignItems: 'center', textAlign: 'center' }}>{name} </Text>

                    <View style={{
                        width: '60%', marginTop: 10, marginLeft: "2%",
                    }}>
                        <Text style={{ fontSize: 14, color: tem.text }}>
                            {showFullbio ? bio : bio.substring(0, 70)}
                        </Text>
                        {bio.length > 70 && (
                            <View style={{ flexDirection: 'row' }}>
                                {!showFullbio && (
                                    <TouchableOpacity onPress={() => setShowFullbio(true)}>
                                        <Text style={{ color: tem.button, marginLeft: 12 }}>Voir plus</Text>
                                    </TouchableOpacity>
                                )}
                                {showFullbio && (
                                    <TouchableOpacity onPress={() => setShowFullbio(false)}>
                                        <Text style={{ color: tem.button, marginLeft: 12 }}>Voir moins</Text>
                                    </TouchableOpacity>
                                )}
                            </View>



                        )}
                    </View>





                </View>

                <Pressable
                    style={{
                        width: "45%",
                        height: "auto",
                        backgroundColor: tem.shad,
                        padding: 10,
                        marginTop: 10,
                        marginLeft: "51%",
                        borderRadius: 15,
                    }}
                    onPress={() => setShowadd(!showadd)}
                    android_ripple={{
                        color: isDark ? tem.shad : tem.button,
                        borderless: false,
                    }}
                >

                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: showadd ? tem.button : tem.text }}>{showadd ? "suivre" : "suivé"} </Text>
                </Pressable>


                <View style={{ flexDirection: 'col', marginTop: 5 }}>
                    {renderItems()}
                </View>
            </ScrollView>
            )}
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    input: {
        flex: 1,
        color: tem.text,
        fontSize: 16,
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
    },
    card: {
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

    },
    carddepost: {
        backgroundColor: tem.background,
        borderRadius: 10,

        shadowColor: tem.text,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 30,
        elevation: 5,
        width: "96%",
        height: 700,
        marginTop: 12,
        marginLeft: "2%"

    },
    container: {
        flex: 1,
        backgroundColor: tem.background,
        paddingTop: 0,
        width: "100%",
    },
    scrollViewContainer: {
        alignItems: 'left',
        flexGrow: 1,
    },
    keyboardAvoidingContainer: {
        flex: 1,
        marginLeft: "51%",
        width: "45%",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'left',
        backgroundColor: tem.shad,
        borderRadius: 15,

    },
    searchIcon: {
        marginRight: 10,
        marginBottom: 0
    },
    lastMessage: {
        color: tem.text,
        marginTop: 0,
    },
    imageNumber: {
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

export default UserPrestataire;

