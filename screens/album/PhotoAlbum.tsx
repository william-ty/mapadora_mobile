import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, FAB, Headline, Subheading, Title } from "react-native-paper";
import { useQuery } from "react-query";
import api from "../../api/api";
import { url_prefix } from "../../api/util";
import { ImageGallery } from "../../components/album/ImageGallery";
import { Photo as PhotoModel } from "../../model/Photo";
import { useMainData } from "../../provider/MainDataProvider";

export interface Photo {
  id: number;
  url: string;
}

export const PhotoAlbum = ({
  navigation,
  setShowImageViewer,
  setCurrentImageIndex,
}: any) => {
  const { currentTravel } = useMainData();

  const [images, setImages] = useState<Photo[] | undefined>([]);

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

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    fab: {
      position: "absolute",
      margin: 20,
      bottom: 0,
      borderRadius: 8,
      backgroundColor: colors.primaryMain,
    },
  });

  return (
    <>
      {images && images?.length > 0 ? (
        <ImageGallery
          images={images}
          setShowImageViewer={setShowImageViewer}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      ) : (
        <View style={{ flex: 1, alignItems: "center" }}>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            <Headline>ALBUM PHOTO</Headline>
          </View>
          <Title style={{ textAlign: "center", width: "90%", marginTop: 20 }}>
            {photosIsLoading ||
            (photos && photos?.length > 0 && (!images || images?.length < 1))
              ? "Chargement en cours..."
              : photos &&
                photos?.length < 1 &&
                "Oups, il n'y a aucunes images à afficher. \n\n Ajoutez en dès maintenant !"}
          </Title>
        </View>
      )}
      <View style={{ display: "flex", alignItems: "center" }}>
        <FAB
          style={styles.fab}
          small
          label="AJOUTER DES IMAGES"
          icon="plus"
          onPress={() => navigation.navigate("AddPhoto")}
        />
      </View>
    </>
  );
};
