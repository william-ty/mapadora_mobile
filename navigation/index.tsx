/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import React, { useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alert, ColorSchemeName, Pressable, Text } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

//Screens
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import TabOneScreen from "../screens/TabOneScreen";
import { AlbumNavigation } from "./AlbumNavigation";
import { PlannerNavigation } from "./PlannerNavigation";
import Auth from "./AuthNavigation";
import { ChooseTravel } from "../screens/ChooseTravel";
import { PositionHandler } from "../components/PositionHandler";
import { useMainData } from "../provider/MainDataProvider";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../api/api";
import { Travel } from "../model/Travel";
import { Step } from "../model/Step";
import { SettingsNavigation } from "./SettingsNavigation";
import { useTheme, Button, IconButton } from "react-native-paper";
import { useAuth } from "../provider/AuthProvider";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DefaultTheme /*DarkTheme*/ : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen
        name="Auth"
        component={Auth}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChooseTravel"
        component={ChooseTravel}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

const BottomTabNavigator = () => {
  const { currentTravel, isSavePositionActive, admin } = useMainData();
  const { user } = useAuth();
  const colorScheme = useColorScheme();

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
    },
  });

  useEffect(() => {
    const predictedDate =
      currentTravel?.predicted_date && new Date(currentTravel?.predicted_date);
    const startDate =
      currentTravel?.start_date && new Date(currentTravel?.start_date);

    if (predictedDate && user?.id === admin?.id) {
      if (!startDate && predictedDate < new Date()) {
        Alert.alert(
          "Début du voyage",
          "Avez-vous déjà débuté votre voyage ?",
          [
            {
              text: "Non",
            },
            {
              text: "Oui",
              onPress: () => {
                const newTravel = currentTravel;
                const date = new Date();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                newTravel.start_date = date.toISOString();

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
      }
    }
  }, [currentTravel]);

  useEffect(() => {
    const predictedDate =
      currentTravel?.predicted_date && new Date(currentTravel?.predicted_date);
    const startDate =
      currentTravel?.start_date && new Date(currentTravel?.start_date);
    const endDate =
      currentTravel?.end_date && new Date(currentTravel?.end_date);

    if (predictedDate && user?.id === admin?.id) {
      if (steps && startDate && !endDate) {
        let travelDuration = 0;
        steps.forEach((step) => (travelDuration += step.duration));
        const endDate = startDate;
        endDate.setDate(endDate.getDate() + travelDuration);

        if (endDate < new Date()) {
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
                  const newTravel = currentTravel;
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
        }
      }
    }
  }, [currentTravel, steps]);

  const { colors } = useTheme();

  return (
    <>
      {isSavePositionActive && <PositionHandler />}
      <BottomTab.Navigator
        initialRouteName="PlannerNavigation"
        screenOptions={{
          tabBarActiveTintColor: colors.primaryMain,
          // tabBarActiveBackgroundColor: 'blue',
          // tabBarActiveTintColor: Colors[colorScheme].tint,
          tabBarStyle: {
            height: 60,
            paddingBottom: 6,
            paddingTop: 5,
            backgroundColor: "white",
          },
        }}
      >
        <BottomTab.Screen
          name="PlannerNavigation"
          component={PlannerNavigation}
          options={{
            headerShown: false,
            title: "Planner",
            tabBarLabel: ({ color }) => (
              <Text style={{ color: color, fontSize: 12 }}>Planning</Text>
            ),
            tabBarLabelStyle: {
              color: colors.primaryDark,
            },
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          }}
        />
        <BottomTab.Screen
          name="TabOne"
          component={TabOneScreen}
          options={({ navigation }: RootTabScreenProps<"TabOne">) => ({
            headerShown: false,
            title: "Carte",
            tabBarLabelStyle: {
              color: colors.primaryDark,
            },
            tabBarLabel: ({ color }) => (
              <Text style={{ color: color, fontSize: 12 }}>Carte</Text>
            ),
            tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
          })}
        />
        <BottomTab.Screen
          name="TabTwo"
          component={AlbumNavigation}
          options={({ navigation }: RootTabScreenProps<"TabTwo">) => ({
            headerShown: false,
            title: "Album de voyage",
            tabBarLabelStyle: {
              color: colors.primaryDark,
            },
            tabBarLabel: ({ color }) => (
              <Text style={{ color: color, fontSize: 12 }}>Album</Text>
            ),
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="photo" color={color} />
            ),
          })}
        />
        <BottomTab.Screen
          name="SettingsNavigation"
          component={SettingsNavigation}
          options={{
            headerShown: false,
            title: "Paramètres",
            tabBarLabelStyle: {
              color: colors.primaryDark,
            },
            tabBarLabel: ({ color }) => (
              <Text style={{ color: color, fontSize: 12 }}>Paramètres</Text>
            ),
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </BottomTab.Navigator>
    </>
  );
};

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

// function TabBarLabel(props: {
//   name: React.ComponentProps<typeof Text>;
//   color: string;
// }) {
//   return <Text style={{ color: props.color }}></Text>;
// }
