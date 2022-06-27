// Example of GridView using FlatList in React Native
// https://aboutreact.com/example-of-gridview-using-flatlist-in-react-native/

// import React in our code
import React, { useEffect, useState } from "react";

// import all the components we are going to use
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  Pressable,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { ActivityIndicator } from "react-native-paper";
import { Photo } from "../../screens/album/PhotoAlbum";

export const ImageGallery = ({
  images,
  setShowImageViewer,
  setCurrentImageIndex,
}: any) => {
  const showViewer = (id: number) => {
    setCurrentImageIndex(id);
    setShowImageViewer(true);
  };

  return (
    <>
      <FlatList
        data={images}
        numColumns={3} //Setting the number of column
        keyExtractor={(item: any) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexBasis: `${100 / 3}%`,
              flexDirection: "column",
              padding: "0.5%",
            }}
          >
            <Pressable onPress={() => showViewer(index)}>
              <Image style={styles.imageThumbnail} source={{ uri: item.url }} />
            </Pressable>
          </View>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 120,
  },
  pagerView: {
    flex: 1,
  },
});
