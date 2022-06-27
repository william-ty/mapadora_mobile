import { useCallback, useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, TextInput } from "react-native";
import MapView, { Callout, LatLng, Marker, Polyline } from "react-native-maps";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import api from "../api/api";
import { InterestPoint } from "../model/InterestPoint";
import { useQuery } from "react-query";
import { Step } from "../model/Step";
import { useMainData } from "../provider/MainDataProvider";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme, Subheading, Title } from "react-native-paper";
import { TrackingBanner } from "../components/TrackingBanner";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabOneScreen({ navigation, route }: any) {
  const { currentTravel } = useMainData();
  const { colors } = useTheme();

  const coordinates = route.params?.coordinates; // Element to show

  const [location, setLocation] = useState<LocationObject>();
  const [region, setRegion] = useState({
    latitude: 48.5303007,
    longitude: 7.7357668,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // MapView
  let myMapRef: MapView | null = null;
  let markerIdentifiers = Array<string>();

  const interestpointQuery = useQuery<InterestPoint[], Error>(
    ["interestpoints", currentTravel?.id],
    () =>
      api.get({ route: InterestPoint.routeName, idTravel: currentTravel?.id })
  );

  const stepQuery = useQuery<Step[], Error>(["steps", currentTravel?.id], () =>
    api.get({ route: Step.routeName, idTravel: currentTravel?.id })
  );

  const compareOrder = (a: Step, b: Step) => {
    return a.order - b.order;
  };

  const sortedSteps = stepQuery.data?.sort(compareOrder);

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
      let location = await Location.getCurrentPositionAsync({});

      setLocation(location);

      if (location) {
        setRegion({
          latitude: location.coords.latitude,
          latitudeDelta: 0.05, // 0.01
          longitude: location.coords.longitude,
          longitudeDelta: 0.05, // 0.01
        });
      } else {
        setTimeout(() => {
          myMapRef?.fitToSuppliedMarkers(markerIdentifiers, {
            animated: false,
          });
        }, 50);
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      coordinates &&
        setRegion({
          latitude: coordinates[1],
          longitude: coordinates[0],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
    }, [coordinates])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TrackingBanner navigation={navigation} />
        <MapView
          ref={(ref) => (ref ? (myMapRef = ref) : null)}
          region={region}
          showsUserLocation
          style={styles.map}
        >
          {Array.isArray(interestpointQuery?.data) &&
            interestpointQuery?.data?.map((interestpoint) => {
              interestpoint.id &&
                markerIdentifiers.push(interestpoint.id.toString());
              return (
                <Marker
                  title={interestpoint.element?.name}
                  description={interestpoint.element?.description}
                  identifier={interestpoint.element?.id?.toString()}
                  key={interestpoint.id}
                  coordinate={{
                    latitude: interestpoint.point?.coordinates[1],
                    longitude: interestpoint.point?.coordinates[0],
                  }}
                  pinColor={colors.primaryDarky}
                >
                  {/* Custom callout */}
                  <Callout
                    onPress={() => {
                      navigation.navigate("PlannerNavigation", {
                        screen: "InterestPointDetails",
                        params: { id: interestpoint.id },
                      });
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>
                        {interestpoint.element?.name}
                      </Text>
                      <Text>{interestpoint.element?.description}</Text>
                      <Text
                        style={{
                          color: colors.primaryMain,
                          textTransform: "uppercase",
                        }}
                      >
                        Plus d'informations
                      </Text>
                    </View>
                  </Callout>
                </Marker>
                // navigation.navigate("PlannerNavigation", {
                //   screen: "InterestPointDetails",
                //   params: { id: 4 },
                // })
              );
            })}

          {Array.isArray(stepQuery?.data) &&
            stepQuery?.data?.map((step, idx) => {
              step.element?.id &&
                markerIdentifiers.push(step.element.id.toString());
              return (
                <Marker
                  title={step.element?.name}
                  description={step.element?.description}
                  identifier={step.id?.toString()}
                  key={step.id}
                  coordinate={{
                    latitude: step.point?.coordinates[1],
                    longitude: step.point?.coordinates[0],
                  }}
                  pinColor={colors.secondaryDarky}
                >
                  {/* Custom callout */}
                  <Callout
                    onPress={() => {
                      navigation.navigate("PlannerNavigation", {
                        screen: "StepDetails",
                        params: { id: step.id },
                      });
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>
                        {step.element?.name}
                      </Text>
                      <Text>{step.element?.description}</Text>
                      <Text
                        style={{
                          color: colors.secondaryMain,
                          textTransform: "uppercase",
                        }}
                      >
                        Plus d'informations
                      </Text>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          {/* Draw polylines (trips) */}
          {Array.isArray(sortedSteps) &&
            sortedSteps?.map((step, idx) => {
              return (
                idx > 0 &&
                idx < sortedSteps.length && (
                  <Polyline
                    key={idx}
                    coordinates={[
                      {
                        latitude: sortedSteps[idx - 1].point?.coordinates[1],
                        longitude: sortedSteps[idx - 1].point?.coordinates[0],
                      },
                      {
                        latitude: step.point?.coordinates[1],
                        longitude: step.point?.coordinates[0],
                      },
                    ]}
                    strokeColor={colors.accentMain}
                    strokeWidth={5}
                    tappable
                    onPress={() => {
                      navigation.navigate("PlannerNavigation", {
                        screen: "TripDetails",
                        params: { id: step.id },
                      });
                    }}
                  ></Polyline>
                )
              );
            })}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
    marginTop: 100,
  },
  textInput: {
    width: "32%",
    borderWidth: 1,
    borderColor: "grey",
  },
  submitButton: {
    backgroundColor: "#6558f5",
    color: "white",
    width: "23%",
  },
});
