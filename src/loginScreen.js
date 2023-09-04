import React, { useState } from "react";
import { Text, StyleSheet, Button, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Tutaj możesz dodać logikę logowania
    // Po zalogowaniu możesz przechodzić do innych ekranów lub wykonać inne akcje
    navigation.navigate("Home"); // Przykład przechodzenia do głównego ekranu
  };

  return (
    <Animatable.View
      animation="fadeIn"
      duration={1000}
      style={styles.container}
    >
      <Text style={styles.title}>Zaloguj się</Text>
      <TextInput
        style={styles.input}
        placeholder="Login"
        value={login}
        onChangeText={(text) => setLogin(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Hasło"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Zaloguj" onPress={handleLogin} />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default LoginScreen;
