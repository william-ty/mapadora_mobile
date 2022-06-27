import React, { useState } from "react";
import { useTheme, List } from "react-native-paper";
import { useQuery } from "react-query";
import api from "../../api/api";
import { Step } from "../../model/Step";
import { Trip } from "../../model/Trip";
import { useMainData } from "../../provider/MainDataProvider";
import { View } from "../Themed";

export const TripList = ({ navigation }: any) => {
  const { currentTravel } = useMainData();

  const tripQuery = useQuery<Trip[], Error>(["trips", currentTravel?.id], () =>
    api.get({ route: Trip.routeName, idTravel: currentTravel?.id })
  );
  const stepQuery = useQuery<Step[], Error>(["steps", currentTravel?.id], () =>
    api.get({ route: Step.routeName, idTravel: currentTravel?.id })
  );

  const compareOrder = (a: Step, b: Step) => {
    return a.order - b.order;
  };

  const sortedSteps = stepQuery.data?.sort(compareOrder);
  const { colors } = useTheme();


  return (
    <>
      <List.Accordion
        title="Trajets"
        left={(props) => <List.Icon {...props} icon="map-marker-distance" />}
        theme={{ colors: { primary: colors.accentLightest } }}
        style={{ backgroundColor: colors.accentLighty }}
      >
        {sortedSteps && sortedSteps.length > 1 ? (
          sortedSteps.map((step, idx) => {
            if (idx > 0) {
              const departure_step = sortedSteps[idx - 1];
              const arrival_step = step;
              const trip = tripQuery?.data?.filter(
                (trip) => trip.id === step.id_trip
              )[0];

              return (
                <List.Item
                  style={{
                    backgroundColor: colors.accentLighter,
                    borderBottomWidth: 1,
                    borderColor: colors.accentLight,
                  }}
                  key={idx}
                  title={`De ${departure_step?.element?.name} à ${arrival_step?.element?.name}`}
                  onPress={() =>
                    navigation.navigate("TripDetails", {
                      id: step?.id,
                    })
                  }
                />
              );
            } else return <View key={idx}></View>;
          })
        ) : (
          <List.Item style={{
            backgroundColor: colors.accentLighter,
          }} title={"Aucun trajet pour le moment"} />
        )}
      </List.Accordion>
    </>
  );
};
