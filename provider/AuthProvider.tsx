import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, createContext, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../api/api";
import { checkStatus, url_prefix } from "../api/util";
import { Text } from "../components/Themed";
import { Traveler } from "../model/Traveler";

export interface AuthContextProps {
  user: Traveler | null;
  signup: (credentials: any) => Promise<void>;
  signin: (credentials: any) => Promise<void>;
  signout: () => void;
}

const AuthContext = createContext<AuthContextProps>(undefined!);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      fetch(`${url_prefix}/traveler/whoami`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(checkStatus)
        .then((res) => res.json())
        .then((user) => {
          setUser(user);
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setLoading(false);
        });
    });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Checking authentication...</Text>
      </SafeAreaView>
    );
  }

  const signup = (credentials: any) => {
    const token = "";
    return fetch(`${url_prefix}/${Traveler.routeName + "/signup"}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new Traveler(credentials)),
    })
      .then((res) => {
        if (res.ok) {
          return res;
        } else {
          return res.text().then((msg: any) => {
            throw new Error(msg);
          });
        }
      })
      .then((res) => res.json())
      .catch((e) => {
        throw new Error(e.message);
      });
  };

  const signin = (credentials: any) => {
    return AsyncStorage.getItem("token")
      .then((token) => {
        return fetch(`${url_prefix}/${Traveler.routeName + "/signin"}/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        })
          .then((res) => {
            if (res.ok) {
              return res;
            } else {
              return res.text().then((msg: any) => {
                throw new Error(msg);
              });
            }
          })
          .then((res) => res.json())
          .then((data) => {
            AsyncStorage.setItem("token", data.token);
            setUser(data.user);
          })
          .catch((e) => {
            throw new Error(e.message);
          });
      })
      .catch((e) => {
        throw new Error(e.message);
      });
  };

  const signout = () => {
    AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
