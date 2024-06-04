import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import HomeScreen from './home'; // Assurez-vous que le nom est correctement capitalisé
import { useTheme, tem } from '../components/global';
import React, { useState, useEffect } from 'react'; // Supprimer useRef car il n'est pas utilisé
import axios from 'axios'; // Importer axios
import AsyncStorage from '@react-native-async-storage/async-storage';

import Entreprise from './entreprise';
import ProfileScreen from "./Profile"
import ProfileEntreprise from "./profileeintreprise"
import ProfilePrestataire from "./profileprestataire"
import Prestataire from "./prestataire"
import Userentreprise from "./userentreprise"
import Modiferpost from "./modiferpost"
import Addpost from "./addpost"
import UserPrestataire from "./userprestatirer"
import { View } from 'react-native';
import Listefollow from './listfollow'
import AddPersonneScreen from "./addpersonne"
import AddPostScreen from "./AddPostScreen"
import { API_URL } from '@env';
import { useSelector } from "react-redux";
import Addpostprestataire from './addpostprestataire';
//import  {addpostprestataire} from  './addpostprestataire'
import jwt_decode from 'jwt-decode';

const BottomTabs = () => {
  const Tab = createBottomTabNavigator();
  const { isDark, handlePress, isChecked } = useTheme();
  const [profile, setProfile] = useState(null); // Modifier pour initialiser à null plutôt qu'à un tableau vide
  const state = useSelector((state) => state.user.value);
  const [isLoading, setIsLoading] = useState(false);
  const { id: userId } = state;

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
 

    const intervalId = setInterval(() => {
      //     fetchUser();
      //     fetchPosts();
    }, 150000); // Appel de fetchUser et fetchPosts toutes les 15 secondes

    return () => clearInterval(intervalId); // Nettoyage de l'intervalle lors du démontage du composant
  }, []);



  

  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        swipeEnabled: true,
        tabBarOptions: {
          activeTintColor: tem.background, // Couleur de l'onglet actif
          inactiveTintColor: 'gray', // Couleur de l'onglet inactif
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          /*bottom: 0,
          left: 0,
          right: 0,*/
          elevation: 0,
          backgroundColor: tem.background,
          borderRadius: 0,
          height: 40,
        },
        tabBarIcon: ({ size, focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Prestataire') {
            iconName = 'local-grocery-store';
          } else if (route.name === 'Post') {
            iconName = 'create';
          } else if (route.name === 'Entreprise') {
            iconName = 'business';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Ionicons name={iconName} size={size} color={focused ? tem.text : tem.shad} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ route }) => ({
          tabBarLabel: () => null,
          headerShown: false,
          tabBarVisible: route.state && route.state.index === 0,
        })}
      />

      <Tab.Screen
        name="Prestataire"
        component={Prestataire}
        options={({ route }) => ({
          tabBarIcon: ({ size, focused }) => (
            <MaterialIcons name="local-grocery-store" size={size} style={{ color: focused ? tem.text : tem.shad }}
            />
          ),
          tabBarLabel: () => null,
          headerShown: false,
          tabBarVisible: route.state && route.state.index === 0,
        })}
      />
{profile && profile.admin === "3" ? (
      <Tab.Screen
        name="Post"
        component={Addpostprestataire}
        options={({ route }) => ({
          tabBarLabel: () => null,
          headerShown: false,
          tabBarVisible: route.state && route.state.index === 0,
        })}
      />): ( <Tab.Screen
      name="Post"
      component={AddPostScreen}
      options={({ route }) => ({
        tabBarLabel: () => null,
        headerShown: false,
        tabBarVisible: route.state && route.state.index === 0,
      })}
    />)
      }

      <Tab.Screen
        name="Entreprise"
        component={Entreprise}
        options={({ route }) => ({
          tabBarLabel: () => null,
          headerShown: false,
          tabBarVisible: route.state && route.state.index === 0,
        })}
      />

      {profile && profile.admin === "2" ? (
        <Tab.Screen
          name="Profile"
          component={ProfileEntreprise}
          options={({ route }) => ({
            tabBarLabel: () => null,
            headerShown: false,
            tabBarVisible: route.state && route.state.index === 0,
          })}
        />
      ):
      profile && profile.admin === "3" ? (
        <Tab.Screen
          name="Profile"
          component={ProfilePrestataire}
          options={({ route }) => ({
            tabBarLabel: () => null,
            headerShown: false,
            tabBarVisible: route.state && route.state.index === 0,
          })}
        />
      ) : (
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ route }) => ({
            tabBarLabel: () => null,
            headerShown: false,
            tabBarVisible: route.state && route.state.index === 0,
          })}
        />
      )}
      {/* Ajoutez d'autres écrans ici */}
    </Tab.Navigator>);
};

export default BottomTabs;
