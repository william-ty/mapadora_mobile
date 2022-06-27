import React from "react";
import { Button, IconButton, TextInput, Title } from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../../api/api";
import { View } from "../../components/Themed";
import { Travel } from "../../model/Travel";
import { useMainData } from "../../provider/MainDataProvider";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { Pressable } from "react-native";

export const ShareAlbum = ({ navigation }: any) => {
  const { currentTravel } = useMainData();
  const queryClient = useQueryClient();

  const {
    isLoading: isLoading,
    isError: isError,
    data: travelData,
  } = useQuery(["travelData", currentTravel?.id], () => {
    return api.get({ route: `travel/${currentTravel?.id}`, hasToken: true });
  });

  const updateTravel = useMutation(api.update, {
    onSuccess: (newTravelData, { id }) => {
      queryClient.setQueryData<Travel>(
        ["travelData", currentTravel?.id],
        (travelData) => newTravelData
      );
      Toast.show({
        type: "success",
        text1: `${
          newTravelData?.is_album_public
            ? "🎉 Album partagé avec succès !"
            : "Partage de l'album revoqué avec succès !"
        }`,
      });
    },
  });

  const copyToClipboard = (newClip: string) => {
    Clipboard.setString(newClip);
    Toast.show({
      type: "success",
      text1: "🎉 Lien copié avec succès !",
    });
    // showFeedback("Texte copié avec succès !");
  };

  return (
    <>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ justifyContent: "center", width: "80%" }}>
          <Title style={{ textAlign: "center", marginVertical: 10 }}>
            Partage de l'album
          </Title>
          {travelData && travelData.is_album_public ? (
            <>
              <Pressable
                onPress={() =>
                  copyToClipboard(
                    `https://mapadora.fr/view/${travelData.path_uid}/album`
                  )
                }
              >
                <TextInput
                  label="Lien de partage"
                  defaultValue={`https://mapadora.fr/view/${travelData.path_uid}/album`}
                  autoComplete
                  disabled
                  style={{ marginTop: 10 }}
                />
              </Pressable>
              <Button
                mode="contained"
                onPress={() => {
                  updateTravel.mutate({
                    route: Travel.routeName,
                    id: travelData?.id!,
                    body: {
                      ...travelData,
                      is_album_public: false,
                    },
                  });
                }}
                style={{ marginBottom: 10 }}
              >
                Révoquer le partage
              </Button>
            </>
          ) : (
            <Button
              mode="contained"
              onPress={() => {
                updateTravel.mutate({
                  route: Travel.routeName,
                  id: travelData?.id!,
                  body: {
                    ...travelData,
                    is_album_public: true,
                  },
                });
              }}
              style={{ marginVertical: 10 }}
            >
              Partager mon album
            </Button>
          )}

          <Button mode="outlined" onPress={() => navigation.goBack()}>
            Retour
          </Button>
        </View>
      </View>
    </>
  );
};
