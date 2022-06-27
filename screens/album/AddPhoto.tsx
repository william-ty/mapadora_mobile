import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { View } from "../../components/Themed";
import * as ImagePicker from "expo-image-picker";
import api from "../../api/api";
import { Photo } from "../../model/Photo";
import { useMutation, useQueryClient } from "react-query";
import {
  ActivityIndicator,
  Button,
  Headline,
  Paragraph,
  useTheme,
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useMainData } from "../../provider/MainDataProvider";
import Toast from "react-native-toast-message";

export const AddPhoto = ({ navigation }: any) => {
  const { currentTravel } = useMainData();

  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { colors } = useTheme();

  // Access the client
  const queryClient = useQueryClient();

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(
        "Vous avez refusez la prise de photo, cette fonctionnalité est donc indisponible"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      setIsSending(true);
      setPickedImagePath(result.uri);

      const extension = result.uri.split(".").pop();
      const name = result.uri.split("/").pop();

      const image: any = {
        name: name,
        type: `${result.type}/${extension}`,
        uri: result.uri,
      };

      // Formdata
      const formData = new FormData();
      formData.append("images", image);
      formData.append("is_in_album", "false");
      formData.append("is_public", "false");

      createPhoto.mutate({
        route: Photo.routeName,
        formData: formData,
        idTravel: currentTravel?.id,
      });
    }
  };

  // Mutations
  const createPhoto = useMutation(api.createWithFormData, {
    onSuccess: (photo) => {
      queryClient.setQueryData<Photo[]>(
        ["images", currentTravel?.id],
        (photos) => (photos ? [photo, ...photos] : [photo])
      );
      navigation.navigate("Home");
      Toast.show({
        type: "success",
        text1: "Image envoyée avec succès !",
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Une erreur est survenue lors de l'envoi",
      });
    },
    onSettled: () => setIsSending(false),
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        width: "100%",
      }}
    >
      {!isSending ? (
        <View style={styles.container}>
          <Headline style={styles.title}>AJOUTER DES PHOTOS</Headline>
          <Button
            mode="outlined"
            onPress={() => {
              navigation.navigate("AddPhotoFromGallery");
            }}
            style={{ marginVertical: 10 }}
          >
            <Icon name="image" color={colors.primary} /> Depuis la gallerie
          </Button>
          <Button
            mode="outlined"
            onPress={openCamera}
            style={{ marginVertical: 10 }}
          >
            <Icon name="camera" color={colors.primary} /> Prendre une photo
          </Button>
        </View>
      ) : (
        <>
          <Paragraph style={{ textAlign: "center" }}>
            Envoi en cours... Veuillez patienter
          </Paragraph>
          <ActivityIndicator
            animating={isSending}
            color={"#8EA36B"}
            size="large"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    // fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  imageContainer: {
    padding: 30,
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: "cover",
  },
});
