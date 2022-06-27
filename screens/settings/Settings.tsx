import React from "react";
import { Alert, View } from "react-native";
import { useTheme, Button, List, Switch } from "react-native-paper";
import { useMutation, useQueryClient } from "react-query";
import api from "../../api/api";
import { Travel } from "../../model/Travel";
import { useAuth } from "../../provider/AuthProvider";
import { useMainData } from "../../provider/MainDataProvider";

export const Settings = ({ navigation, route }: any) => {
  const { signout, user } = useAuth();
  const {
    currentTravel,
    changeIsSavePositionActive,
    isSavePositionActive,
    admin,
  } = useMainData();

  // Access the client
  const queryClient = useQueryClient();

  const onToggleLocalization = () => {
    changeIsSavePositionActive(!isSavePositionActive);
  };

  const updateTravel = useMutation(api.update, {
    onSuccess: (travel, { id }) => {
      queryClient.setQueryData<Travel[]>(["mytravels"], (travels) =>
        travels!.map((t) => (t.id === id ? travel : t))
      );
    },
  });

  const startDate =
    currentTravel?.start_date && new Date(currentTravel?.start_date);
  const endDate = currentTravel?.end_date && new Date(currentTravel?.end_date);

  const showModifyStartDate = startDate && !endDate && user?.id === admin?.id;
  const showEndTravelItem = startDate && !endDate && user?.id === admin?.id;

  const { colors } = useTheme();

  return (
    <>
      <View style={{ backgroundColor: "white", height: "100%" }}>
        <List.Item
          title="Choix du voyage"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.grayLighter,
            borderTopWidth: 1,
            borderTopColor: colors.grayLighter,
            // elevation: 3, shadowColor: colors.primaryMain,
          }}
          description="Sélection du voyage courant"
          left={(props) => (
            <List.Icon
              {...props}
              style={{ justifyContent: "center" }}
              icon="wallet-travel"
            />
          )}
          onPress={() =>
            navigation.replace("ChooseTravel", {
              disableAutoNav: true,
            })
          }
        />
        <List.Item
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.grayLighter,
            // elevation: 3, shadowColor: colors.primaryMain,
          }}
          title="Enregistrer ma position"
          description="Activer le mode localisation"
          left={(props) => (
            <List.Icon
              {...props}
              style={{ justifyContent: "center" }}
              icon="crosshairs-gps"
            />
          )}
          right={() => (
            <Switch
              color={colors.primaryDarky}
              value={isSavePositionActive}
              onChange={onToggleLocalization}
            />
          )}
          onPress={onToggleLocalization}
        />
        {showEndTravelItem && (
          <List.Item
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.grayLighter,
              // elevation: 3, shadowColor: colors.primaryMain,
            }}
            title="Mettre fin à mon voyage"
            left={(props) => (
              <List.Icon
                {...props}
                style={{ justifyContent: "center" }}
                icon="calendar-remove"
              />
            )}
            onPress={() => {
              Alert.alert(
                "Fin du voyage",
                "Voulez mettre fin à votre voyage ?",
                [
                  {
                    text: "Non",
                  },
                  {
                    text: "Oui",
                    onPress: () => {
                      const newTravel = currentTravel!;
                      newTravel.end_date = new Date().toISOString();

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
          />
        )}
        {showModifyStartDate && (
          <List.Item
            title="Modifier la date de départ"
            description="Date de départ du voyage"
            left={(props) => <List.Icon {...props} icon="calendar" />}
            onPress={() => navigation.navigate("UpdateTravelStartDate")}
          />
        )}

        <Button
          color="white"
          onPress={async () => {
            signout();
            navigation.replace("Auth");
          }}
          style={{
            backgroundColor: "darkred",
            borderRadius: 6,
            margin: 10,
            marginTop: 15,
            elevation: 4,
          }}
        >
          Déconnexion
        </Button>
      </View>
    </>
  );
};
