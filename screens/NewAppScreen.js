import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const EditProfile = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [Name, setName] = useState("Melissa");
  const [LastName, setLastName] = useState("Peters");
  const [Bio, setBio] = useState("Melissa Peters");
  const [email, setEmail] = useState("metperters@gmail.com");
  const [password, setPassword] = useState("randompassword");
  const [Adresse, setAdresse] = useState("Adresse");
  const [Workspace, setWorkspace] = useState("Workspace");
  const [Portable, setPortable] = useState("Portable");
  const [selectedStartDate, setSelectedStartDate] = useState("01/01/1990");

  const handleUpdate = () => {
    const updateUser = {
      Name: Name,
      LastName: LastName,
      Bio: Bio,
      Email: email,
      Password: password,
      Date: selectedStartDate,
      image: selectedImage,
      Adrsse: Adresse,
      Country: countryCode,
      Workspace: Workspace,
      NumPortable: Portable,
    };

    axios
      .post("http://192.168.1.122:3000/update-user", updateUser)
      .then((response) => {
        console.log(response);
        Alert.alert("Update Successful", "Your information has been updated successfully");
      })
      .catch((error) => {
        Alert.alert("Update failed");
        console.log("error", error);
      });
  };

  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 22 }}>
      <View style={{ marginHorizontal: 12, flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", left: 0 }}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 14, largeTitle: 16 }}>Edit Profile</Text>
      </View>
      <ScrollView>
        <View style={{ alignItems: "center", marginVertical: 22 }}>
          <TouchableOpacity onPress={handleImageSelection}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={{ height: 170, width: 170, borderRadius: 85, borderWidth: 2, borderColor: "#242760" }} />
            ) : (
              <View style={{ height: 170, width: 170, borderRadius: 85, borderWidth: 2, borderColor: "#242760", justifyContent: "center", alignItems: "center" }}>
                <MaterialIcons name="photo-camera" size={32} color={"#242760"} />
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* Rest of your form inputs */}
        <TouchableOpacity onPress={handleUpdate} style={{ backgroundColor: "#242760", height: 44, borderRadius: 6, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Text style={{ fontFamily: "regular", fontSize: 18, lineHeight: 22, color: "#FFFFFF" }}>Save Change</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
