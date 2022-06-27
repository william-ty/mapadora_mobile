import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

// Screens
import { AddPhoto } from "../screens/album/AddPhoto";
import { Home } from "../screens/album/Home";
import { AddPhotoFromGallery } from "../screens/album/AddPhotoFromGallery";
import { PhotoAlbum } from "../screens/album/PhotoAlbum";
import { AddDiaryEntry } from "../screens/album/AddDiaryEntry";
import { Diary } from "../screens/album/Diary";
import { ShareAlbum } from "../screens/album/ShareAlbum";
import { Settings } from "../screens/settings/Settings";
import { UpdateTravelStartDate } from "../screens/settings/UpdateTravelStartDate";
import { IconButton } from "react-native-paper";

const Stack = createNativeStackNavigator();

export const SettingsNavigation = ({ navigation }: any) => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ title: "Paramètres" }}
      />
      <Stack.Screen
        name="UpdateTravelStartDate"
        component={UpdateTravelStartDate}
        options={({ navigation }: any) => ({
          title: "Édition de la date de départ",
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
      />
    </Stack.Navigator>
  );
};
