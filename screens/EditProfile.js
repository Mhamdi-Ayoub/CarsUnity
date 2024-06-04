import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  SafeAreaView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";

import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import { API_URL } from '@env';
import { Toast } from 'react-native';

import { useTheme, tem } from '../components/global';


const EditProfile = ({ navigation ,route }) => {
  const {pdp, name, lastname,description,agee,num,local,admin,email,password } = route.params;
  const { isDark, handlePress, isChecked } = useTheme();

  const state = useSelector((state) => state.user.value);
  const { id: userId } = state;
  const [isFocused, setIsFocused] = useState(false); // Ajoutez cet état pour gérer le focus

  const handleFocus = () => {
    setIsFocused(true);
};

const handleBlur = () => {
    setIsFocused(false);
};


  const [selectedImage, setSelectedImage] = useState();
  

  const [Name, setName] = useState(name);
  const [LastName, setLastName] = useState(lastname);
  const [Bio, setBio] = useState(description);
  const [age, setAge] = useState(agee);
  const [Adresse, setAdresse] = useState(local);
  const [Workspace, setWorkspace] = useState("");
  const [Portable, setPortable] = useState(num);

  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const today = new Date();
  const startDate = getFormatedDate(new Date(1950, 0, 1), "YYYY/MM/DD");
  
  const [selectedStartDate, setSelectedStartDate] = useState("01/01/1990");
  const [startedDate, setStartedDate] = useState("12/12/2023");



  const handleChangeStartDate = (propDate) => {
    setStartedDate(propDate);
  };

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };

  const handleUpdate = () => {
    const updateUser = {
      Name: Name,
      LastName: LastName,
      Bio: Bio,
      age: age,
      email:email,
      password:password,
      date: selectedStartDate,
     image: imageBase64,
    Adrsse: Adresse,
      
      Workspace: Workspace,
      NumPortable: Portable,
    };

    axios
      .put(`${API_URL}update-user/${userId}`, 
        updateUser,
      )
      .then((res) => {
        console.log(res.data);
        navigation.goBack()

        if (res.data.status == "Ok") {

          Toast.show({
            type: "success",
            text1: "Updated",
          });

        }
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du commentaire :', error);
      });
  };

  const [imageBase64, setImageBase64] = useState(pdp) // initialisation à undefined, mais vous pouvez également initialiser à null si vous préférez

const handleImageSelection = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Image,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 1,
  });

  if (!result.canceled) {
    const selectedImageUri = result.assets[0].uri;
    setSelectedImage(selectedImageUri);

    const blobToBase64 = async (blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
    };

    // Convertir l'image sélectionnée en base64
    const response = await fetch(selectedImageUri);
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);

    // Mettre à jour l'état de l'image en base64 avec setImageBase64
    setImageBase64(base64);

    // Faites ce que vous voulez avec l'image en base64
    
  }
};


  

  function renderDatePicker() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={openStartDatePicker}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: tem.background,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              padding: 35,
              width: "90%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <DatePicker
              mode="calendar"
              minimumDate={startDate}
              selected={startedDate}
              onDateChanged={handleChangeStartDate}
              onSelectedChange={(date) => setSelectedStartDate(date)}
              options={{
                backgroundColor: tem.background,
                textHeaderColor: "#469ab6",
                textDefaultColor: tem.shad,
                selectedTextColor: tem.background,
                mainColor: "#469ab6",
                textSecondaryColor: tem.button,
                borderColor: "rgba(122,146,165,0.1)",
              }}
            />

            <TouchableOpacity onPress={handleOnPressStartDate}>
              <Text style={{ fontSize: 14, color: tem.button}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  } 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tem.background, paddingHorizontal: 22 }}>
    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 16 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", left: 0 }}>
        <MaterialIcons name="keyboard-arrow-left" size={24} color={tem.shad} />
      </TouchableOpacity>
      <Text style={{ fontSize: 18, fontWeight: "bold",color:tem.text }}>Modifier Votre Profil</Text>
    </View>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>


    <TouchableOpacity onPress={handleUpdate} style={{ backgroundColor: tem.button, height: 44, borderRadius: 6, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: tem.background }}>Enregistrer les modifications</Text>
        </TouchableOpacity>





        <TouchableOpacity onPress={handleImageSelection} style={{ alignItems: "center", marginBottom: 24 }}>
          <Image
source={selectedImage ? { uri: selectedImage } : (pdp && pdp !== '' ? { uri: pdp } : require('../assets/profileparDefaut.jpg'))}
style={{ height: 150, width: 150, borderRadius: 75, backgroundColor:"black" }}
          />
          <MaterialIcons name="photo-camera" size={24} color={tem.shad} style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#FFFFFF", borderRadius: 12, marginRight:90 }} />
        </TouchableOpacity>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16 ,color:tem.text}}>Nom</Text>
          <TextInput style={{ height: 40, color: tem.text, borderColor: tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }} value={Name}
                onChangeText={(value) => setName(value)}
                editable={true} />
        </View>

        <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16 ,color:tem.text}}>Prénom</Text>
          <TextInput style={{ height: 40,color: tem.text, borderColor: tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }} value={LastName}
                onChangeText={(value) => setLastName(value)}
                editable={true} />
        </View>

        <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16 ,color:tem.text}}>Bio</Text>
          <TextInput style={{ height: 40,color: tem.text, borderColor: tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }} value={Bio}
                  onChangeText={(value) => setBio(value)}
                  editable={true} />
        </View>

        <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16 ,color:tem.text}}>Age</Text>
          <TextInput style={{ height: 40,color: tem.text, borderColor: tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }} value={age}
                onChangeText={(value) => setAge(value)}
                editable={true}
                keyboardType="numeric" />
        </View>

        <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16 ,color:tem.text}}>N° De Téléphone</Text>
          <TextInput style={{ height: 40,color: tem.text, borderColor: tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }}  value={Portable}
                  onChangeText={(value) => setPortable(value)}
                  editable={true}
                  keyboardType="numeric" />
        </View>

        <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16 ,color:tem.text}}>Adresse</Text>
          <TextInput style={{ height: 40,color: tem.text, borderColor: tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }} value={Adresse}
              onChangeText={(value) => setAdresse(value)}
              editable={true} />
        </View>

        <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16 ,color:tem.text}}>Lieu de travail</Text>
          <TextInput style={{ height: 40,color: tem.text, borderColor: tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }} value={Workspace}
              onChangeText={(value) => setWorkspace(value)}
              editable={true} />
        </View>
        <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
          <Text style={{ fontSize: 16 ,color:tem.text, lineHeight: 20 }}>Date De Naissance</Text>
            <TouchableOpacity
              onPress={handleOnPressStartDate}
              style={{
                height: 44,
                width: "100%",
                borderColor: tem.shad,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
                color: tem.text
              }}
            >
              <Text>{selectedStartDate}</Text>
            </TouchableOpacity>
          </View>





