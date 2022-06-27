import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { View } from "../../components/Themed";
import api from "../../api/api";
import { Button, Subheading, TextInput, Title } from "react-native-paper";
import { Diary } from "../../model/Diary";
import { useMutation, useQueryClient } from "react-query";
import { useMainData } from "../../provider/MainDataProvider";
import Toast from "react-native-toast-message";

export const AddDiaryEntry = ({ navigation }: any) => {
  const { currentTravel } = useMainData();

  const [diaryText, setDiaryText] = useState("");

  // Access the client
  const queryClient = useQueryClient();

  const sendDiaryEntry = () => {
    if (diaryText?.length >= 10 && diaryText?.length < 100) {
      // Diary object
      const diary = new Diary({
        content: diaryText,
        is_in_album: false,
        id_travel: currentTravel?.id,
      });
      setDiaryText("");

      // Send to api
      createDiary.mutate({
        route: Diary.routeName,
        body: diary,
        idTravel: currentTravel?.id,
      });
    } else {
      diaryText?.length < 10
        ? Toast.show({
            type: "error",
            text1: "L'entrée de journal est trop courte",
            text2: "Le texte doit contenir au minimum 10 caractères",
          })
        : Toast.show({
            type: "error",
            text1: "L'entrée de journal est trop longue",
            text2: "Le texte ne doit pas dépasser les 10000 caractères",
          });
    }
  };

  // Mutations
  const createDiary = useMutation(api.create, {
    onSuccess: (diary) => {
      queryClient.setQueryData<Diary[]>(
        ["diaries", currentTravel?.id],
        (diaries) => (diaries ? [diary, ...diaries] : [diary])
      );
      Toast.show({
        type: "success",
        text1: "Succès",
        text2: "Entrée de journal envoyée !",
      });
      navigation.navigate("Home");
    },
  });

  return (
    <>
      <View
        style={{
          height: "100%",
          padding: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title>JOURNAL DE BORD</Title>
        <Subheading>Ajouter une entrée</Subheading>
        <TextInput
          mode="outlined"
          label="Journal de bord"
          placeholder="Écrivez quelque chose..."
          value={diaryText}
          onChangeText={(text) => setDiaryText(text)}
          multiline
          numberOfLines={10}
          style={{ width: "100%", maxHeight: "75%" }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Annuler
          </Button>
          <Button mode="contained" onPress={sendDiaryEntry}>
            Envoyer
          </Button>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
