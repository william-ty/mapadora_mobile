import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

// Screens
import { TravelDetails } from "../screens/planner/TravelDetails";
import { StepDetails } from "../screens/planner/StepDetails";
import { InterestPointDetails } from "../screens/planner/InterestPointDetails";
import { TripDetails } from "../screens/planner/TripDetails";
import { TravelTracking } from "../screens/planner/TravelTracking";
import { WeatherDetails } from "../screens/planner/WeatherDetails";
import { IconButton } from "react-native-paper";

const Stack = createNativeStackNavigator();

export const PlannerNavigation = ({ navigation, route }: any) => {
  const goToTravelTracking = route?.params?.goToTravelTracking;

  if (goToTravelTracking) {
    navigation.navigate("PlannerNavigation", {
      screen: "TravelTracking",
    });
  }

  return (
    <Stack.Navigator
      initialRouteName={"TravelDetails"}
      screenOptions={({ navigation }: any) => ({
        headerLeft: () => (
          <IconButton
            icon="arrow-left"
            size={30}
            onPress={() => {
              navigation.goBack();
            }}
          />
        ),
      })}
    >
      <Stack.Screen
        name="TravelTracking"
        component={TravelTracking}
        options={{ title: "Suivi" }}
      />
      <Stack.Screen
        name="WeatherDetails"
        component={WeatherDetails}
        options={{ title: "Météo" }}
      />
      <Stack.Screen
        name="TravelDetails"
        component={TravelDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StepDetails"
        component={StepDetails}
        options={{ title: "Détails d'étape" }}
      />
      <Stack.Screen
        name="InterestPointDetails"
        component={InterestPointDetails}
        options={{ title: "Détails du point d'intérêt" }}
      />
      <Stack.Screen
        name="TripDetails"
        component={TripDetails}
        options={{ title: "Détails du trajet" }}
      />
    </Stack.Navigator>
  );
};
