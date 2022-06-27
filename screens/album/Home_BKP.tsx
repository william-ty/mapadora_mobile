import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Button, Headline, IconButton, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

export const Home = ({ navigation }) => {
  return (
    <>
      <View style={styles.pagerView}>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            width: "90%",
          }}
        >
          <View style={{ width: "100%", marginVertical: 20 }}>
            <Headline style={styles.title}>ALBUM DE VOYAGE</Headline>
            <View style={styles.pressableContainer}>
              <Pressable
                onPress={() => {
                  navigation.navigate("AddPhoto");
                }}
                style={styles.pressable}
              >
                <Icon name="camera" size={40} color="#000" />
                <Text style={styles.pressableTitle}>Ajouter des photos</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  navigation.navigate("PhotoAlbum");
                }}
                style={styles.pressable}
              >
                <Icon name="image" size={40} color="#000" />
                <Text style={styles.pressableTitle}>Afficher l'album</Text>
              </Pressable>
            </View>
          </View>
          <View style={{ width: "100%", marginVertical: 20 }}>
            <Headline style={styles.title}>JOURNAL DE BORD</Headline>
            <View style={styles.pressableContainer}>
              <Pressable
                onPress={() => {
                  navigation.navigate("AddDiaryEntry");
                }}
                style={styles.pressable}
              >
                <Icon name="pencil" size={40} color="#000" />
                <Text style={styles.pressableTitle}>Ajouter une entrée</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  navigation.navigate("Diary");
                }}
                style={styles.pressable}
              >
                <Icon name="book" size={40} color="#000" />
                <Text style={styles.pressableTitle}>Afficher le journal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  pressable: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    width: "40%",
    aspectRatio: 1,
    borderRadius: 10,
  },
  pressableContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
  },
  pressableTitle: {
    fontSize: 20,
    textAlign: "center",
  },
  pagerView: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
