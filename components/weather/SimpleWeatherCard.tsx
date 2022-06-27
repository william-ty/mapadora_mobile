import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";

export const SimpleWeatherCard = ({ lat, lng, defaultName }: any) => {
  const [weatherData, setWeatherData] = useState<any>({});

  const getWeather = (lat: number, lng: number) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=cacd658adb0f35931e43591ebd0e95fd&lang=fr`
    )
      .then((response) => response.json())
      .then((res) => {
        setWeatherData(res);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getWeather(lat, lng);
  }, []);

  return (
    <>
      {Object.keys(weatherData).length !== 0 &&
        weatherData.weather &&
        weatherData.main && (
          <View
            style={{
              alignItems: "center",
              width: "90%",
              alignSelf: "center",
              elevation: 5,
              backgroundColor: "#a4d4e4",
              borderRadius: 10,
              padding: 10,
              marginTop: "5%",
            }}
          >
            <Text style={{ fontSize: 35, color: "#48a7c7" }}>
              {weatherData.name || defaultName}
            </Text>
            <Image
              style={{ width: 80, height: 40 }}
              source={{
                uri: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
              }}
            />
            <Text style={{ color: "white", fontSize: 20, marginTop: "3%" }}>
              {Math.round(weatherData.main.temp - 273.15)}
              °C
            </Text>
            <Text style={{ color: "white", fontSize: 22 }}>
              {weatherData.weather[0].description}
            </Text>
          </View>
        )}
    </>
  );
};
