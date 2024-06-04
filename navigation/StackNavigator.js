import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Entreprise from "../screens/entreprise"
import Maildemodifer from "../screens/mailedemodifer"
import HomeScreen from '../screens/home';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTabs from '../screens/bottomTabs';
import ProfileScreen from '../screens/Profile';
import AddpersonneScreen from '../screens/addpersonne';
import ConversationScreen from '../screens/conversation';
import Messanger from '../screens/messanger';
import Prestataire from '../screens/prestataire';
import Usersprofiel from '../screens/userprofile';
import ProfilePrestataire from '../screens/profileprestataire';
import ProfileEntreprise from '../screens/profileeintreprise';
import Userentreprise from '../screens/userentreprise';
import Modiferpost from '../screens/modiferpost';
import Addpost from '../screens/addpost';
import Addpostprestataire from '../screens/addpostprestataire';
import Listefollow from '../screens/listfollow';
import UserPrestataire from '../screens/userprestatirer';
import { Commenter } from '../components/prodwitcard';
import CodeVerification from '../screens/CodeVerification';
import AddPostScreen from '../screens/AddPostScreen';
import EditProfile from '../screens/EditProfile';
import Listeamis from '../screens/listami';
import Modifeerpassword from '../screens/modiferpasswored'
import Modiferpostprestataire from '../screens/modiferpostprestatire';
import Admin from "../screens/admine"
import Rechercheglobal from "../screens/Rechercheglobal"
import Creereclamation from "../screens/creereclamation"
const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />


            <Stack.Screen name="Admin" component={Admin} options={{ headerShown: false }} />


            <Stack.Screen name="Creereclamation" component={Creereclamation} options={{ headerShown: false }} />

            <Stack.Screen name="messanger" component={Messanger} options={{ headerShown: false }} />

            <Stack.Screen name="Rechercheglobal" component={Rechercheglobal} options={{ headerShown: false }} />





  

            <Stack.Screen name="Modifeerpassword" component={Modifeerpassword} options={{ headerShown: false }} />


            <Stack.Screen name="bottom" component={BottomTabs} options={{ headerShown: false }} />


            <Stack.Screen name="Maildemodifer" component={Maildemodifer} options={{ headerShown: false }} />

            <Stack.Screen name="Verification" component={CodeVerification} options={{ headerShown: false }} />

            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />


            <Stack.Screen name="Listefollow" component={Listefollow} options={{ headerShown: false }} />


            <Stack.Screen name="Modiferpostprestataire" component={Modiferpostprestataire} options={{ headerShown: false }} />

            <Stack.Screen name="Entreprise" component={Entreprise} options={{ headerShown: false }} />

            <Stack.Screen name="addperson" component={AddpersonneScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Listeamis" component={Listeamis} options={{ headerShown: false }} />


                <Stack.Screen name="profile" component={ProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Prestataire" component={Prestataire} options={{ headerShown: false }} />
                <Stack.Screen name="ProfilePrestataire" component={ProfilePrestataire} options={{ headerShown: false }} />
                <Stack.Screen name="Commenter" component={Commenter} options={{ headerShown: false }} />

                <Stack.Screen name="UserPrestataire" component={UserPrestataire} options={{ headerShown: false }} />

                <Stack.Screen name="conversation" component={ConversationScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Usersprofiel" component={Usersprofiel} options={{ headerShown: false }} />
                <Stack.Screen name="ProfileEntreprise" component={ProfileEntreprise} options={{ headerShown: false }} />
                <Stack.Screen name="Userentreprise" component={Userentreprise} options={{ headerShown: false }} />
                <Stack.Screen name="Modiferpost" component={Modiferpost} options={{ headerShown: false }} />
                <Stack.Screen name="Addpost" component={Addpost} options={{ headerShown: false }} />
                <Stack.Screen name="Addpostprestataire" component={Addpostprestataire} options={{ headerShown: false }} />
                <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
                <Stack.Screen name="AddPostScreen" component={AddPostScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default StackNavigator;


