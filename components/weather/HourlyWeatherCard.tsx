import React from "react";
import { View, Text, Image } from "react-native";

export const HourlyWeatherCard = ({ hourlyData }: any) => {
  const date = new Date(parseInt(hourlyData.dt) * 1000);

  return (
    <>
      <View
        style={{
          width: 100,
          backgroundColor: "#a4d4e4",
          borderRadius: 10,
          padding: 10,
          margin: 5,
          borderWidth: 1,
          borderColor: "#b4e4f4",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, color: "white" }}>
          {date.getHours()}:00
        </Text>
        <Image
          style={{ width: 80, height: 40 }}
          source={{
            uri: `http://openweathermap.org/img/wn/${hourlyData.weather[0].icon}@2x.png`,
          }}
        />
        <Text style={{ color: "white", fontSize: 25, marginTop: "3%" }}>
          {Math.round(hourlyData.temp - 273.15)}
          °C
        </Text>
      </View>
    </>
  );
};
