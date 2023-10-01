import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { listAll, ref, getDownloadURL } from "firebase/storage";
import { myStorage } from "./firebase";
import { useSelector } from "react-redux";

const ShowBookGallery = ({ route }) => {
  const actualUserId = useSelector((state) => state.userStatus.userId);
  const [imageList, setImageList] = useState([]);
  const [indicatorIsActive, setIndicatorIsActive] = useState(false);
  const [bookActualSite, setBookActualSite] = useState(0);
  const [allUrls, setAllUrls] = useState();
  const [actualPhotoIndexInGallery, setActualPhotoIndexInGallery] = useState(1);

  const bookData = route.params.xd.book;
  const actualRef = `/users/${actualUserId}/books/${bookData.itemId}`;
  const storageRef = ref(myStorage, actualRef);

  const allSiteInBook = route.params.allSiteInBook;

  const prevSite = async () => {
    console.log("Actual site: " + bookActualSite);

    if (bookActualSite < 0) {
      return;
    }
    if (bookActualSite === 0) {
      setBookActualSite(0);
      setActualPhotoIndexInGallery(1);
    }
    if (bookActualSite >= 1) {
      setBookActualSite((prevSite) => prevSite - 1);
      setActualPhotoIndexInGallery(1);

      const allNewImage = [];

      allNewImage.push(allUrls[bookActualSite]);
      allNewImage.push(allUrls[bookActualSite - 1]);
      allNewImage.push(allUrls[bookActualSite - 2]);

      setImageList(allNewImage);
    }

    console.log("prev site button click");
  };

  const nextSite = () => {
    console.log("Actual site: " + bookActualSite);

    if (bookActualSite > allSiteInBook) {
      return;
    }
    if (bookActualSite === allSiteInBook - 2) {
      setBookActualSite(allSiteInBook - 1);
      setActualPhotoIndexInGallery(2);
    }
    if (bookActualSite < allSiteInBook - 2) {
      setBookActualSite((prevSite) => prevSite + 1);
      setActualPhotoIndexInGallery(1);

      const allNewImage = [];

      allNewImage.push(allUrls[bookActualSite]);
      allNewImage.push(allUrls[bookActualSite + 1]);
      allNewImage.push(allUrls[bookActualSite + 2]);

      setImageList(allNewImage);
    }

    console.log("prev site button click");
  };

  useEffect(() => {
    setIndicatorIsActive(true);
    const bookLengthPropAsNumber = parseInt(route.params.bookLengthProp);
    console.log("bookLengthProp jako liczba:", bookLengthPropAsNumber);

    setBookActualSite(bookLengthPropAsNumber - 1);
    const newActualSite = bookLengthPropAsNumber - 1;

    const fetchImg = async () => {
      console.log("BookLength: " + newActualSite);
      try {
        const res = await listAll(storageRef);
        const imageUrls = await Promise.all(
          res.items.map((item) => getDownloadURL(item))
        );

        setAllUrls(imageUrls);

        const actualPhotos = [];

        if (newActualSite !== 0 && imageUrls.length > newActualSite + 1) {
          setActualPhotoIndexInGallery(1);
          actualPhotos.push(imageUrls[newActualSite - 1]);
          actualPhotos.push(imageUrls[newActualSite]);
          actualPhotos.push(imageUrls[newActualSite + 1]);
        } else if (imageUrls.length > newActualSite) {
          setActualPhotoIndexInGallery(0);
          actualPhotos.push(imageUrls[newActualSite]);
          if (imageUrls.length > newActualSite + 1) {
            actualPhotos.push(imageUrls[newActualSite + 1]);
          }
        }

        setImageList(actualPhotos);
      } catch (err) {
        console.log("Błąd podczas pobierania obrazów:", err);
      }
    };

    fetchImg();
    setIndicatorIsActive(false);
  }, []);

  if (indicatorIsActive) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {indicatorIsActive}
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{ uri: imageList[actualPhotoIndexInGallery] }}
      />
      <Text style={styles.siteNumberText}>
        {bookActualSite + 1}/{allSiteInBook}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={prevSite} style={styles.buttonArrow}>
          <Text style={styles.textArrow}>&lt;</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextSite} style={styles.buttonArrow}>
          <Text style={styles.textArrow}>&gt;</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "culumn",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gallery: {
    flex: 1,
  },
  image: {
    width: "100%", // dostosuj szerokość i wysokość obrazu do swoich potrzeb
    height: "90%",
    flex: 1,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  buttonArrow: {
    width: "50%",
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textArrow: {
    fontSize: 20,
    // fontWeight: "300",
  },
  siteNumberText: {
    width: "100%",
    height: 10,
    fontSize: 14,
    height: 30,
    position: "absolute",
    bottom: 20,
    textAlign: "center",
  },
});

export default ShowBookGallery;
