import React, { useState } from "react";
import { Text, StyleSheet, Button, TextInput, View } from "react-native";

import { useSelector, useDispatch } from "react-redux";

import userContext from "../storage/user-context";
import { userActions } from "../storage/user-context";

import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth2 } from "./firebase";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth2, login, password).then(
        (userInfo) => {
          const userId = userInfo.user.uid;
          console.log(userInfo);
          dispatch(userActions.addActualUserId({ value: userId }));
          setIsModalVisible(true); // Pokaż modal
          setModalMessage("Logowanie udane!"); // Ustaw treść modala
          setTimeout(() => {
            setIsModalVisible(false); // Ukryj modal po 2 sekundach
            navigation.navigate("Home"); // Przykład przechodzenia do głównego ekranu
          }, 2000);
        }
      );
    } catch {
      setIsModalVisible(true);
      setModalMessage("Nie udało się poprawnie zalogować");
      setTimeout(() => {
        setIsModalVisible(false); // Ukryj modal po 2 sekundach
        // navigation.navigate("Home"); // Przykład przechodzenia do głównego ekranu
      }, 2000);
    }
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

      {/* Modal */}
      {isModalVisible && (
        <Animatable.View animation="fadeIn" duration={500} style={styles.modal}>
          <Text style={styles.modalText}>{modalMessage}</Text>
        </Animatable.View>
      )}
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
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalText: {
    fontSize: 18,
    color: "white",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 5,
  },
});

export default LoginScreen;
