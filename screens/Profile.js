import React, { useState, useEffect, useRef } from 'react';
import { Switch, Image, View, Pressable, TouchableOpacity, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { tem, useTheme } from '../components/global';
import { Ionicons } from '@expo/vector-icons';
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


const ProfileScreen = ({ }) => {
  const { isDark, handlePress, isChecked } = useTheme();
  //const userId = useSelector((state) => state.authReducer);
  //console.log('userId',userId);
  const state = useSelector((state) => state.user.value);
  const { id: userId } = state;


  {/*
const tokenAsync = await AsyncStroage.getItemAsync("authToken");
      const token = JSON.parse(tokenAsync);

const res = await axios.post(
        API_URL +user
          headers: {
            Authorization: `Bearer ${token}`,
}



*/}






  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);
  /*
    const handleLogout = async () => {
      try {
       
        const response = await fetch(`${API_URL}logout/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            // Ajoutez d'autres en-têtes si nécessaire, par exemple, le token d'authentification
          }
        });
    
        // Vérifier si la requête s'est terminée avec succès
        if (response.ok) {
          console.log("User logged out successfully");
          // Traitez la réponse ou redirigez l'utilisateur vers une autre page après la déconnexion
        } else {
          // Gérer les erreurs si la requête échoue
          console.error("Error logging out user");
          const data = await response.json(); // Si la réponse contient un corps JSON, vous pouvez le récupérer ici
          console.log(data); // Affichez les données d'erreur
        }
      } catch (error) {
        // Gérer les erreurs de connexion
        console.error("Error logging out user", error);
      }
    };
    */

  const handleLogout = async () => {
    try {
      // const userId = getUserId(); 
      console.log(userId)
      const response = await axios.post(`${API_URL}logout/${userId}`, {});

      if (response.status === 200) {
        console.log("User logged out successfully");
        navigation.navigate("Login")
        // Ajoutez ici toute logique supplémentaire après la déconnexion réussie, par exemple, naviguer vers l'écran de connexion
      } else {
        console.error("Error logging out user");
        // Traitez ici les erreurs de déconnexion
      }
    } catch (error) {
      console.error("Error logging out user", error);
      // Gérez ici les erreurs de connexion
    }
  };

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

    fetchUser();

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}post/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to select posted de le profile');
        }
        const data = await response.json();
        setPosts(data.posts); // Correction ici
        console.log("posts", data.posts)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();

    const intervalId = setInterval(() => {
      //     fetchUser();
      //     fetchPosts();
    }, 150000); // Appel de fetchUser et fetchPosts toutes les 15 secondes

    return () => clearInterval(intervalId); // Nettoyage de l'intervalle lors du démontage du composant
  }, []);



  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const scrollViewRef = useRef();
  const bio = profile.bio
  const name = profile.name
  const lastname = profile.lastname
  const pdp = profile.image
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

  const [showFullbio, setShowFullbio] = useState(false); // Nouvel état pour contrôler l'affichage complet de la description

  const [showExpandAll, setShowExpandAll] = useState(true);
  const [showPhotoView, setShowPhotoView] = useState(false);
  const [showDocumentTextView, setShowDocumentTextView] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // État pour contrôler la visibilité de l'interface

  const [selectedCard, setSelectedCard] = useState(null);

  const navigation = useNavigation();

  const handleProfileIconPress = () => {

    navigation.navigate('addperson'); // "Profile" est le nom de votre écran de profil dans votre stack de navigation
  };
  const handleProfileIconPress2 = () => {
    navigation.navigate('messanger'); // "Profile" est le nom de votre écran de profil dans votre stack de navigation
  };
  const handleProfileIconPress3 = () => {
    navigation.navigate('messanger'); // "Profile" est le nom de votre écran de profil dans votre stack de navigation
  };


  const [selectedIcon, setSelectedIcon] = useState('expand-all'); // Nouvel état pour contrôler l'affichage complet de la description

  const renderItems = () => {
    let result = [];
    let c = 0;
    let i = -1;

    while (c < posts.length) {
      i = i + 1;
      let a = c;
      while (a < posts.length && posts[a].urls.length <= 0) {
        a++;
      }

      let b = a + 1;
      while (b < posts.length && posts[b].urls.length <= 0) {
        b++;
      }

      let j = b + 1;
      while (j < posts.length && posts[j].urls.length <= 0) {
        j++;
      }

      if (a < posts.length && b < posts.length && j < posts.length) {
        result.push(
          <View key={`${i}-${a}`} style={{ flexDirection: 'row', width: "120%", marginTop: 5 }}>
            <TouchableOpacity key={i} onPress={() => handleImageClick(posts[a])}>
              {posts[a].urls.length > 0 && (
                <Image
                  source={{ uri: posts[a].urls[0] }}
                  style={{ width: 129, height: 167, resizeMode: "cover", marginLeft: "2%", marginRight: -7 }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity key={i + 1} onPress={() => handleImageClick(posts[b])}>
              {posts[b].urls.length > 0 && (
                <Image
                  source={{ uri: posts[b].urls[0] }}
                  style={{ width: 129, height: 167, resizeMode: "cover", marginLeft: 5 }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity key={i + 2} onPress={() => handleImageClick(posts[j])}>
              {posts[j].urls.length > 0 && (
                <Image
                  source={{ uri: posts[j].urls[0] }}
                  style={{ width: 130, height: 167, resizeMode: "cover", marginLeft: 7 }}
                />
              )}
            </TouchableOpacity>
          </View>
        );
      }

      c = j + 1;
    }

    return result;
  };

  const handleImageClick = (selected) => {
    // Mettre à jour l'état pour afficher le Card correspondant à l'image cliquée
    setSelectedCard({
      description: selected.content,
      title: name + " " + lastname,
      date: selected.createdAt,
      img: selected.urls,
      pdp: pdp,
      idpost: selected._id,
      key: selected._id
    });
  }



  return (
    <SafeAreaView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={0}
      style={{ flex: 1, backgroundColor: tem.background, paddingTop: 0, width: "100%" }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tem.background} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {selectedCard && (<View style={[styles.container, { backgroundColor: tem.background,marginBottom: 40 }]}>
          <TouchableOpacity onPress={() => { setSelectedCard(null); }} style={{ marginVertical: 0 }}>

            <Ionicons name="arrow-back-outline" size={30} color={tem.text} style={{ marginTop: 20 }} />
          </TouchableOpacity>
          <Card
            description={selectedCard.description}
            title={selectedCard.title}
            date={selectedCard.date}
            img={selectedCard.img}
            pdp={selectedCard.pdp}
            key2={userId}

          />

        </View>
        )}

        {!selectedCard && (



          <View style={[styles.container,{backgroundColor: tem.background}]}>


            {showOptions && (
              <View transparent style={styles.optionsContainer}>
                {/* Contenu de l'interface d'options ici */}

                {profile.numportable && (
                  <View style={{ flexDirection: 'col' }}>
                    <Feather name="phone-call" size={24} color={tem.shad} />
                    <Text>
                      <Text style={[styles.optionText, { marginLeft: 10, marginTop: 5 }]}>{profile.numportable}</Text>
                    </Text>
                  </View>
                )}

                {profile.workspace && (
                  <View style={{ flexDirection: 'col' }}>
                    <MaterialIcons name="workspaces-outline" size={24} color={tem.shad} />
                    <Text>
                      <Text style={[styles.optionText, { marginLeft: 10, marginTop: 5 }]}>{profile.workspace}</Text>
                    </Text>
                  </View>
                )}

                {profile.date && (

                  <View style={{ flexDirection: 'col' }}>
                    <FontAwesome name="birthday-cake" size={24} color={tem.shad} />
                    <Text>
                      <Text style={[styles.optionText, { marginLeft: 10, marginTop: 5 }]}>{profile.date}</Text>
                    </Text>
                  </View>

                )}

                {profile.age && (

                  <View style={{ flexDirection: 'col' }}>
                    <Fontisto name="date" size={24} color={tem.shad} />
                    <Text>
                      <Text style={[styles.optionText, { marginLeft: 10, marginTop: 5 }]}>{profile.age}</Text>
                    </Text>

                  </View>
                )}


                <Switch
                  style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }} // Ajustez la taille du Switch selon vos préférences
                  value={isChecked}
                  onValueChange={handlePress}
                />

                <TouchableOpacity onPress={() => handleLogout()}>
                  <Text style={styles.optionText}>Déconnecter</Text>
                </TouchableOpacity>

              </View>
            )}


            <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
              <SimpleLineIcons name="options-vertical" size={20} color={showOptions ? tem.button : tem.shad} style={{ marginLeft: "90%", marginTop: 15 }} />
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
              <Text style={{ fontWeight: 'bold', marginTop: 5, fontSize: 18, color: tem.text, alignItems: 'center', textAlign: 'center' }}>{name} {lastname} </Text>

              <View style={{
                width: '60%', marginTop: 10, marginLeft: "2%",
              }}>
                <Text style={{ fontSize: 14, color: tem.text }}>
                  {bio && bio.length > 70 ? (showFullbio ? bio : bio.substring(0, 70)) : bio}
                </Text>

                {bio && bio.length > 70 && (
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
              <Pressable
                style={{
                  width: "49%",
                  height: "auto",
                  backgroundColor: tem.shad,
                  padding: 10,
                  marginTop: 10,
                  marginRight: "2%",
                  marginLeft: "5%",

                  borderRadius: 15,
                }}
                onPress={() => navigation.navigate('EditProfile', { pdp: pdp, name: name, lastname: lastname, description: bio, agee: profile.age, num: profile.numportable, local: profile.workspace, admin: "1", email: profile.email, password: profile.password })}>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: tem.text }}>modifier le profil</Text>
              </Pressable>

              <TouchableOpacity onPress={handleProfileIconPress2} >
                <FontAwesome6 name="facebook-messenger" size={24} color={tem.shad} style={{ marginLeft: "2%", marginTop: 3 }} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleProfileIconPress} >
                <Ionicons name="person-add" size={30} color={tem.shad} style={{ marginLeft: "2%", marginTop: 3 }} />
              </TouchableOpacity>


              <TouchableOpacity onPress={() => navigation.navigate('Listefollow', { admin: "2", ok: false })}>
                <MaterialIcons name="domain-add" size={30} color={tem.shad} style={{ marginLeft: "2%", marginTop: 3 }} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Listefollow', { admin: "3", ok: false })}>
                <MaterialCommunityIcons name="store-plus" size={33} color={tem.shad} style={{ marginTop: 3 }} />
              </TouchableOpacity>
            </View>










            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10, marginTop: 5 }}
            >

              {profile.amis && profile.amis.map((id, index) => (
                <View key={index} style={{ marginRight: 18, alignItems: 'center' }}>
                  <Amis id={id} amis={true} etat={1} />
                </View>
              ))}
              <View style={{ alignItems: 'center', marginTop: 15, marginLeft: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Listeamis', { userId: userId })}>

                  <AntDesign name="pluscircleo"
                    size={60} color="gray" />
                </TouchableOpacity>
              </View>

            </ScrollView>







            <View style={{ marginTop: posts.length > 0 ? -20 : -240, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: "90%" }}>
              <TouchableOpacity onPress={() => { setSelectedIcon('expand-all'); setShowExpandAll(true); setShowPhotoView(false); setShowDocumentTextView(false); }} style={{ marginVertical: 20 }}>
                <MaterialCommunityIcons name="expand-all" size={30} color={selectedIcon === 'expand-all' ? tem.button : tem.shad} style={{ marginLeft: "30%" }} />
                <View style={{ borderBottomWidth: 1, borderBottomColor: selectedIcon === 'expand-all' ? tem.button : tem.shad, width: "70%", marginLeft: "8%", marginTop: 2, marginBottom: 400 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setSelectedIcon('photo'); setShowExpandAll(false); setShowPhotoView(true); setShowDocumentTextView(false); }} style={{ marginVertical: 20 }}>
                <FontAwesome name="photo" size={30} color={selectedIcon === 'photo' ? tem.button : tem.shad} style={{ marginLeft: "30%" }} />
                <View style={{ borderBottomWidth: 1, borderBottomColor: selectedIcon === 'photo' ? tem.button : tem.shad, width: "70%", marginLeft: "8%", marginTop: 2, marginBottom: 400 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setSelectedIcon('document-text'); setShowExpandAll(false); setShowPhotoView(false); setShowDocumentTextView(true); }} style={{ marginVertical: 20 }}>
                <Ionicons name="document-text" size={30} color={selectedIcon === 'document-text' ? tem.button : tem.shad} style={{ marginLeft: "29%" }} />
                <View style={{ borderBottomWidth: 1, borderBottomColor: selectedIcon === 'document-text' ? tem.button : tem.shad, width: "70%", marginLeft: "8%", marginBottom: 400 }} />
              </TouchableOpacity>
            </View>

            {showExpandAll && posts.length > 0 && (
              <View style={{ marginTop: -400, marginLeft: 5, flex: 1, backgroundColor: tem.background }}>
                {posts.map(post => (
                  post.urls && ( // Correction ici
                    <Card
                      key={post._id}

                      idpost={post._id}
                      description={post.content}
                      title={`${name} ${lastname}`}
                      date={post.createdAt}
                      img={post.urls}
                      pdp={pdp}
                      key2={userId}
                    />
                  )
                ))}
              </View>
            )}


            {showExpandAll && posts.length < 1 && (
              <View style={{ marginTop: -400, marginLeft: 5, flex: 1, backgroundColor: tem.background }}>
                <Text style={{ marginLeft: "30%", marginTop: 150, alignItems: 'center', color: tem.shad, fontWeight: "bold", fontSize: 16, }}>Il n'existe aucune post</Text>

              </View>
            )}
            {showPhotoView && posts.length > 0 && (

              <View style={{ marginTop: -400, marginLeft: 5, flex: 1, backgroundColor: tem.background, width: "100%" }}>

                {renderItems()}
                {selectedCard && (
                  <Card
                    idpost={selectedCard.idpost}
                    key={selectedCard.key}
                    description={selectedCard.description}
                    title={selectedCard.title}
                    date={selectedCard.date}
                    img={selectedCard.img}
                    pdp={selectedCard.pdp}
                  />
                )}

              </View>
            )
            }
            {showPhotoView && posts.length < 1 && (
              <View style={{ marginTop: -400, marginLeft: 5, flex: 1, backgroundColor: tem.background }}>
                <Text style={{ marginLeft: "30%", marginTop: 150, alignItems: 'center', color: tem.shad, fontWeight: "bold", fontSize: 16, }}>Il n'existe aucune post</Text>

              </View>
            )}

            {showDocumentTextView && posts.length > 0 && (
              <View style={{ marginTop: -400, marginLeft: 5, flex: 1, backgroundColor: tem.background }}>
                {posts.map(post => (
                  post.urls.length === 0 && (
                    <Card
                      key2={userId}
                      idpost={post._id}
                      key={post._id}
                      description={post.content}
                      title={`${name} ${lastname}`}
                      date={post.createdAt}
                      img={[]} // Utilisation d'un tableau vide car il s'agit d'un document texte
                      pdp={pdp}
                    />
                  )
                ))}
              </View>
            )}

            {showDocumentTextView && posts.length < 1 && (
              <View style={{ marginTop: -400, marginLeft: 5, flex: 1, backgroundColor: tem.background }}>
                <Text style={{ marginLeft: "30%", marginTop: 150, alignItems: 'center', color: tem.shad, fontWeight: "bold", fontSize: 16, }}>Il n'existe aucune post</Text>

              </View>
            )}


          </View>
        )}

      </ScrollView>
      <Text style={{ color: tem.background, marginTop: 20 }}>.</Text>

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
  },
});

export default ProfileScreen;

