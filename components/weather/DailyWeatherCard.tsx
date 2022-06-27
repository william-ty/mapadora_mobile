import React from "react";
import { View, Text, Image } from "react-native";

export const DailyWeatherCard = ({ dailyData }: any) => {
  const date = new Date(parseInt(dailyData.dt) * 1000);

  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
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
          {date.getDate()}/{date.getMonth() + 1}
        </Text>
        <Image
          style={{ width: 80, height: 40 }}
          source={{
            uri: `http://openweathermap.org/img/wn/${dailyData.weather[0].icon}@2x.png`,
          }}
        />
        <Text style={{ color: "white", fontSize: 25, marginTop: "3%" }}>
          {Math.round(dailyData.temp.day - 273.15)}
          °C
        </Text>
      </View>
    </>
  );
};

// Object {
//     "clouds": 1,
//     "dew_point": 276.37,
//     "dt": 1653908400,
//     "feels_like": Object {
//       "day": 289.45,
//       "eve": 290.54,
//       "morn": 279.23,
//       "night": 283.12,
//     },
//     "humidity": 39,
//     "moon_phase": 0,
//     "moonrise": 1653880800,
//     "moonset": 1653939840,
//     "pop": 0.07,
//     "pressure": 1012,
//     "sunrise": 1653881585,
//     "sunset": 1653938435,
//     "temp": Object {
//       "day": 290.63,
//       "eve": 291.5,
//       "max": 292.6,
//       "min": 279.68,
//       "morn": 280.45,
//       "night": 284.21,
//     },
//     "uvi": 4.88,
//     "weather": Array [
//       Object {
//         "description": "ciel dégagé",
//         "icon": "01d",
//         "id": 800,
//         "main": "Clear",
//       },
//     ],
//     "wind_deg": 48,
//     "wind_gust": 5.77,
//     "wind_speed": 3.32,
//   },