{ admin=="2"  &&(
  <>
          <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16 ,color:tem.text}}>Num</Text>
          <TextInput style={{ height: 40,color: tem.text, borderColor: tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }} value={Workspace}
              onChangeText={(value) => setWorkspace(value)}
              editable={true} />
        </View>

        <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16 ,color:tem.text}}>Link</Text>
          <TextInput style={{ height: 40,color: tem.text, borderColor: tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }} value={Workspace}
              onChangeText={(value) => setWorkspace(value)}
              editable={true} />
        </View>

        <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16 ,color:tem.text}}>Maile profetionnel</Text>
          <TextInput style={{ height: 40,color: tem.text, borderColor: tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }} value={Workspace}
              onChangeText={(value) => setWorkspace(value)}
              editable={true} />
        </View>
        </>
)}







{ admin=="3"  &&(
  <>
          <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16 ,color:tem.text}}>Num</Text>
          <TextInput style={{ height: 40,color: tem.text, borderColor: tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }} value={Workspace}
              onChangeText={(value) => setWorkspace(value)}
              editable={true} />
        </View>

        <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16 ,color:tem.text}}>patinda</Text>
          <TextInput style={{ height: 40,color: tem.text, borderColor: tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }} value={Workspace}
              onChangeText={(value) => setWorkspace(value)}
              editable={true} />
        </View>

        <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16 ,color:tem.text}}>Maile profetionnel</Text>
          <TextInput style={{ height: 40,color: tem.text, borderColor:  tem.shad, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 }} value={Workspace}
              onChangeText={(value) => setWorkspace(value)}
              editable={true} />
        </View>
        </>
)}




<TouchableOpacity onPress={handleUpdate} style={{ backgroundColor: tem.button, height: 44, borderRadius: 6, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: tem.background }}>Enregistrer les modifications</Text>
        </TouchableOpacity>



{/*
        <TouchableOpacity onPress={handleUpdate} style={{ backgroundColor: tem.button, height: 44, borderRadius: 6, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: tem.background }}>Enregistrer les modifications</Text>
</TouchableOpacity>   */}
        {renderDatePicker()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

// import CountryPicker from "react-native-country-picker-modal";
  // const [showCountry, setshowCountry] = useState(false);
  //const [countryCode, setCountryCode] = useState("FR");
  //const [country, setCountry] = useState(null);
  //const [withCountryNameButton, setWithCountryNameButton] = useState(true);
  // const [withFlag, setWithFlag] = useState(true);
  //const [withEmoji, setWithEmoji] = useState(true);
  //const [withFilter, setWithFilter] = useState(true);
 // const [withAlphaFilter, setWithAlphaFilter] = useState(false);
 // const [withCallingCode, setWithCallingCode] = useState(false);
  /* const onSelect = (country) => {
     setCountryCode(country.cca2);
     setCountry(country);
   };
 */
/*


<View
style={{
  marginTop: 4,
  flexDirection: "column",
}}
>
<Text
  style={{
    fontSize: 16,
    lineHeight: 20,
  }}
>
  Country
</Text>
</View>
<View
style={{
  height: 44,
  width: "100%",
  borderColor: "rgba(84, 76, 76, 0.14)",
  borderWidth: 1,
  borderRadius: 4,
  marginVertical: 6,
  justifyContent: "center",
  paddingLeft: 8,
}}
>
<CountryPicker
  {...{
    countryCode,
    withFilter,
    withFlag,
    withCountryNameButton,
    withAlphaFilter,
    withCallingCode,
    withEmoji,
    onSelect,
  }}
  visible={showCountry}
/>
</View>  */



/* 
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ fontSize: 16, lineHeight: 20 }}>Password</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: "rgba(84, 76, 76, 0.14)",
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={password}
                onChangeText={(value) => setPassword(value)}
                editable={true}
                secureTextEntry
              />
            </View>
          </View> 
  */ 


          /*
         <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ fontSize: 16, lineHeight: 20 }}>Date or Birth</Text>
            <TouchableOpacity
              onPress={handleOnPressStartDate}
              style={{
                height: 44,
                width: "100%",
                borderColor: "rgba(84, 76, 76, 0.14)",
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <Text>{selectedStartDate}</Text>
            </TouchableOpacity>
          </View>

          */



        //  {renderDatePicker()}  a ajouter entre  </TouchableOpacity> et   </ScrollView>
       
     