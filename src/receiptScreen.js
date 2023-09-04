import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { testActions } from "../storage/test-context";

const ReceiptScreen = () => {
  const actualNumber = useSelector((state) => state.testStatus.testData2);
  const dispatch = useDispatch();

  const addNumber = () => {
    dispatch(testActions.addValue());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        To jest mój komponent ReceiptScreen w React Native!
      </Text>
      <Button title="Dodaj liczbę" onPress={addNumber}></Button>
      <Text>{actualNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ReceiptScreen;
