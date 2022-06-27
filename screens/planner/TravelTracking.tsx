import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  Alert,
  ImageBackground,
  StyleSheet,
} from "react-native";
import {
  useTheme,
  Button,
  Headline,
  List,
  Paragraph,
  Subheading,
  Title,
  Divider,
} from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../../api/api";
import { DocumentList } from "../../components/stepper/DocumentList";
import { InterestPointList } from "../../components/stepper/InterestPointList";
import { TaskList } from "../../components/stepper/TaskList";
import { TripList } from "../../components/stepper/TripList";
import { SimpleWeatherCard } from "../../components/weather/SimpleWeatherCard";
import { Step } from "../../model/Step";
import { Travel } from "../../model/Travel";
import { useMainData } from "../../provider/MainDataProvider";
import { OpenMapDirections } from "react-native-navigation-directions";
import { dateToFrenchFormat } from "../../api/util";
import { useAuth } from "../../provider/AuthProvider";

const image = {
  uri: `https://images.pexels.com/photos/6087685/pexels-photo-6087685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
`,
};
// const image = {
//   uri: `https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
// ` };

export const TravelTracking = ({ navigation }: any) => {
  const { currentTravel, myTravels, admin } = useMainData();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<Step>();
  const [currentStepNumber, setCurrentStepNumber] = useState<number>();
  const [nextStep, setNextStep] = useState<Step>();
  const [currentDayOfStep, setCurrentDayOfStep] = useState<number>();
  const [currentDayOfTravel, setCurrentDayOfTravel] = useState<number>();
  const [maxDay, setMaxDay] = useState<number>();

  // Access the client
  const queryClient = useQueryClient();

  const {
    isLoading: stepsIsLoading,
    isError: stepsIsError,
    data: steps,
  } = useQuery<Step[], Error>(["steps", currentTravel?.id], () =>
    api.get({ route: Step.routeName, idTravel: currentTravel?.id })
  );

  const updateTravel = useMutation(api.update, {
    onSuccess: (travel, { id }) => {
      queryClient.setQueryData<Travel[]>(["mytravels"], (travels) =>
        travels!.map((t) => (t.id === id ? travel : t))
      );
      navigation.navigate("TravelDetails");
    },
  });

  const compareOrder = (a: Step, b: Step) => {
    return a.order - b.order;
  };

  useEffect(() => {
    const startDate =
      currentTravel?.start_date && new Date(currentTravel?.start_date);

    if (startDate && steps) {
      const currentAbsoluteDay = Math.ceil(
        (new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );
      setCurrentDayOfTravel(currentAbsoluteDay);
      const sortedSteps = steps?.sort(compareOrder);

      let currentMaxDay = 0;
      let i = 0;
      let hasCurrentDayBeenSet = false;

      while (i < sortedSteps.length) {
        const stepDuration = sortedSteps[i].duration;
        currentMaxDay += stepDuration;

        if (currentMaxDay >= currentAbsoluteDay && !hasCurrentDayBeenSet) {
          setCurrentStepNumber(i + 1);
          setCurrentStep(sortedSteps[i]);
          sortedSteps.length > i - 2 && setNextStep(sortedSteps[i + 1]);
          setCurrentDayOfStep(
            currentAbsoluteDay - (currentMaxDay - stepDuration)
          );
          hasCurrentDayBeenSet = true;
        }
        i++;
      }

      setMaxDay(currentMaxDay);
    }
  }, [steps, currentTravel]);
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: "center",
    },
  });

  return (
    <>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <ScrollView
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: colors.secondaryLightest,
            // backgroundColor: "rgba(250,250,250,0.9)",
          }}
        >
          {currentDayOfTravel && maxDay && currentDayOfTravel <= maxDay ? (
            <>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: 8,
                  paddingBottom: 3,
                  backgroundColor: "rgba(121,145,171,0.6)",
                  // marginHorizontal: 10,
                  // marginTop: 5,
                  marginBottom: 10,
                  // borderRadius: 6
                }}
              >
                <Subheading
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "white",
                    textShadowColor: "rgba(0, 0, 0, 0.75)",
                    textShadowOffset: { width: -1, height: 1 },
                    textShadowRadius: 5,
                  }}
                >
                  Suivi du voyage
                </Subheading>
                <Headline
                  style={{
                    textTransform: "capitalize",
                    // backgroundColor: colors.secondaryLight,
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    // elevation: 10,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 0.1)",
                    textShadowOffset: { width: -1, height: 1 },
                    textShadowRadius: 1,
                  }}
                >
                  "{currentTravel?.name}"
                </Headline>
                {currentStepNumber && currentDayOfStep && (
                  <Paragraph
                    style={{
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      color: "white",
                      textShadowColor: "rgba(0, 0, 0, 0.75)",
                      textShadowOffset: { width: -1, height: 1 },
                      textShadowRadius: 5,
                    }}
                  >
                    {`Étape ${currentStepNumber} - Jour ${currentDayOfStep}`}
                  </Paragraph>
                )}
                <Paragraph
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "white",
                    textShadowColor: "rgba(0, 0, 0, 0.75)",
                    textShadowOffset: { width: -1, height: 1 },
                    textShadowRadius: 5,
                  }}
                >
                  {dateToFrenchFormat(new Date())}
                </Paragraph>
              </View>
              <List.Section
                style={{ backgroundColor: colors.secondaryLighter }}
              >
                {/* <Divider /> */}
                <List.Subheader
                  style={{
                    backgroundColor: colors.secondaryDark,
                    color: colors.secondaryLighter,
                  }}
                >
                  Étape en cours
                </List.Subheader>
                {currentStep ? (
                  <List.Item
                    title={currentStep.element.name}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        style={{
                          backgroundColor: "transparent",
                          borderRadius: 50,
                        }}
                        icon="walk"
                      />
                    )}
                    right={(props) => (
                      <>
                        <Pressable
                          onPress={() =>
                            navigation.navigate("WeatherDetails", {
                              defaultName: currentStep?.element.name,
                              lat: currentStep?.point.coordinates[1],
                              lng: currentStep?.point.coordinates[0],
                            })
                          }
                        >
                          <List.Icon
                            {...props}
                            style={{
                              backgroundColor: colors.secondaryLight,
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
                                latitude: currentStep.point.coordinates[1],
                                longitude: currentStep.point.coordinates[0],
                              },
                              "d"
                            )
                          }
                        >
                          <List.Icon {...props} icon="navigation" />
                        </Pressable>
                      </>
                    )}
                    onPress={() =>
                      navigation.navigate("StepDetails", {
                        id: currentStep.id,
                      })
                    }
                  />
                ) : (
                  <List.Item
                    title="Aucune étape en cours"
                    left={(props) => <List.Icon {...props} icon="walk" />}
                    style={{ backgroundColor: colors.secondaryLighter }}
                  />
                )}
              </List.Section>

              {nextStep && (
                <List.Section
                  style={{ backgroundColor: colors.secondaryLighter }}
                >
                  <List.Subheader
                    style={{
                      backgroundColor: colors.secondaryDark,
                      color: colors.secondaryLighter,
                    }}
                  >
                    Étape suivante
                  </List.Subheader>
                  <List.Item
                    title={nextStep.element.name}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        style={{
                          backgroundColor: "transparent",
                          borderRadius: 50,
                        }}
                        icon="walk"
                      />
                    )}
                    right={(props) => (
                      <>
                        <Pressable
                          onPress={() =>
                            navigation.navigate("WeatherDetails", {
                              defaultName: nextStep?.element.name,
                              lat: nextStep?.point.coordinates[1],
                              lng: nextStep?.point.coordinates[0],
                            })
                          }
                        >
                          <List.Icon
                            {...props}
                            style={{
                              backgroundColor: colors.secondaryLight,
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
                                latitude: nextStep.point.coordinates[1],
                                longitude: nextStep.point.coordinates[0],
                              },
                              "d"
                            )
                          }
                        >
                          <List.Icon
                            {...props}
                            style={{
                              backgroundColor: colors.secondaryLight,
                              borderRadius: 50,
                            }}
                            icon="navigation"
                          />
                        </Pressable>
                      </>
                    )}
                    onPress={() =>
                      navigation.navigate("StepDetails", {
                        id: nextStep.id,
                      })
                    }
                  />
                </List.Section>
              )}

              <List.Section style={{ backgroundColor: colors.primaryLighter }}>
                <List.Subheader
                  style={{
                    backgroundColor: colors.primaryDark,
                    color: colors.primaryLighter,
                  }}
                >
                  Points d'intérêts prévus aujourd'hui
                </List.Subheader>
                <InterestPointList
                  stepId={currentStep?.id}
                  day={currentDayOfStep}
                  disableAccordion={true}
                  navigation={navigation}
                />
              </List.Section>

              <List.Section>
                <List.Subheader
                  style={{
                    backgroundColor: colors.accentDark,
                    color: colors.accentLighter,
                  }}
                >
                  Météo
                </List.Subheader>
                <Pressable
                  onPress={() =>
                    navigation.navigate("WeatherDetails", {
                      defaultName: currentStep?.element.name,
                      lat: currentStep?.point.coordinates[1],
                      lng: currentStep?.point.coordinates[0],
                    })
                  }
                >
                  {currentStep && (
                    <SimpleWeatherCard
                      defaultName={currentStep?.element.name}
                      lat={currentStep?.point.coordinates[1]}
                      lng={currentStep?.point.coordinates[0]}
                      style={{ backgroundColor: colors.accentLighter }}
                    />
                  )}
                </Pressable>
              </List.Section>
            </>
          ) : (
            <View style={{ flex: 1, alignItems: "center" }}>
              <View style={{ width: "80%", paddingTop: 10 }}>
                {stepsIsLoading ? (
                  <Title style={{ textAlign: "center" }}>
                    Chargement en cours ...
                  </Title>
                ) : (
                  <>
                    <Title style={{ textAlign: "center" }}>
                      {`Vous êtes au jour ${
                        currentDayOfTravel || 0
                      } de votre voyage alors que celui ci ne dure que ${
                        maxDay || 0
                      } jour${
                        maxDay || (0 && maxDay) || 0 > 1 ? "s" : ""
                      }.\n\n`}
                      {user?.id === admin?.id
                        ? `Veuillez mettre à jour votre date de départ ou marquer
                      votre voyage comme terminé.`
                        : `Veuillez contacter l'administrateur de votre voyage pour qu'il modifie la date de départ ou qu'il marque celui-ci comme terminé`}
                    </Title>
                    {user?.id === admin?.id && (
                      <>
                        <Button
                          mode="outlined"
                          style={{ marginTop: 30, marginBottom: 5 }}
                          onPress={() =>
                            navigation.navigate("SettingsNavigation", {
                              screen: "UpdateTravelStartDate",
                            })
                          }
                        >
                          Modifier la date de départ
                        </Button>
                        <Button
                          mode="outlined"
                          style={{ marginVertical: 5 }}
                          onPress={() => {
                            Alert.alert(
                              "Fin du voyage",
                              "Avez-vous déjà terminé votre voyage ?",
                              [
                                {
                                  text: "Non",
                                },
                                {
                                  text: "Oui",
                                  onPress: () => {
                                    if (currentTravel) {
                                      const newTravel = currentTravel;
                                      newTravel.end_date =
                                        new Date().toISOString();

                                      currentTravel?.id &&
                                        updateTravel.mutate({
                                          route: Travel.routeName,
                                          id: currentTravel.id,
                                          body: newTravel,
                                        });
                                    }
                                  },
                                },
                              ],
                              { cancelable: false }
                            );
                          }}
                        >
                          Mettre fin à mon voyage
                        </Button>
                      </>
                    )}
                  </>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </>
  );
};
