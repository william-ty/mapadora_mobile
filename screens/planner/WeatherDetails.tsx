import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { DailyWeatherCard } from "../../components/weather/DailyWeatherCard";
import { HourlyWeatherCard } from "../../components/weather/HourlyWeatherCard";

export const WeatherDetails = ({ route }: any) => {
  const [weatherData, setWeatherData] = useState<any>({});

  const defaultName = route.params?.defaultName;
  const lat = route.params?.lat;
  const lng = route.params?.lng;

  const getWeather = (lat: number, lng: number) => {
    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely,alerts&appid=cacd658adb0f35931e43591ebd0e95fd&lang=fr`
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
      <ScrollView>
        {Object.keys(weatherData).length !== 0 && weatherData.current && (
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
                uri: `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`,
              }}
            />
            <Text style={{ color: "white", fontSize: 20, marginTop: "3%" }}>
              {Math.round(weatherData.current.temp - 273.15)}
              °C
            </Text>
            <Text style={{ color: "white", fontSize: 22 }}>
              {weatherData.current.weather[0].description}
            </Text>
            <ScrollView horizontal>
              {weatherData.hourly?.map((hourly: any, idx: number) => {
                return (
                  idx < 24 && (
                    <HourlyWeatherCard key={idx} hourlyData={hourly} />
                  )
                );
              })}
            </ScrollView>
            {weatherData.daily?.map((daily: any, idx: number) => {
              return (
                idx < 24 && <DailyWeatherCard key={idx} dailyData={daily} />
              );
            })}
          </View>
        )}
      </ScrollView>
    </>
  );
};
