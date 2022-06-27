import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  useTheme,
  Headline,
  List,
  Paragraph,
  Subheading,
  Divider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import api from "../../api/api";
import {
  dateToFrenchFormat,
  getDurationUntilStep,
  getTravelStartDate,
} from "../../api/util";
import { DocumentList } from "../../components/stepper/DocumentList";
import { InterestPointList } from "../../components/stepper/InterestPointList";
import { TaskList } from "../../components/stepper/TaskList";
import { TripList } from "../../components/stepper/TripList";
import { TrackingBanner } from "../../components/TrackingBanner";
import { Step } from "../../model/Step";
import { Travel } from "../../model/Travel";
import { useMainData } from "../../provider/MainDataProvider";

export const TravelDetails = ({ navigation }: any) => {
  const { currentTravel, myTravels } = useMainData();

  const [currentScroll, setCurrentScroll] = useState<number>();

  const { data: stepData } = useQuery<Step[], Error>(
    ["steps", currentTravel?.id],
    () => api.get({ route: Step.routeName, idTravel: currentTravel?.id })
  );
  const { colors } = useTheme();

  // const image = { uri: "https://reactjs.org/logo-og.png" };
  // const image = { uri: `http://localhost:8080/${currentTravel?.path}` };
  const image = {
    uri: `https://live.staticflickr.com/65535/48749008993_b6683f4ae2_b.jpg`,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: "center",
    },
  });

  const sortedSteps = stepData?.sort((a: Step, b: Step) => a?.order - b?.order);

  let travelDuration = sortedSteps ? getDurationUntilStep(sortedSteps) : 0;
  const travelStartDate = currentTravel && getTravelStartDate(currentTravel);
  let endDate = travelStartDate && new Date(travelStartDate.getTime());
  endDate?.setDate(endDate.getDate() + travelDuration);

  const displayDate = travelStartDate
    ? dateToFrenchFormat(travelStartDate)
    : null;
  const endDisplayDate = endDate ? dateToFrenchFormat(endDate) : null;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TrackingBanner navigation={navigation} />
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
          <ScrollView
            style={{
              marginTop: 55,
              flex: 1,
              width: "100%",
              // backgroundColor: colors.secondaryLightest
              // backgroundColor: 'white'
            }}
            onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
              setCurrentScroll(e.nativeEvent.contentOffset.y)
            }
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                paddingTop: 1,
                paddingBottom: 3,
                backgroundColor: "rgba(142,163,107,0.6)",
                // marginHorizontal: 10,
                marginTop: 5,
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
                Voyage
              </Subheading>
              <Headline
                style={{
                  textTransform: "capitalize",
                  // backgroundColor: colors.primaryLighty,
                  borderRadius: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  // elevation: 2,
                  fontWeight: "bold",
                  textShadowColor: "rgba(0, 0, 0, 0.1)",
                  textShadowOffset: { width: -1, height: 1 },
                  textShadowRadius: 1,
                }}
              >
                "{currentTravel?.name}"
              </Headline>
              {displayDate && endDisplayDate && (
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
                  Du {displayDate} au {endDisplayDate}
                </Paragraph>
              )}
            </View>
            <List.Accordion
              title="Étapes"
              left={(props) => <List.Icon {...props} icon="walk" />}
              style={{ backgroundColor: colors.secondaryLighty }}
              theme={{ colors: { primary: colors.secondaryLightest } }}
            >
              <View
                style={{
                  position: "relative",
                  marginLeft: 0,
                  width: "100%",
                  paddingLeft: 0,
                  justifyContent: "center",
                  backgroundColor: colors.accentLighter,
                  borderBottomWidth: 1,
                  borderColor: colors.secondaryLight,
                }}
              >
                {sortedSteps &&
                sortedSteps.length > 0 &&
                Array.isArray(sortedSteps) /* TODO: REMOVE*/ ? (
                  <>
                    <View
                      style={{
                        position: "absolute",
                        backgroundColor: colors.accentMain,
                        marginLeft: 20,
                        width: 2,
                        paddingVertical: 10,
                        top: 25,
                        bottom: 25,
                        zIndex: 10,
                      }}
                    ></View>
                    {sortedSteps?.map((step, idx) => {
                      return (
                        <View
                          key={idx}
                          style={{
                            display: "flex",
                            paddingLeft: 0,
                            marginLeft: 0,
                            position: "relative",
                          }}
                        >
                          <List.Item
                            title={step.element?.name}
                            style={{
                              width: "100%",
                              paddingLeft: 0,
                              marginLeft: 40,
                              paddingVertical: 10,
                              backgroundColor: colors.secondaryLighter,
                              borderColor: colors.secondaryLight,
                              borderLeftWidth: 1,
                              borderBottomWidth:
                                idx === sortedSteps?.length - 1 ? 0 : 1,
                            }}
                            left={() =>
                              (
                                <View
                                  style={{
                                    justifyContent: "center",
                                    marginRight: 20,
                                  }}
                                ></View>
                              ) >
                              (
                                <View
                                  style={{
                                    width: 10,
                                    height: 10,
                                    marginLeft: -25,
                                    position: "absolute",
                                    justifyContent: "center",
                                    borderRadius: 100,
                                    backgroundColor: colors.accentMain,
                                  }}
                                ></View>
                              )
                            }
                            onPress={() =>
                              navigation.navigate("StepDetails", {
                                id: step.id,
                              })
                            }
                          />
                        </View>
                      );
                    })}
                  </>
                ) : (
                  <List.Item
                    style={{ backgroundColor: colors.secondaryLighter }}
                    title={"Aucune étape pour le moment"}
                  />
                )}
              </View>
            </List.Accordion>
            <InterestPointList navigation={navigation} />
            <TripList navigation={navigation} />
            <DocumentList elementId={null} currentScroll={currentScroll} />
            <TaskList elementId={null} currentScroll={currentScroll} />
          </ScrollView>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};
