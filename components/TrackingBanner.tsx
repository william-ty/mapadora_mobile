import React from "react";
import { Alert, Pressable } from "react-native";
import { useTheme, Subheading } from "react-native-paper";
import { useMutation, useQueryClient } from "react-query";
import api from "../api/api";
import { View } from "../components/Themed";
import { Travel } from "../model/Travel";
import { useAuth } from "../provider/AuthProvider";
import { useMainData } from "../provider/MainDataProvider";

export const TrackingBanner = ({ navigation }: any) => {
  const { currentTravel, admin } = useMainData();
  const { user } = useAuth();

  // Access the client
  const queryClient = useQueryClient();

  const startDate =
    currentTravel?.start_date && new Date(currentTravel?.start_date);
  const endDate = currentTravel?.end_date && new Date(currentTravel?.end_date);

  const showTrackingBanner = startDate && !endDate;
  const showStartTravelBanner =
    !startDate && !endDate && user?.id === admin?.id;
  const showEndTravelBanner = startDate && endDate && user?.id === admin?.id;

  const updateTravel = useMutation(api.update, {
    onSuccess: (travel, { id }) => {
      queryClient.setQueryData<Travel[]>(["mytravels"], (travels) =>
        travels!.map((t) => (t.id === id ? travel : t))
      );
    },
  });
  const { colors } = useTheme();

  return (
    <>
      {showTrackingBanner && (
        <View
          style={{
            paddingVertical: 5,
            paddingHorizontal: "1%",
            // margin: 5,
            width: "100%",
            // borderRadius: 6,
            overflow: "hidden",
            alignSelf: "center",
            backgroundColor: "transparent",
            // backgroundColor: colors.accentLight
            position: "absolute",
            top: 0,
            zIndex: 10,
          }}
        >
          <Pressable
            style={{
              backgroundColor: colors.secondaryMain,
              height: 45,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
              elevation: 4,
              marginHorizontal: 4,
            }}
            android_ripple={{
              color: "black",
            }}
            onPress={() => navigation.navigate("TravelTracking")}
          >
            <Subheading
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: colors.secondaryLightest,
                textTransform: "uppercase",
              }}
            >
              Suivre le voyage
            </Subheading>
          </Pressable>
        </View>
      )}
      {showStartTravelBanner && (
        <View
          style={{
            paddingVertical: 5,
            paddingHorizontal: "1%",
            // margin: 5,
            width: "100%",
            // borderRadius: 6,
            overflow: "hidden",
            alignSelf: "center",
            backgroundColor: "transparent",
            // backgroundColor: colors.accentLight
            position: "absolute",
            top: 0,
            zIndex: 10,
          }}
        >
          <Pressable
            style={{
              backgroundColor: colors.primaryMain,
              height: 45,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
              elevation: 4,
              marginHorizontal: 4,
            }}
            onPress={() => {
              Alert.alert(
                "Début du voyage",
                "Voulez vous démarrer votre voyage ?",
                [
                  {
                    text: "Non",
                  },
                  {
                    text: "Oui",
                    onPress: () => {
                      const newTravel = currentTravel!;
                      newTravel.start_date = new Date().toISOString();

                      currentTravel?.id &&
                        updateTravel.mutate({
                          route: Travel.routeName,
                          id: currentTravel.id,
                          body: newTravel,
                        });
                    },
                  },
                ],
                { cancelable: false }
              );
            }}
          >
            <Subheading
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: colors.primaryLightest,
                textTransform: "uppercase",
              }}
            >
              Démarrer mon voyage !
            </Subheading>
          </Pressable>
        </View>
      )}
      {showEndTravelBanner && (
        <View style={{ padding: 5, backgroundColor: "orange", width: "100%" }}>
          <Subheading style={{ textAlign: "center", fontWeight: "bold" }}>
            Voyage terminé !
          </Subheading>
        </View>
      )}
    </>
  );
};
