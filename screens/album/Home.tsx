import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import {
  Button,
  Headline,
  IconButton,
  ToggleButton,
  useTheme,
} from "react-native-paper";
import { Text } from "../../components/Themed";
import { Photo as PhotoModel } from "../../model/Photo";
import { AlbumMap } from "./AlbumMap";
import { Diary } from "./Diary";
import { PhotoAlbum } from "./PhotoAlbum";
import { Timeline } from "./Timeline";
import { Photo } from "./PhotoAlbum";
import { useQuery } from "react-query";
import { useMainData } from "../../provider/MainDataProvider";
import api from "../../api/api";
import { url_prefix } from "../../api/util";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../provider/AuthProvider";

export const Home = ({ navigation }: any) => {
  const { currentTravel, admin } = useMainData();
  const { user } = useAuth();
  const { colors } = useTheme();

  const [selectedPage, setSelectedPage] = useState("album");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [images, setImages] = useState<Photo[] | undefined>([]);

  const closeViewer = () => {
    setShowImageViewer(false);
  };

  const {
    isLoading: photosIsLoading,
    isError: photosIsError,
    error: photosError,
    data: photos,
  } = useQuery<PhotoModel[], Error>(["photos", currentTravel?.id], () =>
    api
      .get({ route: PhotoModel.routeName, idTravel: currentTravel?.id })
      .then((photos) => {
        return photos.sort((a: PhotoModel, b: PhotoModel) => {
          if (a.updatedAt < b.updatedAt) return 1;
          if (a.updatedAt > b.updatedAt) return -1;
          return 0;
        });
      })
      .then((photosSorted) => {
        photosSorted.forEach((photo: PhotoModel) => {
          photo.path = url_prefix + "/" + photo.path;
        });

        return photosSorted;
      })
  );

  useEffect(() => {
    setImages(
      photos?.map((photo: any) => {
        return {
          id: photo.id,
          url: photo?.path,
        };
      })
    );
  }, [photos, setImages]);

  const display = () => {
    return showImageViewer ? { display: "none" } : {};
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {showImageViewer && (
        <ImageViewer
          imageUrls={images}
          index={currentImageIndex}
          pageAnimateTime={0}
          saveToLocalByLongPress={false}
          renderHeader={() => (
            <View
              style={{
                display: "flex",
                alignItems: "flex-end",
                position: "absolute",
                width: "100%",
                top: 0,
              }}
            >
              <Pressable
                style={{
                  backgroundColor: colors.primaryLight,
                  padding: 10,
                  width: 75,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 8,
                  margin: 10,
                  zIndex: 15,
                }}
                onPress={() => closeViewer()}
              >
                <Text
                  style={{ color: colors.primaryDarky, textAlign: "right" }}
                >
                  Fermer
                </Text>
              </Pressable>
            </View>
          )}
          enablePreload={true}
          enableSwipeDown={true}
          onCancel={() => closeViewer()}
        />
      )}
      <View
        style={{
          flex: 1,
          display: showImageViewer ? "none" : "flex",
        }}
      >
        <View
          style={{
            position: selectedPage === "map" ? "absolute" : "relative",
            zIndex: 10,
            display: "flex",
            // alignItems: 'center'
          }}
        >
          <ToggleButton.Row
            onValueChange={(page) => page && setSelectedPage(page)}
            value={selectedPage}
          >
            <ToggleButton
              icon="image-multiple"
              value="album"
              color={"white"}
              style={{
                width: "25%",
                // height: '60%',
                aspectRatio: 16 / 9,
                backgroundColor: colors.primaryMain,
                borderWidth: 2,
                borderColor: colors.primaryLighty,
                elevation: 3,
              }}
              size={35}
            />
            <ToggleButton
              icon="notebook"
              value="diary"
              color={"white"}
              style={{
                width: "25%",
                // height: '60%',
                aspectRatio: 16 / 9,
                backgroundColor: colors.primaryMain,
                borderWidth: 2,
                borderColor: colors.primaryLighty,
                elevation: 3,
              }}
              size={35}
            />
            <ToggleButton
              icon="book-open-outline"
              value="timeline"
              color={"white"}
              style={{
                width: "25%",
                // height: '60%',
                aspectRatio: 16 / 9,
                backgroundColor: colors.primaryMain,
                borderWidth: 2,
                borderColor: colors.primaryLighty,
                elevation: 3,
              }}
              size={35}
            />
            <ToggleButton
              icon="map"
              value="map"
              color={"white"}
              style={{
                width: "25%",
                // height: '60%',
                aspectRatio: 16 / 9,
                backgroundColor: colors.primaryMain,
                borderWidth: 2,
                borderColor: colors.primaryLighty,
                elevation: 3,
              }}
              size={35}
            />
          </ToggleButton.Row>
        </View>
        {user?.id === admin?.id && (
          <Button
            icon="share-variant"
            style={{
              backgroundColor: colors.background,
              zIndex: 1,
            }}
            onPress={() => {
              navigation.navigate("TabTwo", { screen: "ShareAlbum" });
            }}
          >
            Partager l'album
          </Button>
        )}

        {selectedPage === "album" && (
          <PhotoAlbum
            navigation={navigation}
            setShowImageViewer={setShowImageViewer}
            setCurrentImageIndex={setCurrentImageIndex}
          />
        )}
        {selectedPage === "diary" && <Diary navigation={navigation} />}
        {selectedPage === "timeline" && (
          <Timeline
            navigation={navigation}
            setShowImageViewer={setShowImageViewer}
            setCurrentImageIndex={setCurrentImageIndex}
          />
        )}
        {selectedPage === "map" && (
          <AlbumMap
            navigation={navigation}
            setShowImageViewer={setShowImageViewer}
            setCurrentImageIndex={setCurrentImageIndex}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
