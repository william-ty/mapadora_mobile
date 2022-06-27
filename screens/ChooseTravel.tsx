import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { useTheme, Button, Paragraph, Subheading, Text, Title } from "react-native-paper";
import { View } from "../components/Themed";
import { useMainData } from "../provider/MainDataProvider";
import { useAuth } from "../provider/AuthProvider";
import { useQuery } from "react-query";
import { Travel } from "../model/Travel";
import api from "../api/api";

export const ChooseTravel = ({ navigation, route }: any) => {
  const { setCurrentTravel, myTravels } = useMainData();
  const { signout } = useAuth();

  const disableAutoNav = route.params?.disableAutoNav;

  useQuery<Travel[], Error>(["mytravels"], () =>
    api.get({ route: "mytravels" })
  );

  // AUTO NAVIGATION ON START
  useEffect(() => {
    if (myTravels && !disableAutoNav) {
      const travelToOpen = myTravels
        .filter((travel) => {
          const startDate = travel?.start_date && new Date(travel?.start_date);
          const endDate = travel?.end_date && new Date(travel?.end_date);

          return startDate && !endDate;
        })
        .shift();

      if (travelToOpen) {
        setCurrentTravel(travelToOpen);
        navigation.navigate("Root", {
          screen: "PlannerNavigation",
          params: {
            goToTravelTracking: true,
          },
        });
      } else if (myTravels.length == 1) {
        setCurrentTravel(myTravels[0]);
        navigation.replace("Root");
      }
    }
  }, [myTravels]);

  const { colors } = useTheme();

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View
          style={{
            justifyContent: "center", //Centered vertically
            alignItems: "center", // Centered horizontally
            flex: 1,
            paddingHorizontal: 40,
          }}
        >
          <Title style={{ textAlign: "center", marginBottom: 20 }}>
            Veuillez choisir un voyage pour continuer
          </Title>
          {myTravels && myTravels.length > 0 ? (
            myTravels.map((travel) => (
              <Button
                key={travel.id}
                mode="outlined"
                style={{ marginVertical: 5, borderWidth: 2, borderColor: colors.primaryMain, borderRadius: 8 }}
                onPress={() => {
                  if (travel.id) {
                    setCurrentTravel(travel);
                    navigation.replace("Root");
                  }
                }}

              >
                {travel.name}
              </Button>
            ))
          ) : (
            <>
              <Subheading style={{ textAlign: "center", marginBottom: 15, backgroundColor: colors.grayLightest, padding: 10, borderRadius: 6 }}>
                Aucun voyage trouvé !
              </Subheading>
              <Subheading style={{ textAlign: "center" }}>
                Pour continuer, veuillez commencer par créer un
                voyage sur notre application web.
              </Subheading>
            </>
          )}
          <Button
            color="white"
            onPress={async () => {
              signout();
              navigation.replace("Auth");
            }}
            style={{ marginTop: 40, backgroundColor: 'darkred', borderRadius: 6, elevation: 3 }}
          >
            Déconnexion
          </Button>
        </View>
      </ScrollView>
    </>
  );
};
