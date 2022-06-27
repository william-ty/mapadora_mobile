import React, { useRef, useState, useEffect } from "react";
import { AppState, AppStateStatus, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import api from "../api/api";
import { Position } from "../model/Position";
import { useMainData } from "../provider/MainDataProvider";
import { Point } from "../model/Point";

export const PositionHandler = () => {
  const { currentTravel } = useMainData();
  const [location, setLocation] = useState<LocationObject>();

  const getPosition = async () => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({});

      setLocation(location);
    })();
  };

  const onAppStateChange = (appState: AppStateStatus) => {
    if (appState === "active") {
      getPosition();
    }
  };

  useEffect(() => {
    getPosition(); // Get position on first load

    AppState.addEventListener("change", onAppStateChange);

    return () => AppState.removeEventListener("change", onAppStateChange);
  }, []);

  useEffect(() => {
    const lng = location?.coords.longitude;
    const lat = location?.coords.latitude;

    if (lng && lat) {
      const point = new Point({
        type: "Point",
        coordinates: [lng, lat],
      });
      const position = new Position({ point: point });

      api.create({
        route: Position.routeName,
        body: position,
        idTravel: currentTravel?.id,
      });
    }
  }, [location]);

  return <></>;
};
