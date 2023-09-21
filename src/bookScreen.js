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
} from "react-native";
import { ref, get } from "firebase/database";
import { useSelector } from "react-redux";

import { firebaseRealtime } from "./firebase";
import { listAll, ref as refStorage, getDownloadURL } from "firebase/storage";

import { myStorage } from "./firebase";

const BookScreen = () => {
  const userId = useSelector((state) => state.userStatus.userId);

  const [allBooks, setAllBooks] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [authorValue, setAuthorValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [refreshing, setRefreshing] = useState(true);
  const [indicatorIsActive, setIndicatorIsActive] = useState(true);
  const [sortAllItem, setSortAllItem] = useState([]);

  const onRefresh = () => {
    console.log("XD");
    setRefreshing(false);
  };

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
              });
            } catch (error) {
              console.log("Błąd podczas pobierania URL obrazka:", error);
            }
          } else {
            console.log("w folderze nie ma plików");
          }
        }

        setAllBooks(books);
        console.log(data);
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
      // console.log(book);
      return (
        <TouchableOpacity style={styles.itemContainer}>
          <Text>{book.bookAuthor}</Text>
          <Image style={styles.image} source={{ uri: book.bookImage }} />
        </TouchableOpacity>
      );
    });
    setAllItems(showAllBooks);
    setIndicatorIsActive(false);
  }, [allBooks]);

  useEffect(() => {
    console.log("XD2");
  }, [sortAllItem]);

  useEffect(() => {
    if (authorValue || titleValue) {
      if (authorValue && titleValue) {
        const sortItems = allItems.filter((item) => {
          return item.bookTitle
            .toLowerCase()
            .includes(titleValue.toLowerCase());
        });
        setSortAllItem(sortItems);
      }
    }
  }, [authorValue, titleValue]);

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
      {indicatorIsActive ? (
        <ActivityIndicator size="large" style={styles.indicator} />
      ) : null}

      <View style={styles.allItem}>
        {allItems}
        {allItems}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  itemContainer: {
    margin: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
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
    width: 150, // dostosuj szerokość i wysokość obrazu do swoich potrzeb
    height: 225,
  },
  allItem: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
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
});

export default BookScreen;
