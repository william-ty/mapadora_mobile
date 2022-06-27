import React, { Component, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Caption,
  Card,
  FAB,
  Headline,
  IconButton,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../../api/api";
import { printDate } from "../../api/util";
import { ReadMore } from "../../components/ReadMore";
import { Diary as DiaryModel } from "../../model/Diary";
import { useAuth } from "../../provider/AuthProvider";
import { useMainData } from "../../provider/MainDataProvider";
import Toast from "react-native-toast-message";
import { Participant } from "../../model/Participant";

export const Diary = ({ navigation }: any) => {
  const { currentTravel } = useMainData();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [currentDiary, setCurrentDiary] = useState<DiaryModel>();
  const [editionText, setEditionText] = useState("");

  const queryClient = useQueryClient();

  const { isLoading: diaryIsLoading, data: diaries } = useQuery<
    DiaryModel[],
    Error
  >(["diaries", currentTravel?.id], () =>
    api
      .get({ route: DiaryModel.routeName, idTravel: currentTravel?.id })
      .then((diaries) => {
        return diaries.sort((a: DiaryModel, b: DiaryModel) => {
          if (a.updatedAt < b.updatedAt) return 1;
          if (a.updatedAt > b.updatedAt) return -1;
          return 0;
        });
      })
  );
  const { data: participants } = useQuery<Participant[], Error>(
    ["participants", currentTravel?.id],
    () =>
      api
        .get({ route: Participant.routeName, idTravel: currentTravel?.id! })
        .then((participants) => {
          return participants.filter((participant: Participant) => {
            return participant.id_traveler !== null;
          });
        })
  );

  const updateDiary = useMutation(api.update, {
    onSuccess: (diary, { id, body }) => {
      queryClient.setQueryData<DiaryModel[]>(
        ["diaries", currentTravel?.id],
        (diaries) =>
          diaries ? diaries.map((d) => (d.id === id ? diary : d)) : []
      );
      setCurrentDiary(undefined);
      setEditionText("");
      setIsEditing(false);
      Toast.show({
        type: "success",
        text1: "🎉 Édition réalisée avec succès !",
      });
    },
  });
  const deleteDiary = useMutation(api.delete, {
    onSuccess: (diary, { id }) => {
      queryClient.setQueryData<DiaryModel[]>(
        ["diaries", currentTravel?.id],
        (diaries) => diaries!.filter((d) => d.id !== id)
      );
      Toast.show({
        type: "success",
        text1: "🎉 Suppression réalisée avec succès !",
      });
    },
  });

  const onSubmitEdition = () => {
    const objectToSave = { ...currentDiary, content: editionText };

    updateDiary.mutate({
      route: DiaryModel.routeName,
      id: currentDiary?.id!,
      body: objectToSave,
      idTravel: currentTravel?.id,
    });
  };

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    fab: {
      position: "absolute",
      margin: 20,
      bottom: 0,
      borderRadius: 8,
      backgroundColor: colors.primaryMain,
    },
  });

  return (
    <>
      <ScrollView>
        <View
          style={{ display: "flex", alignItems: "center", marginVertical: 20 }}
        >
          <Headline>JOURNAL DE BORD</Headline>
        </View>
        {diaries && diaries?.length > 0 ? (
          diaries?.map((diaryEntry, idx) => {
            return (
              <Card
                key={idx}
                style={{ marginVertical: 5, marginHorizontal: 10 }}
              >
                <Card.Content>
                  {isEditing && diaryEntry?.id === currentDiary?.id ? (
                    <>
                      <TextInput
                        label=""
                        value={editionText}
                        multiline
                        onChangeText={(text) => setEditionText(text)}
                        autoComplete
                      />
                      <Button mode="outlined" onPress={onSubmitEdition}>
                        Valider
                      </Button>
                    </>
                  ) : (
                    <>
                      <ReadMore size={100} style={{ fontSize: 16 }}>
                        {diaryEntry.content}
                      </ReadMore>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                        }}
                      >
                        <Caption>
                          {printDate(new Date(diaryEntry?.createdAt))}{" "}
                          {
                            participants
                              ?.filter(
                                (p) => p.id_traveler === diaryEntry.id_traveler
                              )
                              .shift()?.name
                          }
                        </Caption>
                        {diaryEntry?.id &&
                          diaryEntry?.id_traveler === user?.id && (
                            <View
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <IconButton
                                icon="pen"
                                onPress={() => {
                                  setIsEditing(true);
                                  setCurrentDiary(diaryEntry);
                                  setEditionText(diaryEntry.content);
                                }}
                                style={{
                                  backgroundColor: colors.primaryLighty,
                                  elevation: 3,
                                }}
                              />
                              <IconButton
                                icon="delete"
                                style={{
                                  backgroundColor: colors.primaryLighty,
                                  elevation: 3,
                                }}
                                onPress={() => {
                                  Alert.alert(
                                    "Veuillez confirmer cette action",
                                    "Voulez vous réellement supprimer cette entrée de journal ?",
                                    [
                                      {
                                        text: "Non",
                                      },
                                      {
                                        text: "Oui",
                                        onPress: () => {
                                          deleteDiary.mutate({
                                            route: DiaryModel.routeName,
                                            id: diaryEntry.id!,
                                            idTravel: currentTravel?.id,
                                          });
                                        },
                                      },
                                    ]
                                  );
                                }}
                              />
                            </View>
                          )}
                      </View>
                    </>
                  )}
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Title
                style={{ textAlign: "center", width: "90%", marginTop: 20 }}
              >
                {diaryIsLoading
                  ? "Chargement en cours..."
                  : diaries &&
                    diaries?.length < 1 &&
                    "Oups, il n'y a aucunes entrées de journal à afficher. \n\n Ajoutez en dès maintenant !"}
              </Title>
            </View>
          </>
        )}
      </ScrollView>
      <View style={{ display: "flex", alignItems: "center" }}>
        <FAB
          style={styles.fab}
          small
          label="AJOUTER UNE ENTRÉE"
          icon="plus"
          onPress={() => navigation.navigate("AddDiaryEntry")}
        />
      </View>
    </>
  );
};
