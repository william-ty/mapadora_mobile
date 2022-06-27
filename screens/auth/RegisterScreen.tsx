import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme, Button, TextInput, IconButton } from "react-native-paper";
import { useAuth } from "../../provider/AuthProvider";

const RegisterScreen = ({ navigation }: any) => {
  const { signup } = useAuth();

  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { colors } = useTheme();

  // Récupération de l'utilisateur qui essaye de se connecter
  let createUser = () => {
    return signup({ email: login, password, firstname, lastname })
      .then(() => navigation.navigate("LoginScreen"))
      .catch((e) => {
        const jsonError = JSON.parse(e?.message.toString() || "");
        setError(jsonError.toString());
      });
  };

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
    },
    loginLink: {
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
        source={require("../../assets/images/pexels-quang-nguyen-vinh-2178175.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.loginFrame}>
          <View
            style={{ backgroundColor: colors.secondaryDarky, borderRadius: 50 }}
          >
            <IconButton color="white" icon={"account"} />
          </View>
          <Text style={styles.title}>Inscription</Text>
          <TextInput
            theme={{ roundness: 5 }}
            autoComplete
            style={styles.input}
            onChangeText={setLastname}
            value={lastname}
            placeholder="Nom"
            underlineColor={colors.secondaryLight}
            activeUnderlineColor={colors.secondaryMain}
          />
          <TextInput
            theme={{ roundness: 5 }}
            autoComplete
            style={styles.input}
            onChangeText={setFirstname}
            value={firstname}
            placeholder="Prénom"
            underlineColor={colors.secondaryLight}
            activeUnderlineColor={colors.secondaryMain}
          />
          <TextInput
            theme={{ roundness: 5 }}
            autoComplete
            style={styles.input}
            onChangeText={setLogin}
            value={login}
            placeholder="Email"
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
            onPress={() => createUser()}
          >
            Créer mon compte
          </Button>
          <Text
            onPress={() => navigation.navigate("LoginScreen")}
            style={styles.loginLink}
          >
            Déjà un compte ? Connectez-vous !
          </Text> */}
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
            onPress={() => createUser()}
          >
            <Text style={{ color: "white", fontSize: 15 }}>
              Créer mon compte
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("LoginScreen")}
            style={styles.loginLink}
          >
            <Text>Déjà un compte ?</Text>
            <Text style={{ textDecorationLine: "underline" }}>
              Connectez-vous !
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

export default RegisterScreen;
