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
  Paragraph,
  Subheading,
  Text,
} from "react-native-paper";
import { useQuery } from "react-query";
import api from "../../api/api";
import { DocumentList } from "../../components/stepper/DocumentList";
import { TaskList } from "../../components/stepper/TaskList";
import { InterestPoint } from "../../model/InterestPoint";
import { useMainData } from "../../provider/MainDataProvider";
import { OpenMapDirections } from "react-native-navigation-directions";
import { Step } from "../../model/Step";
import {
  dateToFrenchFormat,
  getDurationUntilStep,
  getTravelStartDate,
} from "../../api/util";

export const InterestPointDetails = ({ route, navigation }: any) => {
  const { currentTravel } = useMainData();
  const { colors } = useTheme();

  const [isInformationExpanded, setIsInformationExpanded] = useState(true);
  const [associatedStep, setAssociatedStep] = useState<Step>();
  const [predictedDate, setPredictedDate] = useState<Date>();
  const [currentScroll, setCurrentScroll] = useState<number>();

  const interestPointId = route.params?.id;

  const { data: stepData } = useQuery<Step[], Error>(
    ["steps", currentTravel?.id],
    () => api.get({ route: Step.routeName, idTravel: currentTravel?.id })
  );

  const sortedSteps = stepData?.sort((a: Step, b: Step) => a?.order - b?.order);

  const interestPointQuery = useQuery<InterestPoint[], Error>(
    ["interestpoints", 1 /*TODO PUT TRAVEL ID TO CACHE NAME*/],
    () =>
      api.get({ route: InterestPoint.routeName, idTravel: currentTravel?.id })
  );

  const poi =
    Array.isArray(interestPointQuery.data) && interestPointQuery.data
      ? interestPointQuery.data.filter((poi) => poi.id === interestPointId)[0]
      : null;
  // TODO: Remove when api eturned []

  useEffect(() => {
    if (poi?.id_step) {
      setAssociatedStep(
        sortedSteps?.filter((step) => step.id === poi.id_step).shift()
      );
    }
  }, [poi, sortedSteps]);

  useEffect(() => {
    if (
      sortedSteps &&
      associatedStep &&
      associatedStep?.id &&
      poi &&
      poi?.day
    ) {
      let currentDay = getDurationUntilStep(sortedSteps, associatedStep.id);
      currentDay += poi.day;
      let date = currentTravel && getTravelStartDate(currentTravel);
      date?.setDate(date.getDate() + currentDay);
      date && setPredictedDate(date);
    }
    // if (step?.duration) currentDay += step.duration;
  }, [sortedSteps, associatedStep, poi]);

  return (
    <>
      <ScrollView
        style={{ flex: 1, width: "100%", backgroundColor: colors.primaryLight }}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
          setCurrentScroll(e.nativeEvent.contentOffset.y)
        }
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            paddingVertical: 10,
            backgroundColor: colors.primaryLightest,
            margin: 10,
            borderRadius: 6,
            elevation: 1,
          }}
        >
          <Subheading style={{ textTransform: "uppercase" }}>
            Points d'intérêt
          </Subheading>
          <Headline>"{poi?.element?.name}"</Headline>
          {predictedDate && (
            <Paragraph>{dateToFrenchFormat(predictedDate)}</Paragraph>
          )}
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Pressable
              onPress={() =>
                navigation.navigate("TabOne", {
                  coordinates: poi?.point.coordinates,
                })
              }
            >
              <List.Icon
                style={{
                  backgroundColor: colors.primaryLighty,
                  borderRadius: 50,
                }}
                icon="map"
              />
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.navigate("WeatherDetails", {
                  defaultName: poi?.element.name,
                  lat: poi?.point.coordinates[1],
                  lng: poi?.point.coordinates[0],
                })
              }
            >
              <List.Icon
                style={{
                  backgroundColor: colors.primaryLighty,
                  borderRadius: 50,
                }}
                icon="weather-sunny"
              />
            </Pressable>
            <Pressable
              onPress={() =>
                OpenMapDirections(
                  null,
                  {
                    latitude: poi?.point.coordinates[1],
                    longitude: poi?.point.coordinates[0],
                  },
                  "d"
                )
              }
            >
              <List.Icon
                style={{
                  backgroundColor: colors.primaryLighty,
                  borderRadius: 50,
                }}
                icon="navigation"
              />
            </Pressable>
          </View>
        </View>
        <List.Accordion
          title="Informations"
          theme={{ colors: { primary: colors.primaryDarky } }}
          style={{
            backgroundColor: colors.primaryLighter,
          }}
          left={(props) => <List.Icon {...props} icon="information-variant" />}
        >
          {poi?.element?.description && (
            <List.Item
              title={"Description"}
              description={poi.element.description}
              style={{
                backgroundColor: colors.primaryLightest,
                borderBottomWidth: 1,
                borderColor: colors.primaryLight,
              }}
            />
          )}
          {associatedStep && (
            <List.Item
              title={"Étape associée"}
              description={associatedStep?.element?.name}
              style={{
                backgroundColor: colors.primaryLightest,
                borderBottomWidth: 1,
                borderColor: colors.primaryLight,
              }}
            />
          )}
          {predictedDate &&
            (currentTravel?.start_date || currentTravel?.predicted_date) && (
              <List.Item
                title={"Date prévisionnelle"}
                description={dateToFrenchFormat(predictedDate)}
                style={{
                  backgroundColor: colors.primaryLightest,
                  borderBottomWidth: 1,
                  borderColor: colors.primaryLight,
                }}
              />
            )}
          <List.Item
            title={"Coordonnées"}
            style={{
              backgroundColor: colors.primaryLightest,
              borderBottomWidth: 1,
              borderColor: colors.primaryLight,
            }}
            description={`${poi?.point.coordinates[0]}, ${poi?.point.coordinates[1]}`}
          />
        </List.Accordion>
        <DocumentList
          elementId={poi?.element?.id}
          currentScroll={currentScroll}
        />
        <TaskList elementId={poi?.element?.id} currentScroll={currentScroll} />
      </ScrollView>
    </>
  );
};
