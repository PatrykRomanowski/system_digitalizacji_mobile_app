import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { ref, get } from "firebase/database";

import { firebaseRealtime } from "./firebase";

import { useSelector } from "react-redux";

import { useNavigation } from "@react-navigation/native";

const DocumentScreen = () => {
  const actualUserId = useSelector((state) => state.userStatus.userId);

  const navigation = useNavigation();

  const [allItem, setAllItem] = useState([]);
  const [sortAllItem, setSortAllItem] = useState([]);
  const [indicatorIsActive, setIndicatorIsActive] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

  useEffect(() => {
    if (descriptionValue || categoryValue) {
      if (descriptionValue && categoryValue) {
        const sortItems = allItem.filter((item) => {
          return item.itemDescription
            .toLowerCase()
            .includes(descriptionValue.toLowerCase());
        });
        const additionalSort = sortItems.filter((item) => {
          return item.itemCategory
            .toLowerCase()
            .includes(categoryValue.toLowerCase());
        });
        setSortAllItem(additionalSort);
        return;
      }
      if (descriptionValue) {
        const sortItems = allItem.filter((item) => {
          return item.itemDescription
            .toLowerCase()
            .includes(descriptionValue.toLowerCase());
        });
        setSortAllItem(sortItems);
        return;
      }
      if (categoryValue) {
        const additionalSort = allItem.filter((item) => {
          return item.itemCategory
            .toLowerCase()
            .includes(categoryValue.toLowerCase());
        });
        setSortAllItem(additionalSort);
        return;
      }

      return;
    } else {
      setSortAllItem([]);
      return;
    }
  }, [descriptionValue, categoryValue]);

  useEffect(() => {
    const fetchData = async () => {
      setIndicatorIsActive(true);
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
        setAllItem(items);
        setIndicatorIsActive(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const getPhotos = (props) => {
    console.log("BX " + props.itemCategory);
    console.log("BX " + props.itemId);

    navigation.navigate("GalleryDocument", {
      itemCategory: props.itemCategory,
      itemId: props.itemId,
      folderName: "document",
    }); // Przechodzi do ekranu 'Home2'

    console.log("XD");
  };

  const showAllItem = allItem.map((item) => (
    <TouchableOpacity
      onPress={() => {
        getPhotos({
          itemCategory: item.itemCategory,
          itemId: item.itemId,
        });
      }}
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

  const showAllSortItem = sortAllItem.map((item) => (
    <TouchableOpacity
      onPress={() =>
        getPhotos({ itemCategory: item.itemCategory, itemId: item.itemId })
      }
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
    <ScrollView>
      <View style={styles.container}>
        {indicatorIsActive ? (
          <ActivityIndicator size="large" style={styles.indicator} />
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Wyszukaj po opisie"
          value={descriptionValue}
          onChangeText={(text) => setDescriptionValue(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Wyszukaj po kategorii"
          value={categoryValue}
          onChangeText={(text) => setCategoryValue(text)}
        />
        <Text style={styles.text}>Twoje dokumenty</Text>

        {descriptionValue || categoryValue ? showAllSortItem : showAllItem}
      </View>
    </ScrollView>
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
    marginBottom: 30,
    marginTop: 30,
    fontWeight: "bold",
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
  textSize: {
    textAlign: "center",
    fontWeight: "bold",
    color: "red",
    fontSize: 12,
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
  textDescription: {
    fontSize: 20,
    marginBottom: 20,
  },
  textCategory: { fontWeight: "bold", fontSize: 12 },
  textCategoryContainer: { marginTop: 7, fontSize: 12 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "gray",
    padding: 12,
    marginBottom: 15,
    width: "90%",
    // elevation: 13, // Dodaj efekt cienia
  },
  sizeContainer: {
    alignItems: "center",
  },
});

export default DocumentScreen;
