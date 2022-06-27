import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useTheme, List, Subheading } from "react-native-paper";
import { useQuery } from "react-query";
import api from "../../api/api";
import { Document } from "../../model/Document";
import { InterestPoint } from "../../model/InterestPoint";
import { useMainData } from "../../provider/MainDataProvider";
import { OpenMapDirections } from "react-native-navigation-directions";
import { Text } from "../Themed";

export const InterestPointList = (props: any) => {
  const { currentTravel } = useMainData();
  //const [isPoiExpanded, setIsPoiExpanded] = useState(true);
  const stepId = props.stepId;
  const day = props.day;
  const navigation = props.navigation;
  const accordion = !props.disableAccordion;
  const showDay = props.showDay;

  const interestPointQuery = useQuery<InterestPoint[], Error>(
    ["interestpoints", 1 /*TODO PUT TRAVEL ID TO CACHE NAME*/],
    () =>
      api.get({ route: InterestPoint.routeName, idTravel: currentTravel?.id })
  );
  const interestPointList = Array.isArray(interestPointQuery.data) // TODO: REMOVE WHEN API RETURN []
    ? interestPointQuery.data?.filter((poi) => {
      let isCorrect = true;

      if (stepId && isCorrect) isCorrect = poi.id_step === stepId;
      if (day && isCorrect) isCorrect = poi?.day === day;
      return isCorrect;
    })
    : [];

  const compareDay = (a: InterestPoint, b: InterestPoint) => {
    const dayA = a?.day ? a.day : 0;
    const dayB = b?.day ? b.day : 0;
    return dayB - dayA;
  };

  interestPointList?.sort(compareDay);
  const { colors } = useTheme();

  return (
    <>
      {accordion ? (
        <List.Accordion
          theme={{ colors: { primary: colors.primaryLightest } }}
          title="Points d'intérêt"
          left={(props) => <List.Icon {...props} icon="pin" />}
          style={{ backgroundColor: colors.primaryLighty }}
        >
          {/* <View style={{ backgroundColor: colors.primaryDarky }}> */}
          {interestPointList && interestPointList.length > 0 ? (
            interestPointList.map((poi, idx) => {
              const showDayProps = showDay
                ? {
                  right: (props: any) => (
                    <>
                      <Subheading>
                        {poi.day ? `Jour ${poi.day}` : `Non planifié`}
                      </Subheading>
                    </>
                  ),
                }
                : {};

              return (
                <List.Item
                  style={{
                    backgroundColor: colors.primaryLighter,
                    borderBottomWidth: 1,
                    borderColor: colors.primaryLight,
                  }}

                  key={idx}
                  title={poi.element?.name}
                  {...showDayProps}
                  onPress={() =>
                    navigation.navigate("InterestPointDetails", {
                      id: poi.id,
                    })
                  }
                />
              );
            })
          ) : (
            <List.Item style={{ backgroundColor: colors.primaryLighter }}
              title={"Aucun point d'intérêt pour le moment"} />
          )}
          {/* </View> */}
        </List.Accordion>
      ) : (
        <>
          {interestPointList && interestPointList.length > 0 ? (
            interestPointList.map((poi, idx) => {
              return (
                <List.Item
                  key={idx}
                  title={poi.element?.name}
                  left={(props) => <List.Icon {...props} style={{ backgroundColor: 'transparent', borderRadius: 50 }} icon="pin" />}
                  right={(props) => (
                    <>
                      <Pressable
                        onPress={() =>
                          navigation.navigate("WeatherDetails", {
                            defaultName: poi?.element.name,
                            lat: poi?.point.coordinates[1],
                            lng: poi?.point.coordinates[0],
                          })
                        }
                      >
                        <List.Icon {...props} style={{ backgroundColor: colors.primaryLight, borderRadius: 50 }} icon="weather-sunny" />
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          OpenMapDirections(
                            null,
                            {
                              latitude: poi.point.coordinates[1],
                              longitude: poi.point.coordinates[0],
                            },
                            "d"
                          )
                        }
                      >
                        <List.Icon {...props} style={{ backgroundColor: colors.primaryLight, borderRadius: 50 }} icon="navigation" />
                      </Pressable>
                    </>
                  )}
                  onPress={() =>
                    navigation.navigate("InterestPointDetails", {
                      id: poi.id,
                    })
                  }
                />
              );
            })
          ) : (
            <List.Item title={"Aucun point d'intérêt à afficher"} />
          )}
        </>
      )
      }
    </>
  );
};
