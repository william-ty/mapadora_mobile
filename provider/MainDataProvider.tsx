import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import api from "../api/api";
import { Travel } from "../model/Travel";
import { Traveler } from "../model/Traveler";

export interface MainDataContextProps {
  currentTravel: Travel | undefined;
  setCurrentTravel: (value: Travel) => void;
  isSavePositionActive: boolean;
  changeIsSavePositionActive: (value: boolean) => void;
  myTravels: Travel[] | undefined;
  admin: Traveler | undefined;
}

const MainDataContext = createContext<MainDataContextProps>(undefined!);

export const MainDataProvider = ({ children }: any) => {
  const [currentTravel, setCurrentTravel] = useState<Travel>();
  const [admin, setAdmin] = useState<Traveler>();
  const [isSavePositionActive, setIsSavePositionActive] =
    useState<boolean>(false);

  const myTravelsQuery = useQuery<Travel[], Error>(["mytravels"], () =>
    api.get({ route: "mytravels" })
  );

  const changeIsSavePositionActive = (value: boolean) => {
    setIsSavePositionActive(value);
    AsyncStorage.setItem("isSavePositionActive", `${value}`);
  };

  useEffect(() => {
    AsyncStorage.getItem("isSavePositionActive").then((isActive) =>
      changeIsSavePositionActive(isActive === "true")
    );
  }, []);

  useEffect(() => {
    if (currentTravel?.id) {
      api
        .get({ route: `admin`, hasToken: true, idTravel: currentTravel.id })
        .then((res) => {
          setAdmin(res);
        });
    }
  }, [currentTravel]);

  return (
    <MainDataContext.Provider
      value={{
        currentTravel,
        setCurrentTravel,
        isSavePositionActive,
        changeIsSavePositionActive,
        myTravels: myTravelsQuery.data,
        admin,
      }}
    >
      {children}
    </MainDataContext.Provider>
  );
};

export const useMainData = () => useContext(MainDataContext);
