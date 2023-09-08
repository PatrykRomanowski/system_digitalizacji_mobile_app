import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ref, get } from "firebase/database";

import { firebaseRealtime } from "./firebase";

import { useSelector } from "react-redux";

const DocumentScreen = () => {
  const actualUserId = useSelector((state) => state.userStatus.userId);

  const [allCategory, setAllCategory] = useState([]);
  const [allItem, setAllItem] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getCategoryRef = ref(
          firebaseRealtime,
          `/users/${actualUserId}/document`
        );
        const snapshot = await get(getCategoryRef);
        const data = snapshot.val();

        const categories = [];
        const items = [];

        for (const categoryKey in data) {
          const category = data[categoryKey];
          categories.push(categoryKey);

          for (const itemKey in category) {
            const item = category[itemKey];
            items.push({
              itemId: itemKey,
              itemDescription: item.description,
              itemSize: item.size.reduce((acc, current) => acc + current),
              itemCategory: categoryKey,
            });
          }
        }
        setAllCategory(categories);
        setAllItem(items);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const getPhotos = () => {
    console.log("XD");
  };

  const showAllItem = allItem.map((item) => (
    <TouchableOpacity
      onPress={getPhotos}
      style={styles.itemContainer}
      key={item.itemId}
    >
      <View>
        <Text style={styles.textDescription}>{item.itemDescription}</Text>
        <View>
          <Text style={styles.textCategoryContainer}>Kategoria:</Text>
          <Text style={styles.textCategory}>{item.itemCategory}</Text>
        </View>
      </View>
      <View style={styles.sizeContainer}>
        <Text>Rozmiar: </Text>
        <Text style={styles.textSize}> {item.itemSize.toFixed(3)} MB</Text>
      </View>
    </TouchableOpacity>
  ));

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Document Screen</Text>
      {showAllItem}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
  textSize: {
    textAlign: "center",
    fontWeight: "bold",
    color: "red",
  },
  textDescription: {
    fontSize: 26,
  },
  textCategory: { fontWeight: "bold" },
  textCategoryContainer: { marginTop: 10 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "gray",
    padding: 16,
    marginBottom: 15,
    width: "90%",
    // elevation: 13, // Dodaj efekt cienia
  },
  sizeContainer: {
    alignItems: "center",
  },
});

export default DocumentScreen;
