import React, { LegacyRef, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  NativeSyntheticEvent,
  NativeTouchEvent,
  TextInputFocusEventData,
  View,
} from "react-native";
import {
  Button,
  List,
  Paragraph,
  Subheading,
  Switch,
  TextInput,
  Title,
} from "react-native-paper";
import { useMutation, useQueryClient } from "react-query";
import api from "../../api/api";
import { Travel } from "../../model/Travel";
import { useAuth } from "../../provider/AuthProvider";
import { useMainData } from "../../provider/MainDataProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { dateToFrenchFormat } from "../../api/util";

export const UpdateTravelStartDate = ({ navigation, route }: any) => {
  const { currentTravel, setCurrentTravel } = useMainData();

  const [selectedDate, setSelectedDate] = useState(
    currentTravel?.start_date ? new Date(currentTravel.start_date) : new Date()
  );
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const myTextInput = useRef<any>();

  // Access the client
  const queryClient = useQueryClient();

  const updateTravel = useMutation(api.update, {
    onSuccess: (travel, { id }) => {
      queryClient.setQueryData<Travel[]>(["mytravels"], (travels) =>
        travels!.map((t) => (t.id === id ? travel : t))
      );
      Toast.show({
        type: "success",
        text1: "Succès !",
        text2: "Date de départ mise à jour",
      });
    },
  });

  const formattedDate = dateToFrenchFormat(selectedDate);

  const onSubmit = (deleteStartDate = false) => {
    let newTravel = currentTravel;
    if (newTravel && currentTravel?.id) {
      const date = selectedDate;
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      newTravel.start_date = deleteStartDate ? null : date.toISOString();
      updateTravel.mutate({
        route: Travel.routeName,
        id: currentTravel.id,
        body: newTravel,
      });
    }
  };

  return (
    <>
      <View
        style={{
          height: "100%",
          padding: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title>Voyage</Title>
        <Subheading>Édition de la date de départ</Subheading>
        <TextInput
          mode="outlined"
          label="Date de départ"
          value={formattedDate}
          defaultValue={formattedDate}
          style={{ width: "100%", maxHeight: "75%" }}
          onFocus={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            Keyboard.dismiss();
            setShowDateTimePicker(true);
            myTextInput?.current?.blur();
            e.preventDefault();
            e.stopPropagation();
          }}
          ref={myTextInput}
          autoComplete
        />
        {showDateTimePicker && (
          <DateTimePicker
            mode="date"
            value={selectedDate}
            onChange={(e: any, date: Date | undefined) => {
              setShowDateTimePicker(false);
              date && setSelectedDate(date);
            }}
            maximumDate={new Date()}
          />
        )}
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Button
            mode="contained"
            style={{ marginVertical: 5 }}
            onPress={() => {
              onSubmit(true);
            }}
          >
            Le voyage n'a pas démarré
          </Button>
          <Button
            mode="contained"
            style={{ marginVertical: 5 }}
            onPress={() => onSubmit()}
          >
            Valider
          </Button>
        </View>
      </View>
    </>
  );
};
