import React, { Component, useEffect, useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { Button, Caption, Card, Headline, Title } from "react-native-paper";
import { useQuery } from "react-query";
import api from "../../api/api";
import { printDate, url_prefix } from "../../api/util";
import { ReadMore } from "../../components/ReadMore";
import { Diary as DiaryModel } from "../../model/Diary";
import { Participant } from "../../model/Participant";
import { Photo as PhotoModel } from "../../model/Photo";
import { useMainData } from "../../provider/MainDataProvider";

export const Timeline = ({
  navigation,
  setShowImageViewer,
  setCurrentImageIndex,
}: any) => {
  const { currentTravel } = useMainData();

  const [memories, setMemories] = useState<(PhotoModel | DiaryModel)[]>([]);

  const {
    isLoading: diariesIsLoading,
    isError: diariesIsError,
    error: diariesError,
    data: diaries,
  } = useQuery<DiaryModel[], Error>(["diaries", currentTravel?.id], () =>
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

  const {
    isLoading: photosIsLoading,
    isError: photosIsError,
    error: photosError,
    data: photos,
  } = useQuery<PhotoModel[], Error>(["photos", currentTravel?.id], () =>
    api
      .get({ route: PhotoModel.routeName, idTravel: currentTravel?.id })
      .then((photos) => {
        return photos.sort((a: PhotoModel, b: PhotoModel) => {
          if (a.updatedAt < b.updatedAt) return 1;
          if (a.updatedAt > b.updatedAt) return -1;
          return 0;
        });
      })
      .then((photosSorted) => {
        photosSorted.forEach((photo: PhotoModel) => {
          photo.path = url_prefix + "/" + photo.path;
        });

        return photosSorted;
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

  useEffect(() => {
    const memoriesTemp: any = photos?.slice();

    diaries?.forEach((diary) => {
      memoriesTemp?.push(diary);
    });

    memoriesTemp?.sort((a: any, b: any) => {
      if (a.updatedAt < b.updatedAt) return 1;
      if (a.updatedAt > b.updatedAt) return -1;
      return 0;
    });

    setMemories(memoriesTemp);
  }, [photos, diaries]);

  const showViewer = (id: number) => {
    setCurrentImageIndex(id);
    setShowImageViewer(true);
  };

  let imageIndex = -1;

  return (
    <>
      <ScrollView>
        <View
          style={{ display: "flex", alignItems: "center", marginVertical: 20 }}
        >
          <Headline style={{ textTransform: "uppercase" }}>Timeline</Headline>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {memories && memories?.length > 0 ? (
            memories?.map((memory, idx) => {
              if (memory.hasOwnProperty("path")) imageIndex++;
              const currentImageIndex = imageIndex;

              return memory.hasOwnProperty("path") ? (
                <Card
                  key={idx}
                  style={{
                    marginVertical: 5,
                    marginHorizontal: 3,
                    width: "30%",
                    margin: 0,
                  }}
                >
                  <Pressable onPress={() => showViewer(currentImageIndex)}>
                    <Image
                      source={{
                        // @ts-ignore
                        uri: memory?.path,
                      }}
                      style={{ width: "100%", aspectRatio: 1 }}
                    />
                    <Caption style={{ textAlign: "center" }}>
                      {printDate(new Date(memory?.createdAt))}
                    </Caption>
                  </Pressable>
                </Card>
              ) : (
                <Card
                  key={idx}
                  style={{
                    marginVertical: 5,
                    width: "95%",
                  }}
                >
                  <Card.Content>
                    <ReadMore size={100} style={{ fontSize: 16 }}>
                      {
                        // @ts-ignore
                        memory?.content
                      }
                    </ReadMore>
                    <Caption>
                      {printDate(new Date(memory?.createdAt))}{" "}
                      {
                        participants // @ts-ignore
                          ?.filter((p) => p.id_traveler === memory?.id_traveler)
                          .shift()?.name
                      }
                    </Caption>
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
                  {diariesIsLoading ||
                  photosIsLoading ||
                  (diaries && diaries?.length > 0 && memories?.length < 1) ||
                  (photos && photos?.length > 0 && memories?.length < 1)
                    ? "Chargement en cours..."
                    : diaries &&
                      diaries?.length < 1 &&
                      photos &&
                      photos?.length < 1 &&
                      "Oups, il n'y a aucun contenu à afficher. \n\n Ajoutez dès maintenant des photos et des entrées de journal !"}
                </Title>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
};
