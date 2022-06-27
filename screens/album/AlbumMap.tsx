import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { List, Switch, useTheme } from "react-native-paper";
import WebView from "react-native-webview";
import { useQuery } from "react-query";
import api from "../../api/api";
import { url_prefix } from "../../api/util";
import { Text } from "../../components/Themed";
import { Photo } from "../../model/Photo";
import { Position } from "../../model/Position";
import { useMainData } from "../../provider/MainDataProvider";

export const AlbumMap = ({
  navigation,
  setShowImageViewer,
  setCurrentImageIndex,
}: any) => {
  const { currentTravel } = useMainData();
  const { colors } = useTheme();

  const [arePositionsVisible, setArePositionsVisible] = useState(true);
  const [arePhotosVisible, setArePhotosVisible] = useState(true);

  // MapView
  let myMapRef: MapView | null = null;
  let markerIdentifiers = Array<string>();

  const {
    isLoading: photosIsLoading,
    isError: photosIsError,
    error: photosError,
    data: photos,
  } = useQuery<Photo[], Error>(["photos", currentTravel?.id], () =>
    api
      .get({ route: Photo.routeName, idTravel: currentTravel?.id })
      .then((photos) => {
        return photos.sort((a: Photo, b: Photo) => {
          if (a.updatedAt < b.updatedAt) return 1;
          if (a.updatedAt > b.updatedAt) return -1;
          return 0;
        });
      })
      .then((photosSorted) => {
        photosSorted.forEach((photo: Photo) => {
          photo.path = url_prefix + "/" + photo.path;
        });

        return photosSorted;
      })
  );

  const {
    isLoading: positionsIsLoading,
    isError: positionsIsError,
    error: positionsError,
    data: positions,
  } = useQuery<Position[], Error>(["positions", currentTravel?.id], () =>
    api.get({ route: Position.routeName, idTravel: currentTravel?.id })
  );

  const showViewer = (id: number) => {
    setCurrentImageIndex(id);
    setShowImageViewer(true);
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          ref={(ref) => (ref ? (myMapRef = ref) : null)}
        >
          {arePositionsVisible &&
            positions?.map((position, idx) => {
              position.id && markerIdentifiers.push(position.id.toString());
              return position.point ? (
                <Marker
                  identifier={position.id?.toString()}
                  key={position.id}
                  coordinate={{
                    latitude: position.point.coordinates[1],
                    longitude: position.point.coordinates[0],
                  }}
                >
                  <Image
                    source={require("../../assets/images/position_icon.png")}
                    style={{ width: 15, height: 15 }}
                  />
                </Marker>
              ) : (
                <View key={"idx_" + idx}></View>
              );
            })}
          {arePhotosVisible &&
            photos?.map((photo, idx) => {
              photo.id && markerIdentifiers.push(photo.id.toString());
              return photo.point ? (
                <Marker
                  identifier={photo.id?.toString()}
                  key={photo.id}
                  coordinate={{
                    latitude: photo.point.coordinates[1],
                    longitude: photo.point.coordinates[0],
                  }}
                  onPress={() => showViewer(idx)}
                >
                  <Image
                    source={require("../../assets/images/image_icon.png")}
                    style={{ width: 33.225, height: 27.0 }}
                  />
                </Marker>
              ) : (
                <View key={"idx_" + idx}></View>
              );
            })}
        </MapView>
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: "5%",
          }}
        >
          <View
            style={{
              position: "relative",
              backgroundColor: colors.secondaryLighter,
              borderRadius: 8,
              margin: 5,
            }}
          >
            <List.Item
              title=""
              left={() => (
                <Text
                  style={{
                    textAlignVertical: "center",
                  }}
                >
                  Photos
                </Text>
              )}
              right={() => (
                <Switch
                  color={colors.secondaryDarky}
                  value={arePhotosVisible}
                  onValueChange={() => setArePhotosVisible((old) => !old)}
                />
              )}
              onPress={() => setArePhotosVisible((old) => !old)}
              style={{ display: "flex", justifyContent: "center" }}
            />
            <List.Item
              title=""
              left={() => (
                <Text
                  style={{
                    textAlignVertical: "center",
                  }}
                >
                  Positions
                </Text>
              )}
              right={() => (
                <Switch
                  color={colors.secondaryDarky}
                  value={arePositionsVisible}
                  onValueChange={() => setArePositionsVisible((old) => !old)}
                />
              )}
              onPress={() => setArePhotosVisible((old) => !old)}
              style={{ display: "flex", justifyContent: "center" }}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
});
