import React, { useEffect } from "react";
import { Text, StyleSheet, Button, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  const goToDetailsScreen = () => {
    navigation.navigate("Home"); // Przechodzi do ekranu 'Home2'
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>HomeScreen</Text>
      <Button title="Go to Home2" onPress={goToDetailsScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 30,
  },
});

export default HomeScreen;
