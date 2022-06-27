import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

// IMPORT DE NOS SCREENS
import { Button } from "react-native-paper";
import RegisterScreen from "../screens/auth/RegisterScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import { useAuth } from "../provider/AuthProvider";

const Stack = createNativeStackNavigator();

export const Auth = ({ navigation }: any) => {
  const { user } = useAuth();

  // Si un user est détecté, skip le login
  useEffect(() => {
    if (user) navigation.replace("ChooseTravel");
  }, [user]);

  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginFrame: {
    padding: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    margin: 3,
    width: 200,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    margin: 3,
    width: 200,
  },
  submitButton: {
    backgroundColor: "lightgrey",
    padding: 8,
    marginTop: 10,
  },
});

export default Auth;
