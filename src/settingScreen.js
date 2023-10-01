import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { View, Text, StyleSheet } from "react-native";
import { ref as sRef, get as sGet } from "firebase/database";

import { firebaseRealtime } from "./firebase";

const SettingScreen = () => {
  const actualUserId = useSelector((state) => state.userStatus.userId);

  const [indicatorIsActive, setIndicatorIsActive] = useState(false);
  const [allocatedData, setAllocatedData] = useState();
  const [useData, setUseData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setIndicatorIsActive(true);
      try {
        const getAllocatedData = sRef(
          firebaseRealtime,
          `/users/${actualUserId}/allocatedDiskSpace`
        );
        const getUsedData = sRef(
          firebaseRealtime,
          `/users/${actualUserId}/diskSpaceUsed`
        );

        const allocatedSnapshot = await sGet(getAllocatedData);
        if (allocatedSnapshot.exists()) {
          const allocatedDataValue = allocatedSnapshot.val();
          setAllocatedData(allocatedDataValue); // Ustaw dane w stanie
        } else {
          console.log("allocatedDiskSpace nie istnieje lub jest puste.");
        }

        // Pobierz dane o diskSpaceUsed
        const usedSnapshot = await sGet(getUsedData);
        if (usedSnapshot.exists()) {
          const usedDataValue = usedSnapshot.val();
          setUseData(usedDataValue.toFixed(3)); // Ustaw dane w stanie
        } else {
          console.log("diskSpaceUsed nie istnieje lub jest puste.");
        }

        setIndicatorIsActive(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Przydzielone dane:</Text>
      <Text style={styles.textData}>{allocatedData} MB</Text>
      <Text style={styles.text}>Użyte dane:</Text>
      <Text style={styles.textData}>{useData} MB</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  textData: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
    color: "red",
  },
});

export default SettingScreen;
