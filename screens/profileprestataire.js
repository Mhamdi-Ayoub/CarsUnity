import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, Platform, SafeAreaView, StatusBar, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, View, Text, StyleSheet, Pressable } from 'react-native';
import { tem, useTheme } from '../components/global';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Amis } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { API_URL } from '@env';
import axios from 'axios';

const ProfilePrestataire = () => {

  const windowWidth = Dimensions.get('window').width;
  const [text, setText] = useState('');
  const navigation = useNavigation();
  const state = useSelector((state) => state.user.value);
  const { id: userId } = state;
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
        const response = await fetch(`${API_URL}services/${userId}`);
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


  const handledelete = async () => {
    try {

      const response = await axios.delete(`${API_URL}deleteservice/${selectedCard.services2._id}`);
      if (response.data.message === "service deleted successfully") {
        console.log(response.data);
        // setMess(response.data.message);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };




  const bio = profile.bio || 'il bio lazem ytaficha'; // Initialize bio to an empty string if profile.bio is undefined
  const name = profile.name || ''; // Initialize name to an empty string if profile.name is undefined
  const lastname = profile.lastname || ''; // Initialize lastname to an empty string if profile.lastname is undefined
  const pdp = profile.image || ''; // Initialize pdp to an empty string if profile.image is undefined


  const [showOptions, setShowOptions] = useState(false); // État pour contrôler la visibilité de l'interface
  const [showOptions2, setShowOptions2] = useState(false); // État pour contrôler la visibilité de l'interface

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

  const [intValue, setIntValue] = useState(0);
  const [text2, setText2] = useState('');
  const modifee = (text) => {
    let newValue = parseInt(text, 10);

    if (!isNaN(newValue)) {
      setIntValue(newValue * selectedCard.services2.prix);
      setText2(newValue.toString());
    }
    if (isNaN(newValue)) {
      newValue = 1
      setIntValue(newValue * selectedCard.services2.prix);
      setText2(newValue.toString());
    }
  };

  
  const handleImageClick = (services1, der1) => {
  
    setSelectedCard({
      description: services1.content,
      title: profile.name+" "+profile.lastname,
      date: services1.createdAt,
      img: services1.urls,
      pdp: profile.image,
      services2: services1
    });
  }


  const renderItems = () => {

    const result = [];
    const length = services.length;
    for (let i = 0; i < length; i += 2) {
      result.push(

        <View key={i} style={{ flexDirection: 'row' }}>
          <View style={[styles.card, { marginTop: -46 }]}>
          {services[i].promo && services[i].promo!="" &&(<><Ionicons name="notifications" size={24} color="#FDE49E"  />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: tem.text, fontWeight: 'bold', marginTop: -15, fontSize: 16 }}>{services[i].prix}£</Text>
            </View></>)}

            {services[i].promo=="" &&(<>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: tem.text, fontWeight: 'bold', marginTop: 5, fontSize: 16 }}>{services[i ].prix}£</Text>
              </View>
            </>)}


            <Text style={styles.lastMessage}>{services[i].content && services[i].content.length > 90 ? services[i].content.substring(0, 90) + '...' : services[i].content}</Text>
            <View style={{ zIndex: 0 }}>
              <TouchableOpacity key={i} onPress={() => handleImageClick(services[i], services[i].content)}>

                <Image style={{ width: "100%", height: 200, resizeMode: "contain" }}
                  source={{ uri: services[i].urls[0] }}
                />
              </TouchableOpacity>
              {services[i].promo && services[i].promo!="" &&(  <Text style={styles.imageNumber}>-{services[i].promo} %</Text>)}
            </View>
          </View>


          {services[i + 1] && (
            <View key={i + 1} style={[styles.card, { marginTop: 1 }]}>
              {services[i+1].promo && services[i+1].promo!="" &&(<><Ionicons name="notifications" size={24} color="#FDE49E"  />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: tem.text, fontWeight: 'bold', marginTop: -15, fontSize: 16 }}>{services[i+1].prix}£</Text>
            </View></>)}

            { services[i+1].promo=="" &&(<>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: tem.text, fontWeight: 'bold', marginTop: 5, fontSize: 16 }}>{services[i + 1].prix}£</Text>
              </View>
            </>)}
              <Text style={styles.lastMessage}>{services[i + 1].content && services[i + 1].content.length > 90 ? services[i + 1].content.substring(0, 90) + '...' : services[i + 1].content}</Text>
              <View style={{ zIndex: 0 }}>
                <TouchableOpacity key={i + 1} onPress={() => handleImageClick(services[i + 1], services[i + 1].content)}>

                  <Image style={{ width: "100%", height: 200, resizeMode: "contain", }}
                    source={{ uri: services[i + 1].urls[0] }}
                  />
                </TouchableOpacity>
                {services[i+1].promo && services[i+1].promo!="" &&(  <Text style={styles.imageNumber}>-{services[i+1].promo} %</Text>)}
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
            <View style={{ flexDirection: 'row' }}>

              <Image

                style={{ width: 60, height: 60, resizeMode: "cover", borderRadius: 30, marginLeft: "3%", marginTop: 10 }}
                source={{ uri: selectedCard.pdp }}
              />
              <Text style={{ color: tem.text, marginLeft: "1%", marginTop: 30, fontSize: 16, fontWeight: 'bold', }}>{profile.name} {profile.lastname}</Text>
            </View>{showOptions2 && (
              <View transparent style={styles.optionsContainer}>
                <TouchableOpacity onPress={handledelete}>

                  <Text style={styles.optionText}>supprimer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Modiferpostprestataire', { idpost: selectedCard.services2._id, description1: selectedCard.description, img1: selectedCard.img, promo1: selectedCard.services2.promo, prix1: selectedCard.services2.prix })}>
                  <Text style={styles.optionText}>modifer</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity onPress={() => setShowOptions2(!showOptions2)}>
              <SimpleLineIcons name="options-vertical" size={20} color={showOptions2 ? tem.button : tem.shad} style={{ marginLeft: "90%", marginTop: 15 }} />
            </TouchableOpacity>

          </View>
          <View style={{
            width: '96%', marginTop: 10, marginLeft: "2%",
          }}>
            <Text style={{ fontSize: 14, color: tem.text }}>
              {showFullbio ? selectedCard.description : selectedCard.description.substring(0, 70)}
            </Text>
            {selectedCard.description.length > 70 && (
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
            <Text style={{ fontSize: 15, color: tem.button, marginLeft: 5 }}>Le prix de la produit= {selectedCard.services2.prix && selectedCard.services2.prix}</Text>
          </View>





          <View style={{
            alignItems: 'center',
          }}>
            <MaterialIcons name="payment" size={30} color={tem.button} />
          </View>

        </ScrollView>
      </View>




      )}


      {!selectedCard && (<ScrollView contentContainerStyle={styles.scrollViewContainer}>

        {showOptions && (
          <View transparent style={styles.optionsContainer}>
            {/* Contenu de l'interface d'options ici */}
            <TouchableOpacity onPress={() => setOptionClicked('Option 1')}>
              <Text style={styles.optionText}>supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOptionClicked('Option 2')}>
              <Text style={styles.optionText}>voire profile</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
          <SimpleLineIcons name="options-vertical" size={20} color={showOptions ? tem.button : tem.shad} style={{ marginLeft: "90%", marginTop: 15 }} />
        </TouchableOpacity>

        <View style={{ marginLeft: "36%", marginTop: -23, flexDirection: 'row', alignItems: 'center' }}>

          <Image
            style={{ width: 120, height: 120, marginRight: "70%", borderRadius: 60, resizeMode: "cover" }}
            source={{ uri: profile.image }}

          />

        </View>

        <View style={{ width: '100%', marginTop: 10 }}>
          {/* Wrap the text in a Text component */}
          {/*<Text style={{ fontWeight: 'bold', marginTop: 10, fontSize: 15, color: tem.text }}>mouhamed omar ben ali </Text>
*/}
          <Text style={{ fontWeight: 'bold', marginTop: 5, fontSize: 18, color: tem.text, alignItems: 'center', textAlign: 'center' }}>{profile.name} {profile.lastname} </Text>

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


        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'left' }}>







          <TouchableOpacity onPress={() => navigation.navigate('messanger')} >
            <FontAwesome6 name="facebook-messenger" size={24} color={tem.shad} style={{ marginLeft: "30%", marginTop: 3 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Listefollow', { admin: "2", ok: false })}>


            <MaterialIcons name="domain-add" size={30} color={tem.shad} style={{ marginLeft: "30%", marginTop: 3 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Listefollow', { admin: "3", ok: false })}>
            <MaterialIcons name="add-shopping-cart" size={33} color={tem.shad} style={{ marginLeft: "30%", marginTop: 3 }} />
          </TouchableOpacity>
        </View>
        { /*   <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.keyboardAvoidingContainer}>
            <View style={styles.inputContainer}>
              <EvilIcons name="search" size={30} color={tem.text} style={{ marginTop: 0, marginRight: 2 }} />
              <TextInput
                style={styles.input}
                onChangeText={setText}
                value={text}
                placeholder="Rechercher"
              />
            </View>
                    </KeyboardAvoidingView>*/}
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
          android_ripple={{
            color: isDark ? tem.shad : tem.button, // Couleur du ripple selon le thème
            borderless: false, // Changez cette valeur si vous voulez un effet ripple sans bordure
          }}
          onPress={() => navigation.navigate('EditProfile', { pdp: pdp, name: name, lastname: lastname, description: bio, agee: profile.age, num: profile.numportable, local: profile.workspace, admin: "3" })}>


          <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: tem.text }}>modifer</Text>
        </Pressable>


        <View style={{ flexDirection: 'col', marginTop: 5 }}>
          {renderItems()}
        </View>
      </ScrollView>
      )}
                      <Text style={{ color: tem.background, marginTop: 20 }}>.</Text>

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

export default ProfilePrestataire;
