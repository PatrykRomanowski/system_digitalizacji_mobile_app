import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { Provider } from "react-redux";

import Ionicons from "react-native-vector-icons/Ionicons";

import TitleScreen from "./src/titleScreen";
import LoginScreen from "./src/loginScreen";
import BookScreen from "./src/bookScreen";
import SettingScreen from "./src/settingScreen";
import ReceiptScreen from "./src/receiptScreen";
import DocumentScreen from "./src/documentsScreen";
import ShowDocumentGallery from "./src/showDocumentGallery";
import ShowBookGallery from "./src/showBookGallery";

import store from "./storage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainStack() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Book"
        component={BookScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Books",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="document"
        options={{
          headerShown: false,
          tabBarLabel: "Documents",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="documents" color={color} size={size} />
          ),
        }}
        component={DocumentScreen}
      />
      <Tab.Screen
        name="Receipt"
        component={ReceiptScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Receipt",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Settings",
          title: "STRONA GŁÓWNA2",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Title">
          <Stack.Screen
            name="Title"
            component={TitleScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={MainStack}
            options={{
              title: "WRÓĆ DO LOGOWANIA",
            }}
          />
          <Stack.Screen
            name="GalleryDocument"
            component={ShowDocumentGallery}
            options={{
              title: "WRÓĆ DO STRONY GŁÓWNEJ",
            }}
          />
          <Stack.Screen
            name="BookGallery"
            component={ShowBookGallery}
            options={{
              title: "WRÓĆ DO STRONY GŁÓWNEJ",
            }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            // options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
