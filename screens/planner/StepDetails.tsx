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
import { InterestPointList } from "../../components/stepper/InterestPointList";
import { TaskList } from "../../components/stepper/TaskList";
import { Step } from "../../model/Step";
import { useMainData } from "../../provider/MainDataProvider";
import { OpenMapDirections } from "react-native-navigation-directions";
import {
  dateToFrenchFormat,
  getDurationUntilStep,
  getTravelStartDate,
} from "../../api/util";

export const StepDetails = ({ navigation, route }: any) => {
  const { currentTravel } = useMainData();

  const { colors } = useTheme();

  const [isInformationExpanded, setIsInformationExpanded] = useState(true);
  const [currentScroll, setCurrentScroll] = useState<number>();

  const stepId = route.params?.id;

  const { data: stepData } = useQuery<Step[], Error>(
    ["steps", currentTravel?.id],
    () => api.get({ route: Step.routeName, idTravel: currentTravel?.id })
  );

  const step =
    Array.isArray(stepData) && stepData
      ? stepData.filter((step) => step.id === stepId)[0]
      : null; // TODO: Remove when Api retur []

  const daysUntilStep = stepData ? getDurationUntilStep(stepData, stepId) : 0;
  const travelStartDate = currentTravel && getTravelStartDate(currentTravel);
  let startDate = travelStartDate && new Date(travelStartDate.getTime());
  startDate?.setDate(startDate.getDate() + daysUntilStep);
  let endDate = startDate && new Date(startDate.getTime());
  endDate?.setDate(endDate.getDate() + (step?.duration || 0));

  const displayDate = startDate ? dateToFrenchFormat(startDate) : null;
  const endDisplayDate = endDate ? dateToFrenchFormat(endDate) : null;

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: colors.secondaryLight,
        }}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
          setCurrentScroll(e.nativeEvent.contentOffset.y)
        }
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            paddingVertical: 10,
            backgroundColor: colors.secondaryLightest,
            margin: 10,
            borderRadius: 6,
            elevation: 1,
          }}
        >
          <Subheading style={{ textTransform: "uppercase" }}>Étape</Subheading>
          <Headline>"{step?.element?.name}"</Headline>
          {displayDate && endDisplayDate && (
            <Paragraph>
              Du {displayDate} au {endDisplayDate}
            </Paragraph>
          )}
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Pressable
              onPress={() =>
                navigation.navigate("TabOne", {
                  coordinates: step?.point.coordinates,
                })
              }
            >
              <List.Icon
                style={{
                  backgroundColor: colors.secondaryLighty,
                  borderRadius: 50,
                }}
                icon="map"
              />
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.navigate("WeatherDetails", {
                  defaultName: step?.element.name,
                  lat: step?.point.coordinates[1],
                  lng: step?.point.coordinates[0],
                })
              }
            >
              <List.Icon
                style={{
                  backgroundColor: colors.secondaryLighty,
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
                    latitude: step?.point.coordinates[1],
                    longitude: step?.point.coordinates[0],
                  },
                  "d"
                )
              }
            >
              <List.Icon
                style={{
                  backgroundColor: colors.secondaryLighty,
                  borderRadius: 50,
                }}
                icon="navigation"
              />
            </Pressable>
          </View>
        </View>
        <List.Accordion
          title="Informations"
          theme={{ colors: { primary: colors.secondaryMain } }}
          style={{
            backgroundColor: colors.secondaryLighter,
          }}
          left={(props) => <List.Icon {...props} icon="information-variant" />}
        >
          {step?.element?.description && (
            <List.Item
              title={"Description"}
              description={step.element.description}
              style={{
                backgroundColor: colors.secondaryLightest,
              }}
            />
          )}
          {step?.duration && (
            <List.Item
              title={"Durée"}
              description={`${step.duration} jour${
                step.duration > 1 ? "s" : ""
              }`}
              style={{
                backgroundColor: colors.secondaryLightest,
                borderBottomWidth: 1,
                borderColor: colors.secondaryLight,
              }}
            />
          )}
          <List.Item
            title={"Coordonnées"}
            style={{
              backgroundColor: colors.secondaryLightest,
              borderBottomWidth: 1,
              borderColor: colors.secondaryLight,
            }}
            description={`${step?.point.coordinates[0]}, ${step?.point.coordinates[1]}`}
          />
        </List.Accordion>
        <InterestPointList stepId={stepId} navigation={navigation} showDay />
        <DocumentList
          elementId={step?.element?.id}
          currentScroll={currentScroll}
        />
        <TaskList elementId={step?.element?.id} currentScroll={currentScroll} />
      </ScrollView>
    </>
  );
};
