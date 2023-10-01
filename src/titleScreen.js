import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const TitleScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("LoginScreen");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleImagePress = () => {
    // Obsługa zdarzenia po naciśnięciu obrazka
    // Na przykład, można przejść do innej strony
    navigation.navigate("LoginScreen");
  };

  return (
    <TouchableOpacity
      onPress={handleImagePress}
      style={styles.touchableContainer} // Dodaj styl, aby zajmował cały ekran
    >
      <View style={styles.container}>
        {/* Dodaj tło zdjęcia */}
        <Image
          source={require("../img/title2.jpg")}
          style={styles.backgroundImage}
        />
        {/* Wyświetl napis na tle zdjęcia */}
        <Text style={styles.textTop}>Witaj w systemie!</Text>
        <Text style={styles.text}>
          Aby przejrzeć swoje archiwum zaloguj się
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  touchableContainer: {
    flex: 1, // Użyj flex, aby zajmować cały dostępny obszar ekranu
  },
  backgroundImage: {
    marginTop: 50,
    flex: 1, // Użyj flex, aby zdjęcie zajęło cały dostępny obszar
    resizeMode: "cover", // Dostosuj zdjęcie do wymiarów ekranu
    width: "100%", // Szerokość zdjęcia na cały ekran
    height: "100%", // Wysokość zdjęcia na cały ekran
    position: "absolute", // Pozycja absolutna, aby przysłonić inne elementy
  },
  text: {
    fontSize: 24,
    color: "black", // Zmieniamy kolor tekstu na czarny
    textAlign: "center",
    margin: 20,
    backgroundColor: "rgba(255, 255, 255, 0.65)", // Ustawiamy półprzezroczyste tło
    backdropFilter: "blur(10px)", // Rozmywamy tło o 10 pikseli (możesz dostosować wartość)
    width: "100%",
    textTransform: "uppercase",
    fontWeight: "bold",
  },

  textTop: {
    fontSize: 24,
    color: "black", // Kolor napisu na tle zdjęcia
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.65)", // Ustawiamy półprzezroczyste tło
    backdropFilter: "blur(10px)", // Rozmywamy tło o 10 pikseli (możesz dostosować wartość)
    width: "100%",
    textTransform: "uppercase",
    marginTop: 100,
    fontWeight: "bold",
  },
});

export default TitleScreen;
