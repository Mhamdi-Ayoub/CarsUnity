import React, { useState, useEffect, useRef } from 'react';
import { Image, View, Pressable, TouchableOpacity, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { tem, useTheme } from '../components/global';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { API_URL } from '@env';


const Listeamis = ({ route}) => {
    const scrollViewRef = useRef();
    const { isDark, handlePress, isChecked } = useTheme();
    const {userId } = route.params;

    const [amis, setamis] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_URL}friends/${userId}`);
                console.log(response)

                if (!response.ok) {
                    throw new Error('Failed to select profile');
                }
                const data = await response.json();
                setamis(data.friends);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };


        fetchUser();


        // Nettoyage de l'intervalle lors du démontage du composant
    }, []);


    const images = [
        "https://static.vecteezy.com/ti/vecteur-libre/p1/4607794-la-fille-sourit-employee-de-bureau-la-femme-aux-cheveux-blancs-bureau-manager-designer-entrepreneur-blonde-vector-illustration-flat-avatar-vectoriel.jpg",
        "https://static.vecteezy.com/ti/vecteur-libre/p1/4607796-la-fille-sourit-employee-de-bureau-la-fille-a-lunettes-bureau-manager-designer-entrepreneur-vector-illustration-flat-avatar-vectoriel.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ompgOpNGVrXi2HZlbTQqdKc8ErMcOTMgW3K6YE0n28l_d_jIEo1Wp26fFW2hmMFi0UM&usqp=CAU",
        "https://static.vecteezy.com/ti/vecteur-libre/t2/4607797-man-face-emotive-icon-smiing-american-african-male-character-flat-vector-illustration-isolated-on-white-happy-human-psychological-portrait-positive-emotions-user-avatar-for-app-creation-de-sites-web-vectoriel.jpg",
        "https://static.vecteezy.com/ti/vecteur-libre/p3/4607806-homme-visage-emotif-icone-souriant-barbu-homme-caractere-en-jaune-plat-vector-illustration-isole-sur-blanc-heureux-humain-psychologique-portrait-positif-emotions-utilisateur-avatar-pour-app-web-design-vectoriel.jpg",
        "https://www.shareicon.net/data/512x512/2015/09/18/103160_man_512x512.png",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6DV--0QFWZYJ0vYl2vInKkgz6X8LCDeldzUi8WM3MnKQ837ov9guuSEiNP2xpgRqMR4I&usqp=CAU",
    ];
    const navigation = useNavigation();

    const handleProfileIconPress = () => {
        //navigation.goBack();
        navigation.navigate('bottom')
    };

    const handleImageClick = (id) => {
        navigation.navigate('Usersprofiel', { userId:id})
    }
    const renderItems = () => {
        x = 3
        const result = [];
        const length = amis.length;
        for (let i = 0; i < length; i += 3) {
            result.push(

                <View key={i} style={{ flexDirection: 'row', marginTop: 5 }}>

                    <TouchableOpacity key={i} onPress={() => handleImageClick(amis[i]._id)}>
                        {amis[i].image && (

                            <View style={styles.card}>
                                <Image
                                    source={{ uri: amis[i].image }}
                                    style={{ width: 80, height: 80, borderRadius: 40, resizeMode: "cover", marginTop: 10 }}
                                />
                                <Text>
                                <Text style={{ fontWeight: 'bold', marginTop: 2, fontSize: 15, color: tem.text, alignItems: 'center', textAlign: 'center' }}>{amis[i].name}  </Text>
                                </Text>
                            </View>

                        )}
                    </TouchableOpacity>

                    <TouchableOpacity key={i + 1} onPress={() => handleImageClick(amis[i+1]._id)}>
                        {amis[i + 1] && amis[i + 1].image && (
                            <View style={styles.card}>

                                <Image
                                    source={{ uri: amis[i + 1].image }}
                                    style={{ width: 80, height: 80, borderRadius: 40, resizeMode: "cover", marginTop: 10 }}
                                />
<Text>
                                <Text style={{ fontWeight: 'bold', marginTop: 2, fontSize: 15, color: tem.text, alignItems: 'center', textAlign: 'center' }}>{amis[i + 1].name} </Text>
</Text>
                            </View>

                        )}


                    </TouchableOpacity>
                    <TouchableOpacity key={i + 2} onPress={() => handleImageClick(amis[i+2]._id)}>
                        { amis[i + 2]&& amis[i + 2].image && (
                            <View style={styles.card}>

                                <Image
                                    source={{ uri: amis[i + 2].image }}
                                    style={{ width: 80, height: 80, borderRadius: 40, resizeMode: "cover", marginTop: 10 }}
                                />
                                <Text>
                                <Text style={{ fontWeight: 'bold', marginTop: 2, fontSize: 15, color: tem.text, alignItems: 'center', textAlign: 'center' }}>{amis[i + 2].name} </Text>
                                </Text>
                            </View>
                        )}



                    </TouchableOpacity>
                </View>


            );
        }
        return result;
    };
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

    return (
        <SafeAreaView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={0}
            style={[styles.container,{backgroundColor: tem.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <TouchableOpacity onPress={handleProfileIconPress} style={{ marginVertical: 0 }}>

                    <Ionicons name="arrow-back-outline" size={30} color={tem.shad} style={{ marginTop: 0, marginLeft: 20 }} />
                </TouchableOpacity>
                {renderItems()}

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
    container: {
        flex: 1,
        backgroundColor: tem.background,
        paddingTop: 0,
        width: "100%"
    },
    scrollViewContainer: {
        alignItems: 'left',
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
        width: 129,
        height: 167,
        borderRadius: 10,
        backgroundColor: tem.background,
        shadowColor: tem.text,
        shadowOpacity: 0.3,
        shadowOffset: { width:3, height: 3 },
        shadowRadius: 30,
        elevation: 5,
        alignItems: 'center',


    },
});

export default Listeamis;
