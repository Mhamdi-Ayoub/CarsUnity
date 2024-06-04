import React, { useState, useEffect, useRef } from 'react';

import { Dimensions, Platform, SafeAreaView, StatusBar, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { tem, useTheme } from '../components/global';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Amis } from '../components/Card';
import { Servises } from '../components/Card';

import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { API_URL } from '@env';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';
const Prestataire = () => {


  const navigation = useNavigation();
  const state = useSelector((state) => state.user.value);
  const { id: userId } = state;
  const [profile2, setProfile2] = useState([]);
  const [profile, setProfile] = useState([]);
  const [services, setServices] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}user/${userId}`);
        console.log(response)

        if (!response.ok) {
          throw new Error('Failed to select profile');
        }
        const data = await response.json();
        setProfile(data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}services`);
        if (!response.ok) {
          throw new Error('Failed to select Services de le profile');
        }
        const data = await response.json();
        setServices(data); // Correction ici
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchUser();
    fetchPosts();

    const intervalId = setInterval(() => {
      fetchUser();
      fetchPosts();
    }, 15000); // Appel de fetchUser et fetchPosts toutes les 15 secondes

    return () => clearInterval(intervalId); // Nettoyage de l'intervalle lors du démontage du composant
  }, []);





  const [ajouter, setajouter] = useState(true)
  const windowWidth = Dimensions.get('window').width;
  const [text, setText] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  const ajoutetolist = () => {
    if (text2.trim() !== '') {


      const nouveaulist = { serviceId: selectedCard.id, count: text2 };
      axios
        .post(`${API_URL}add-service/${userId}`,
          nouveaulist,
        )
        .then((res) => {
          console.log(res.data);
          if (res.data.status == "Ok") {
            setText("")
            setajouter(true)
            Toast.show({
              type: "success",
              text1: "ajouter à la liste",
            });

          }
        })

    }
  };
  const [userLists, setuserLists] = useState([]);

  const allliste = async () => {
    setShowOptions(!showOptions)
    try {
      const response = await fetch(`${API_URL}get-list/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to select liste');
      }
      const data = await response.json();
      setuserLists(data.userLists);


    } catch (error) {
      console.error('Error handling image click:', error);
    }

  }





  const handleImageClick = async (services1) => {
    try {
      const response = await fetch(`${API_URL}user/${services1.user}`);
      if (!response.ok) {
        throw new Error('Failed to select profile');
      }
      const data = await response.json();
      setProfile2(data.user);

      const mess = await fetch(`${API_URL}check-service/${userId}/${services1._id}`);

      const checkServiceData = await mess.json();

      if (checkServiceData && checkServiceData.message) {
        setajouter(checkServiceData.message === "Service found in the user's list");
      } else {
        console.error('Error fetching service data:', checkServiceData);
        // Gérer le cas où les données du service ne sont pas disponibles
      }
    } catch (error) {
      console.error('Error handling image click:', error);
    }

    setSelectedCard({
      id: services1._id,
      description: services1.content,
      title: profile2.name + " " + profile2.lastname,
      date: services1.createdAt,
      img: services1.urls,
      prix: services1.prix,
      bio: services1.content,
      pdp: profile2.image
    });
  }
  const [showOptions, setShowOptions] = useState(false); // État pour contrôler la visibilité de l'interface

  bio = "les prodwit hatha mta3 kol chay ouin mat7eb testa3mlou ista3mlou jawek bahi fyh 5atroun iynathfo byh il karhba mouch normal "

  const [showFullbio, setShowFullbio] = useState(false);


  const [intValue, setIntValue] = useState(0);
  const { isDark, handlePress, isChecked } = useTheme();
  const [text2, setText2] = useState('');
  const modifee = (text) => {
    let newValue = parseInt(text, 10);

    if (!isNaN(newValue)) {
      setIntValue(newValue * selectedCard.prix);
      setText2(newValue.toString());
    }
    if (isNaN(newValue)) {
      newValue = 1
      setIntValue(newValue * selectedCard.prix);
      setText2(newValue.toString());
    }
  };

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
  const handledelete = async () => {
    try {

      const response = await axios.delete(`${API_URL}delete-list/${userId}`);
      if (response.data.message === "List deleted successfully for the user") {
        console.log(response.data);
        setMess(response.data.message);
      }
    } catch (error) {
      console.error('Error deleted  liste  :', error);
    }
  };





  const renderItems = () => {

    const result = [];
    const length = services.length;
    for (let i = 0; i < length; i += 2) {
      result.push(

        <View key={i} style={{ flexDirection: 'row' }}>
          <View style={[styles.card, { marginTop: -30 }]}>
            {services[i].promo && services[i].promo != "" && (<><Ionicons name="notifications" size={24} color="#FDE49E" />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: "#000000", fontWeight: 'bold', marginTop: -15, fontSize: 16 }}>{services[i].prix}£</Text>
              </View></>)}

            {services[i].promo == "" && (<>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: "#000000", fontWeight: 'bold', marginTop: 5, fontSize: 16 }}>{services[i].prix}£</Text>
              </View>
            </>)}
            <Text style={styles.lastMessage}>{services[i].content && services[i].content.length > 90 ? services[i].content.substring(0, 90) + '...' : services[i].content}</Text>
            <View style={{ zIndex: 0 }}>
              <TouchableOpacity key={i} onPress={() => handleImageClick(services[i])}>

                <Image style={{ width: "100%", height: 200, resizeMode: "contain" }}
                  source={{ uri: services[i].urls[0] }}
                />
              </TouchableOpacity>
              {services[i].promo && services[i].promo != "" && (<Text style={styles.imageNumber}>-{services[i].promo} %</Text>)}
            </View>
          </View>


          {services[i + 1] && (
            <View key={i + 1} style={[styles.card, { marginTop: 0 }]}>
              {services[i + 1].promo && services[i + 1].promo != "" && (<><Ionicons name="notifications" size={24} color="#FDE49E" />
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: "#000000", fontWeight: 'bold', marginTop: -15, fontSize: 16 }}>{services[i + 1].prix}£</Text>
                </View></>)}

              {services[i + 1].promo == "" && (<>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: "#000000", fontWeight: 'bold', marginTop: 5, fontSize: 16 }}>{services[i + 1].prix}£</Text>
                </View>
              </>)}
              <Text style={styles.lastMessage}>{services[i + 1].content && services[i + 1].content.length > 90 ? services[i + 1].content.substring(0, 90) + '...' : services[i + 1].content}</Text>
              <View style={{ zIndex: 0 }}>
                <TouchableOpacity key={i + 1} onPress={() => handleImageClick(services[i + 1])}>

                  <Image style={{ width: "100%", height: 200, resizeMode: "contain", }}
                    source={{ uri: services[i + 1].urls[0] }}
                  />
                </TouchableOpacity>
                {services[i + 1].promo && services[i + 1].promo != "" && (<Text style={styles.imageNumber}>-{services[i + 1].promo} %</Text>)}
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
      style={[styles.container, { backgroundColor: tem.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />
      {selectedCard && (<View style={[styles.container, { marginBottom: 40 }]}>


        <ScrollView contentContainerStyle={styles.scrollViewContainer}>



          <View style={{ flexDirection: 'row' }}>
            <ScrollView horizontal>
              {selectedCard.img.map((imageUri, index) => (
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
              source={{ uri: selectedCard.pdp }}
            />
            <Text style={{ color: tem.text, marginLeft: "1%", marginTop: 30, fontSize: 16, fontWeight: 'bold', }}>{selectedCard.title}</Text>

          </View>
          <View style={{
            width: '96%', marginTop: 10, marginLeft: "2%",
          }}>
            <Text style={{ fontSize: 14, color: tem.text }}>
              {showFullbio ? selectedCard.bio : selectedCard.bio.substring(0, 70)}
            </Text>
            {selectedCard.bio.length > 70 && (
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
            <Text style={{ fontSize: 15, color: tem.button, marginLeft: 5 }}>Le prix de la produit= {selectedCard.prix}</Text>
          </View>





          <View style={{
            alignItems: 'center',
          }}>
            <TouchableOpacity onPress={ajoutetolist}>
              <Text style={{ color: tem.button, marginLeft: 12, marginTop: 10 }}>{ajouter ? "deja ajouter" : "ajouter a la liste"}</Text>
            </TouchableOpacity>


          </View>

        </ScrollView>
      </View>




      )}




      {!selectedCard && (
        <>
          {showOptions && (
            <View transparent style={[styles.optionsContainer, { zIndex: 5 }]}>
              <View style={{ flexDirection: 'row' }}>
                <Text>
                  <Text style={{ marginLeft: 40, alignItems: 'center', fontSize: 18, fontWeight: "bold", color: tem.text }}>Liste des produits</Text>

                </Text>
                <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>

                  <AntDesign name="downcircleo" size={25} color={tem.shad} style={{ marginLeft: "70%" }} />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.scrollViewContainer} >


                {userLists.length > 0 && userLists[0].packet.map((opa, index) => (
                  <View>
                    <Servises id={opa.Service} count={opa.count} user={userId} />
                  </View>
                ))}
                <TouchableOpacity onPress={handledelete}>
                  <Text>
                    <Text style={{ marginLeft: 40, color: tem.button, marginTop: 10, fontSize: 18, fontWeight: "bold", alignItems: 'center' }}>Acheter </Text>
                  </Text>
                </TouchableOpacity>





                <View>


                </View>

              </ScrollView>

            </View>
          )}
          <ScrollView contentContainerStyle={[styles.scrollViewContainer, { zIndex: 50 }]}>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            // contentContainerStyle={{ paddingHorizontal: 10, marginTop: 5 }}
            >

              {profile && profile.prestataires && profile.prestataires.map((image, index) => (

                <View key={index} style={{ marginRight: 18, alignItems: 'center' }}>

                  <Amis id={image} amis={true} etat={3} />

                </View>
              ))}

              <View style={{ alignItems: 'center', marginTop: 15, marginLeft: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Listefollow', { admin: "3", ok: true })}>

                  <AntDesign name="pluscircleo"
                    size={60} color="gray" />
                </TouchableOpacity>
              </View>

            </ScrollView>


            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.keyboardAvoidingContainer}>
              <View style={styles.inputContainer}>
                <EvilIcons name="search" size={30} color={tem.text} style={{ marginTop: 0, marginRight: 2 }} />
                <TextInput
                  style={styles.input}
                  onChangeText={setText}
                  value={text}
                  placeholder="Rechercher"
                />
              </View>
            </KeyboardAvoidingView>




            <View style={{ flexDirection: 'col', marginTop: 5 }}>

              {renderItems()}


            </View>
          </ScrollView>

          <TouchableOpacity onPress={allliste}>
            <FontAwesome5 name="clipboard-list" size={35} color={tem.button} style={{ position: 'fixed', bottom: 50, left: "80%", zIndex: 100 }} />
          </TouchableOpacity>
        </>
      )}

    </SafeAreaView>

  )
};
const styles = StyleSheet.create({
  input: {
    flex: 1,
    color: tem.text,
    fontSize: 16,
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
  optionsContainer: {
    position: 'absolute',
    zIndex: 5,
    backgroundColor: tem.background,

    padding: 10,
    borderRadius: 10,
    shadowColor: tem.shad,
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 3,
    elevation: 5,
    width: "100%",
    height: 800,
    color: tem.text
  },
});


export default Prestataire;
