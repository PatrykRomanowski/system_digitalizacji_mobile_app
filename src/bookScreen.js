import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { ref, get } from "firebase/database";
import { useSelector } from "react-redux";

import { useNavigation } from "@react-navigation/native";

import { firebaseRealtime } from "./firebase";
import { listAll, ref as refStorage, getDownloadURL } from "firebase/storage";

import { myStorage } from "./firebase";

const BookScreen = () => {
  const userId = useSelector((state) => state.userStatus.userId);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [allBooks, setAllBooks] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [authorValue, setAuthorValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [refreshing, setRefreshing] = useState(true);
  const [indicatorIsActive, setIndicatorIsActive] = useState(true);
  const [sortAllItem, setSortAllItem] = useState([]);
  const [actualBook, setActualBook] = useState();
  const [bookLength, setBookLength] = useState(0);
  const [inputError, setInputError] = useState(null);

  const navigation = useNavigation();

  const openModal = (book) => {
    console.log(book.book.bookLegth);
    setBookLength(book.book.bookLegth);
    setActualBook(book);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const onRefresh = () => {
    setRefreshing(false);
  };

  const goToBookGallery = () => {
    let bookLengthSet = 0;

    if (inputValue === "") {
      bookLengthSet = 0;
      setInputError(null);
    } else if (inputValue > bookLength || inputValue < 1) {
      return;
    } else {
      bookLengthSet = inputValue;
    }

    setIsModalVisible(false);
    navigation.navigate("BookGallery", {
      xd: actualBook,
      bookLengthProp: bookLengthSet,
      allSiteInBook: bookLength,
    });
  };

  useEffect(() => {
    if (inputValue > bookLength) {
      setInputError(
        <Text style={styles.errorText}>książka nie ma tylu stron</Text>
      );
    } else if (inputValue <= bookLength || inputValue > 0) {
      setInputError(null);
    }
  }, [inputValue]);

  useEffect(() => {
    setIndicatorIsActive(true);
    const fetchData = async () => {
      try {
        const getBooksRef = ref(firebaseRealtime, `/users/${userId}/books`);
        const snapshot = await get(getBooksRef);
        const data = snapshot.val();

        const books = [];

        for (const bookKey in data) {
          const book = data[bookKey];

          const getStorageRef = refStorage(
            myStorage,
            `/users/${userId}/books/${bookKey}`
          );

          const res = await listAll(getStorageRef);
          if (res.items.length > 0) {
            const firstFileRef = res.items[0];

            try {
              const url = await getDownloadURL(firstFileRef);

              books.push({
                itemId: bookKey,
                bookAuthor: book.author,
                bookTitle: book.title,
                bookDescription: book.description,
                bookSize: book.size.reduce((acc, current) => acc + current),
                bookImage: url,
                bookLegth: res.items.length,
              });
            } catch (error) {
              console.log("Błąd podczas pobierania URL obrazka:", error);
            }
          } else {
            console.log("w folderze nie ma plików");
          }
        }

        setAllBooks(books);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    setIndicatorIsActive(false);
  }, [userId]);

  useEffect(() => {
    setIndicatorIsActive(true);

    const showAllBooks = allBooks.map((book) => {
      return (
        <TouchableOpacity
          onPress={() => openModal({ book })}
          style={[styles.itemContainer, styles.card, styles.elevation]}
        >
          <Text style={styles.textAuthorAndTitle}>{book.bookAuthor}</Text>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={{ uri: book.bookImage }}
          />
          <Text style={styles.textAuthorAndTitle}>{book.bookTitle}</Text>
        </TouchableOpacity>
      );
    });
    setAllItems(showAllBooks);
    setIndicatorIsActive(false);
  }, [allBooks]);

  useEffect(() => {
    if (authorValue || titleValue) {
      if (authorValue && titleValue) {
        const sortItems = allBooks.filter((item) => {
          const newItem = item.bookTitle && item.bookTitle.toLowerCase();
          return newItem && newItem.includes(titleValue.toLowerCase());
        });
        const additionalSort = sortItems.filter((item) => {
          const newItem = item.bookAuthor && item.bookAuthor.toLowerCase();
          return newItem && newItem.includes(authorValue.toLowerCase());
        });
        console.log("XD" + sortItems);
        setSortAllItem(additionalSort);
      }
    }
    if (authorValue && titleValue === "") {
      console.log("DDD");
      const sortItems = allBooks.filter((item) => {
        const newItem = item.bookAuthor && item.bookAuthor.toLowerCase();
        return newItem && newItem.includes(authorValue.toLowerCase());
      });
      setSortAllItem(sortItems);
    }
    if (authorValue === "" && titleValue) {
      console.log("DDD");
      const sortItems = allBooks.filter((item) => {
        const newItem = item.bookTitle && item.bookTitle.toLowerCase();
        return newItem && newItem.includes(titleValue.toLowerCase());
      });
      setSortAllItem(sortItems);
    }

    if (authorValue === "" && titleValue === "") {
      setSortAllItem(allBooks);
    }
  }, [authorValue, titleValue]);

  useEffect(() => {
    setIndicatorIsActive(true);
    const showAllSortBooks = sortAllItem.map((book) => {
      return (
        <TouchableOpacity
          onPress={() => openModal({ book })}
          style={styles.itemContainer}
        >
          <Text>{book.bookAuthor}</Text>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={{ uri: book.bookImage }}
          />
        </TouchableOpacity>
      );
    });
    setAllItems(showAllSortBooks);
    setIndicatorIsActive(false);
  }, [sortAllItem]);

  return (
    <ScrollView
      scrollEventThrottle={120}
      style={styles.container}
      onScroll={(event) => {
        // Aktywuj odświeżanie, gdy użytkownik przewinie na górę
        if (event.nativeEvent.contentOffset.y <= 0) {
          onRefresh();
        }
      }}
    >
      {indicatorIsActive ? (
        <ActivityIndicator size="large" style={styles.indicator} />
      ) : null}
      <RefreshControl
        refreshing={refreshing} // Stan, który kontroluje, czy odświeżanie jest aktywowane
        onRefresh={onRefresh} // Funkcja, która ma być wywołana podczas odświeżania
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Wyszukaj po tytule"
          value={titleValue}
          onChangeText={(text) => setTitleValue(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Wyszukaj po autorze"
          value={authorValue}
          onChangeText={(text) => setAuthorValue(text)}
        />
      </View>

      <Text style={styles.text}>Twoje książki</Text>

      <View style={styles.allItem}>{allItems}</View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalButtonExit}
              onPress={closeModal}
            >
              <Text style={{ color: "white" }}>X</Text>
            </TouchableOpacity>
            <Text style={styles.textModal}>Wpisz numer strony</Text>

            <TextInput
              placeholder=""
              keyboardType="numeric"
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
              style={styles.inputModal}
            />
            {inputError}
            <TouchableOpacity
              style={styles.modalButtonNext}
              onPress={() => goToBookGallery()}
            >
              <Text style={styles.buttonText}>Przejdź do strony</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonNext}
              onPress={() => goToBookGallery()}
            >
              <Text style={styles.buttonText}>Zacznij od początku</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  buttonText: {
    color: "white",
    textTransform: "uppercase",
  },
  itemContainer: {
    margin: 5,
    width: "40%",
    borderWidth: 1, // Grubość obramowania
    borderColor: "gray", // Kolor obramowania
    borderRadius: 5, // Zaokrąglenie narożników
    // elevation: 5, // Dla Android
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 15,
  },
  elevation: {
    elevation: 11,
    shadowColor: "#111111",
  },

  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  textAuthorAndTitle: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 10,
    marginTop: 5,
    textTransform: "uppercase",
    overflow: "hidden", // Obcinaj tekst, który wystaje poza obszar
    whiteSpace: "nowrap", // Zapobiegaj zawijaniu tekstu
    textOverflow: "ellipsis", // Dodaj "..." na końcu przyciętego tekstu
    fontWeight: "bold",
  },

  modalButtonNext: {
    margin: 12,
    backgroundColor: "#007AFF", // Dostosuj kolor tła
    color: "white",
    width: "80%",
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  textModal: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // dostosuj szerokość i wysokość obrazu do swoich potrzeb
    height: 225,
  },
  allItem: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  modalButtonExit: {
    width: 30,
    height: 30,
    backgroundColor: "#007AFF", // Dostosuj kolor tła
    borderRadius: 4, // Zaokrąglony kształt przycisku
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 10,
    color: "black",
  },
  input: {
    width: 300,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    // marginBottom: 40,
    paddingLeft: 10,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Przezroczyste tło
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    borderRadius: 10,
    alignItems: "center",
  },
  inputModal: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 30,
  },
  indicator: {
    position: "absolute",
    top: 0, // Umieść indicator na górze
    bottom: 0, // Lub użyj `right` i `left` zamiast `top` i `bottom` do pozycjonowania w poziomie
    right: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Przezroczyste tło
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default BookScreen;
