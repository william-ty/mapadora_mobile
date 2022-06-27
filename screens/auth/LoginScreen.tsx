import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme, Button, IconButton, TextInput } from "react-native-paper";
import { useAuth } from "../../provider/AuthProvider";
// const image = { uri: `https://live.staticflickr.com/65535/48749008993_b6683f4ae2_b.jpg` };
const image = { uri: "../assets/images/pexels-quang-nguyen-vinh-2132126.jpg" };

const messages = {
  needEmail: "Veuillez renseigner une adresse mail",
  needPassword: "Veuillez entrer un mot de passe",
  noUserFound: "Cette adresse mail n'est attribuée à aucun compte ShareLoc",
  invalidEmail: "Adresse mail incorrecte",
  invalidPassword: "Mot de passe incorrect",
};

const LoginScreen = ({ navigation }: any) => {
  const { signin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    main: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    loginFrame: {
      padding: 10,
      backgroundColor: colors.secondaryLight,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      paddingTop: 20,
      paddingBottom: 30,
      paddingHorizontal: 20,
      elevation: 5,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 10,
      marginBottom: 5,
    },
    input: {
      marginVertical: 6,
      marginHorizontal: 3,
      width: 200,
      height: 55,
      backgroundColor: colors.secondaryLightest,
      // borderRadius: 6,
    },
    errorMessage: {
      color: "red",
      textAlign: "center",
      margin: 3,
      width: 200,
    },
    submitButton: {
      marginTop: 10,
      backgroundColor: colors.secondaryMain,
    },
    registerLink: {
      marginTop: 10,
      textAlign: "center",
      margin: 3,
      width: 200,
      alignItems: "center",
      display: "flex",
    },
  });

  return (
    <View style={styles.main}>
      <ImageBackground
        source={require("../../assets/images/pexels-quang-nguyen-vinh-2132126.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.loginFrame}>
          <View
            style={{ backgroundColor: colors.secondaryDarky, borderRadius: 50 }}
          >
            <IconButton color="white" icon={"lock"} />
          </View>
          <Text style={styles.title}>Connexion</Text>
          <TextInput
            theme={{ roundness: 5 }}
            autoComplete
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Identifiant"
            underlineColor={colors.secondaryLight}
            activeUnderlineColor={colors.secondaryMain}
          />
          <TextInput
            theme={{ roundness: 5 }}
            autoComplete
            secureTextEntry={true}
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Mot de passe"
            underlineColor={colors.secondaryLight}
            activeUnderlineColor={colors.secondaryMain}
          />
          {error !== "" ? (
            <Text style={styles.errorMessage}>{error}</Text>
          ) : null}
          {/* <Button
          style={styles.submitButton}
          mode="contained"
          
          onPress={() =>
            signin({ email, password }).then(() =>
              navigation.replace("ChooseTravel")
            )
          }
        >
          Connexion
        </Button> */}
          <Pressable
            style={{
              backgroundColor: colors.secondaryMain,
              width: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderRadius: 4,
              marginTop: 5,
              height: 50,
              elevation: 4,
            }}
            onPress={() => {
              signin({ email, password })
                .then(() => navigation.replace("ChooseTravel"))
                .catch((e) => {
                  const jsonError = JSON.parse(e?.message.toString() || "");
                  setError(jsonError?.message);
                });
            }}
          >
            <Text style={{ color: "white", fontSize: 15 }}>Connexion</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("RegisterScreen")}
            style={styles.registerLink}
          >
            <Text>Vous êtes nouveau ?</Text>
            <Text style={{ textDecorationLine: "underline" }}>
              Créez un compte !
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
