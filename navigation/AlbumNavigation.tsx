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
import { IconButton } from "react-native-paper";

const Stack = createNativeStackNavigator();

export const AlbumNavigation = ({ navigation }: any) => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
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
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPhoto"
        component={AddPhoto}
        options={{ title: "Ajout de photo" }}
      />
      <Stack.Screen
        name="AddPhotoFromGallery"
        component={AddPhotoFromGallery}
        options={{ title: "Ajout depuis la gallerie" }}
      />
      <Stack.Screen
        name="AddDiaryEntry"
        component={AddDiaryEntry}
        options={{ title: "Rédaction dans le journal" }}
      />
      <Stack.Screen
        name="ShareAlbum"
        component={ShareAlbum}
        options={{ title: "Partage de l'album" }}
      />
    </Stack.Navigator>
  );
};
