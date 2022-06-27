import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export const ReadMore = (props) => {
  const text = props.children;
  const size = props?.size || 100;
  const style = props.style || {};

  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <View>
      <Text style={style}>
        {isReadMore ? text?.slice(0, size) : text}
        {text?.length > size && (
          <Text style={{ fontWeight: "bold" }} onPress={toggleReadMore}>
            {isReadMore ? "...voir plus" : " voir moins"}
          </Text>
        )}
      </Text>
    </View>
  );
};
