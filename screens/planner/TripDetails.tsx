import React, { useEffect, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import {
  useTheme,
  Button,
  Headline,
  List,
  Subheading,
  Text,
} from "react-native-paper";
import { useQuery } from "react-query";
import api from "../../api/api";
import { DocumentList } from "../../components/stepper/DocumentList";
import { TaskList } from "../../components/stepper/TaskList";
import { InterestPoint } from "../../model/InterestPoint";
import { Step } from "../../model/Step";
import { Trip } from "../../model/Trip";
import { useMainData } from "../../provider/MainDataProvider";
import { StepDetails } from "./StepDetails";

export const TripDetails = ({ route, navigation }: any) => {
  const { currentTravel } = useMainData();
  const { colors } = useTheme();

  const [isInformationExpanded, setIsInformationExpanded] = useState(true);
  const [currentScroll, setCurrentScroll] = useState<number>();

  const stepId = route.params?.id;

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

  let departure_step: Step | undefined;
  let arrival_step: Step | undefined;
  let trip: Trip | undefined;

  sortedSteps?.forEach((step, idx) => {
    if (step.id === stepId) {
      if (idx > 0) departure_step = sortedSteps[idx - 1];
      arrival_step = step;
      trip = tripQuery?.data?.filter((trip) => trip.id === step.id_trip)[0];
    }
    if (step.id?.toString() === stepId) arrival_step = step;
  });

  return (
    <>
      <ScrollView
        style={{ flex: 1, width: "100%", backgroundColor: colors.accentLight }}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
          setCurrentScroll(e.nativeEvent.contentOffset.y)
        }
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            paddingVertical: 10,
            backgroundColor: colors.accentLightest,
            margin: 10,
            borderRadius: 6,
            elevation: 1,
          }}
        >
          <Subheading style={{ textTransform: "uppercase" }}>Trajet</Subheading>
          <Headline style={{ textAlign: "center" }}>
            "{trip?.element.name}"
          </Headline>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Pressable
              onPress={() =>
                navigation.navigate("TabOne", {
                  coordinates: arrival_step?.point.coordinates,
                })
              }
            >
              <List.Icon
                style={{
                  backgroundColor: colors.accentLighty,
                  borderRadius: 50,
                }}
                icon="map"
              />
            </Pressable>
          </View>
        </View>
        <List.Accordion
          title="Informations"
          theme={{ colors: { primary: colors.accentDarky } }}
          left={(props) => <List.Icon {...props} icon="information-variant" />}
          style={{
            backgroundColor: colors.accentLighter,
          }}
        >
          <List.Item
            title={"Étapes"}
            style={{
              backgroundColor: colors.accentLightest,
              borderBottomWidth: 1,
              borderColor: colors.accentLight,
            }}
            description={`De ${departure_step?.element?.name} à ${arrival_step?.element?.name}`}
          />
          {/* <List.Item title={"Date prévisionnelle"} description={""} /> */}
          <List.Item
            title={"Description"}
            style={{
              backgroundColor: colors.accentLightest,
              borderBottomWidth: 1,
              borderColor: colors.accentLight,
            }}
            description={trip?.element.description}
          />
          <List.Item
            title={"Mode de transport"}
            style={{
              backgroundColor: colors.accentLightest,
              borderBottomWidth: 1,
              borderColor: colors.accentLight,
            }}
            description={trip?.transport_mode?.name}
          />
        </List.Accordion>
        <DocumentList
          elementId={trip?.element.id}
          currentScroll={currentScroll}
        />
      </ScrollView>
    </>
  );
};
