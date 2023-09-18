import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Gallery from "react-native-image-gallery";

import { listAll, ref, getDownloadURL } from "firebase/storage";
import { myStorage } from "./firebase";

import { useSelector, useDispatch } from "react-redux";

const ShowDocumentGallery = ({ route }) => {
  const actualUserId = useSelector((state) => state.userStatus.userId);

  const [items, setItems] = useState();
  const [imageList, setImageList] = useState([]);
  const [indicatorIsActive, setIndicatorIsActive] = useState(false);

  const getPhotos = async () => {
    const category = route.params.itemCategory;
    const itemId = route.params.itemId;
    const actualFolder = route.params.folderName;
    console.log("XD:" + route.params.itemCategory);
    console.log("XD:" + route.params.folderName);

    const actualRef = `/users/${actualUserId}/${actualFolder}/${category}/${itemId}`;
    //////////////////////////////tutaj zmiany
    console.log(actualRef);
    const storageRef = ref(myStorage, actualRef);

    listAll(storageRef)
      .then(async (res) => {
        setIndicatorIsActive(true);
        const imageUrls = await Promise.all(
          res.items.map(async (item) => {
            try {
              const url = await getDownloadURL(item);
              return {
                source: { uri: url },
                dimensions: {
                  width: 800,
                  height: 600,
                },
              };
            } catch (error) {
              console.error("Błąd pobierania URL-a obrazu:", error);
              return null; // Lub inna wartość, jeśli wystąpił błąd
            }
          })
        );

        console.log("imageUrls:", imageUrls);

        setImageList(imageUrls);
        setIndicatorIsActive(false);
      })
      .catch((err) => console.error("Błąd pobierania listy obrazów:", err));

    console.log(imageList);
  };

  useEffect(() => {
    getPhotos();
  }, []);

  useEffect(() => {
    console.log("BB:" + imageList);
  }, [imageList]);

  return (
    <View style={styles.container}>
      {indicatorIsActive ? (
        <ActivityIndicator size="large" style={styles.indicator} />
      ) : null}
      <Gallery
        style={{ flex: 1 }}
        images={imageList}
        initialPage={0} // Opcjonalnie: określ stronę startową
        resizeMode="stretch"
        // onPageSelected={onPageNext}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicator: {
    position: "absolute",
    top: 0, // Umieść indicator na górze
    bottom: 0, // Lub użyj `right` i `left` zamiast `top` i `bottom` do pozycjonowania w poziomie
    right: 0,
    left: 0,
    // backgroundColor: "rgba(0, 0, 0, 0.6)", // Przezroczyste tło
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShowDocumentGallery;
