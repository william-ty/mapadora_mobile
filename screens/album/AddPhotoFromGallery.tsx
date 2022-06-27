import React, { useMemo, useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { AssetsSelector } from "expo-images-picker";
import { Ionicons } from "@expo/vector-icons";
import { MediaType } from "expo-media-library";
import api from "../../api/api";
import { MediaTypeOptions } from "expo-image-picker";
import { Photo } from "../../model/Photo";
import { useMutation, useQueryClient } from "react-query";
import { useMainData } from "../../provider/MainDataProvider";
import { ActivityIndicator, Paragraph } from "react-native-paper";
import Toast from "react-native-toast-message";

const ForceInset = {
  top: "never",
  bottom: "never",
};

// IOS users , make sure u can use the images uri to upload , if your getting invalid file path or u cant work with asset-library://
// Use = > getImageMetaData: true which will be little slower but give u also the absolute path of the Asset. just console loge the result to see the localUri

// See => https://docs.expo.dev/versions/latest/sdk/media-library/#assetinfo

export const AddPhotoFromGallery = ({ navigation }: any) => {
  const { currentTravel } = useMainData();
  const [isSending, setIsSending] = useState(false);

  // Access the client
  const queryClient = useQueryClient();

  const onSuccess = (data: any) => {
    if (data?.length < 1) {
      Toast.show({
        type: "error",
        text1: "Veuillez sélectionner au moins une photo",
      });
    } else {
      setIsSending(true);

      // Formdata
      const formData = new FormData();
      data?.map((img: any) => {
        const extension = img.filename.split(".").pop();

        const image: any = {
          name: img.filename,
          type: `image/${extension}`,
          uri: img.uri,
        };

        formData.append("images", image);
      });
      formData.append("is_in_album", "false");
      formData.append("is_public", "false");

      createPhotos.mutate({
        route: Photo.routeName,
        formData: formData,
        idTravel: currentTravel?.id,
      });
    }
  };

  // Mutations
  const createPhotos = useMutation(api.createWithFormData, {
    onSuccess: (newPhotos) => {
      queryClient.setQueryData<Photo[]>(
        ["images", currentTravel?.id],
        (photos) => (photos ? [...newPhotos, ...photos] : [...newPhotos])
      );
      navigation.navigate("Home");
      Toast.show({
        type: "success",
        text1: "Images envoyées avec succès !",
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Une erreur est survenue lors de l'envoi",
      });
    },
  });

  /*
  Array [
  Object {
    "albumId": "1028075469",
    "creationTime": 1646911456218,
    "duration": 0,
    "filename": "Screenshot_20220310_122416_com.rynatsa.xtrendspeed.jpg",
    "height": 1560,
    "id": "253047",
    "mediaType": "photo",
    "modificationTime": 1646911456000,
    "uri": "file:///storage/emulated/0/Pictures/Screenshots/Screenshot_20220310_122416_com.rynatsa.xtrendspeed.jpg",
    "width": 720,
  },
]
  */

  const widgetErrors = useMemo(
    () => ({
      errorTextColor: "black",
      errorMessages: {
        hasErrorWithPermissions: "Please Allow media gallery permissions.",
        hasErrorWithLoading: "There was an error while loading images.",
        hasErrorWithResizing: "There was an error while loading images.",
        hasNoAssets: "No images found.",
      },
    }),
    []
  );

  const widgetSettings = useMemo(
    () => ({
      getImageMetaData: false, // true might perform slower results but gives meta data and absolute path for ios users
      initialLoad: 50,
      assetsType: [MediaType.photo, MediaType.video],
      minSelection: 1,
      maxSelection: 20,
      portraitCols: 4,
      landscapeCols: 4,
    }),
    []
  );

  const widgetResize = useMemo(
    () => ({
      width: 50,
      compress: 0.7,
      base64: false,
      saveTo: "jpeg",
    }),
    []
  );

  const _textStyle = {
    color: "white",
  };

  const _buttonStyle = {
    backgroundColor: "#8EA36B",
    borderRadius: 5,
  };

  const widgetNavigator = useMemo(
    () => ({
      Texts: {
        finish: "VALIDER",
        back: "RETOUR",
        selected: "selectionné(s)",
      },
      midTextColor: "black",
      minSelection: 0,
      buttonTextStyle: _textStyle,
      buttonStyle: _buttonStyle,
      onBack: () => {
        navigation.goBack();
      },
      onSuccess: (e: any) => onSuccess(e),
    }),
    []
  );

  const widgetStyles = useMemo(
    () => ({
      margin: 2,
      bgColor: "white",
      spinnerColor: "blue",
      widgetWidth: 99,
      videoIcon: {
        Component: Ionicons,
        iconName: "ios-videocam",
        color: "tomato",
        size: 20,
      },
      selectedIcon: {
        Component: Ionicons,
        iconName: "ios-checkmark-circle-outline",
        color: "white",
        bg: "#0eb14970",
        size: 26,
      },
    }),
    []
  );

  return (
    <View style={styles.container}>
      {!isSending ? (
        <AssetsSelector
          Settings={widgetSettings}
          Errors={widgetErrors}
          Styles={widgetStyles}
          Navigator={widgetNavigator}
          // Resize={widgetResize} know how to use first , perform slower results.
        />
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
  },
});
