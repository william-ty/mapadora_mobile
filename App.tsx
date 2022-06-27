import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { MainDataProvider } from "./provider/MainDataProvider";
import { AuthProvider } from "./provider/AuthProvider";
import Toast from "react-native-toast-message";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "./theme/theme";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 10000,
      },
    },
  });

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <PaperProvider theme={theme}>
              <MainDataProvider>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
                <Toast />
              </MainDataProvider>
            </PaperProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    );
  }
}
